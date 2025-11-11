import { NextResponse } from "next/server";
import { products as seedProducts } from "@/app/lib/seed_data";

type ChatRequest = {
  message: string;
  requestId?: string;
  history?: { role: "user" | "assistant"; content: string }[];
};

type Doc = {
  id: string;
  title: string;
  text: string;
  vec: Map<string, number>;
  fields: {
    warranty_period?: string;
    warranty_method?: string;
    order_fulfillment?: string;
    info?: string;
  };
};

function vnNormalize(text: string) {
  return text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}

function tokenize(text: string) {
  const clean = vnNormalize(text);
  return clean.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function toVector(tokens: string[]) {
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) || 0) + 1);
  return map;
}

function cosine(a: Map<string, number>, b: Map<string, number>) {
  let dot = 0, na = 0, nb = 0;
  for (const [k, v] of a) {
    na += v * v;
    dot += v * (b.get(k) || 0);
  }
  for (const v of b.values()) nb += v * v;
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Precompute document vectors
const docs = seedProducts.map((p, i) => {
  const text = [p.name, p.info || "", p.order_fulfillment || "", p.warranty_method || "", p.warranty_period || ""].join("\n\n");
  const tokens = tokenize(text);
  const vec = toVector(tokens);
  return {
    id: `prod-${i}`,
    title: p.name,
    text,
    vec,
    fields: { ...p },
  };
});

// ----------------- Generative Model Call -----------------
async function callGenerativeModel(payload: any) {
  const url = process.env.GENERATIVE_API_URL;
  const key = process.env.GENERATIVE_API_KEY;
  const model = process.env.GENERATIVE_MODEL || "gemini-2.0-flash";

  if (!url || !key) {
    console.error("Missing GENERATIVE_API_URL or GENERATIVE_API_KEY");
    return null;
  }

  try {
    const body = {
      model,
      contents: [{ parts: [{ text: payload.prompt || payload || "" }] }],
    };

    const res = await fetch(`${url}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const rawText = await res.text();
    console.log("Raw Google API Response:", rawText);

    if (!res.ok) {
      console.error(`Google API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = JSON.parse(rawText);
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    console.error("callGenerativeModel error:", err);
    return null;
  }
}

// ----------------- Intent Classification -----------------
function classifyIntent(q: string): "warranty" | "payment" | "returns" | "generic" | "greeting" {
  const s = vnNormalize(q);
  if (["hi", "hello", "hey", "xin chao"].some(k => s.includes(k))) return "greeting";
  if (["warranty", "bao hanh", "bảo hành"].some(k => s.includes(k))) return "warranty";
  if (["payment", "thanh toán", "pay", "mua"].some(k => s.includes(k))) return "payment";
  if (["return", "trả hàng", "hoàn trả"].some(k => s.includes(k))) return "returns";
  return "generic";
}

// ----------------- Post Processing -----------------
function normalizeServerAnswer(a: string) {
  if (!a) return a;
  let s = String(a).replace(/[\t\f\v]+/g, " ").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  const lines = s.split(/\n/).map(l => l.trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of lines) if (!out.includes(line)) out.push(line);
  s = out.join("\n");
  if (!/[\.\?\!]$/.test(s) && s.length < 200) s += ".";
  return s;
}

function postProcessShort(text: string, intent: string) {
  if (!text) return text;
  const truncateWords = (s: string, max: number) => {
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length <= max) return s;
    return words.slice(0, max).join(" ") + "...";
  };
  return truncateWords(text, intent === "greeting" ? 50 : 100);
}

// ----------------- Cache -----------------
const requestCache = new Map<string, { answer: string; sources: string[]; intent: string }>();

// ----------------- POST Handler -----------------
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const q = (body.message || "").trim();
    const requestId = body.requestId;
    const history = body.history || [];

    if (!q) return NextResponse.json({ ok: false, error: "Empty message" }, { status: 400 });

    // Cache lookup
    if (requestId && requestCache.has(requestId)) {
      return NextResponse.json({ ok: true, ...requestCache.get(requestId)! });
    }

    // Handle short/greeting queries quickly
    if (q.length <= 3 || ["hi", "hello", "hey"].includes(vnNormalize(q))) {
      const answer = "Hi! How can I assist you with DigiShop services today?";
      const response = { answer, sources: [], intent: "greeting" };
      if (requestId) requestCache.set(requestId, response);
      return NextResponse.json({ ok: true, ...response });
    }

    const intent = classifyIntent(q);

    // Contextual query using recent history
    let contextualQuery = q;
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i].content;
      const foundProduct = docs.find(d => vnNormalize(msg).includes(vnNormalize(d.title)));
      if (foundProduct) {
        contextualQuery = `${q} for ${foundProduct.title}`;
        break;
      }
    }

    const qVec = toVector(tokenize(contextualQuery));

    // Document retrieval with cosine similarity + keyword boost
    const scored = docs
      .map(d => ({ d, score: cosine(qVec, d.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .filter(s => s.score > 0);

    const retrievedText = scored
      .map((s, idx) => `DOC ${idx + 1} - ${s.d.title}:\n${s.d.text}`)
      .join("\n\n---\n\n");

    const prompt = `You are a concise DigiShop support agent. Answer ONLY using the documents.\nRELEVANT DOCUMENTS:\n${retrievedText || "No relevant documents found."}\nUSER QUESTION:\n${q}`;

    // Call Google Gemini API
    const gen = await callGenerativeModel({ prompt });

    // Fallback answers
    let answer: string;
    let sources: string[] = scored.map(s => s.d.title);
    if (gen) {
      answer = postProcessShort(normalizeServerAnswer(gen), intent);
    } else {
      if (intent === "warranty" && scored[0]) {
        const d = scored[0].d;
        answer = `- Warranty period: ${d.fields.warranty_period || "Theo gói đã chọn"}\n- Refund policy: ${d.fields.warranty_method || "Hoàn/đổi theo phần thời gian chưa dùng"}\n- Not covered: Thay đổi email/mật khẩu/PIN, xóa profile, vi phạm TOS.`;
      } else if (intent === "payment" && scored[0]) {
        const d = scored[0].d;
        answer = `Pay through the website, and you'll instantly receive ${d.fields.order_fulfillment?.toLowerCase() || "credentials or invitation link"}.`;
      } else if (intent === "returns" && scored[0]) {
        answer = "Return within 7 days for full refund; after 7 days, proportional refund. No returns for unauthorized changes or TOS violations.";
      } else {
        answer = "Sorry — I couldn't find relevant documents to answer that. Please try again or contact support.";
      }
    }

    const response = { answer, sources, intent };
    if (requestId) requestCache.set(requestId, response);

    return NextResponse.json({ ok: true, ...response });

  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
