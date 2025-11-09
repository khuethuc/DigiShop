import { NextResponse } from "next/server";
import { products as seedProducts } from "@/app/lib/seed_data";

type ChatRequest = {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
};

// function tokenize(text: string) {
//   return text
//     .toLowerCase()
//     .split(/[^a-z0-9]+/)
type Doc = {
  id: string;
  title: string;
  text: string;
  vec: Map<string, number>;
  fields: {
    warranty_period?: string;
    warranty_method?: string;
  };
};
//     .filter(Boolean);
// }

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
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [k, v] of a) {
    na += v * v;
    const bv = b.get(k) || 0;
    dot += v * bv;
  }
  for (const v of b.values()) nb += v * v;
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

const docs = seedProducts.map((p, i) => {
  const text = [p.name, p.info || "", p.order_fulfillment || "", p.warranty_method || "", p.warranty_period || ""].join("\n\n");
  const tokens = tokenize(text);
  const vec = toVector(tokens);
  return {
    id: `prod-${i}`,
    title: p.name,
    text,
    vec,
    fields: {
      warranty_period: p.warranty_period,
      warranty_method: p.warranty_method
    }
  };
});

async function callGenerativeModel(prompt: string) {
  const url = process.env.GENERATIVE_API_URL;
  const key = process.env.GENERATIVE_API_KEY;
  if (!url || !key) {
    return null;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ prompt, max_tokens: 512 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.text ?? data.output ?? data.response ?? data;
  } catch {
    return null;
  }
}

function classifyIntent(q: string) {
  const s = vnNormalize(q);
  const kwWarranty = ["warranty", "bao hanh", "bảo hành", "refund", "hoan tien", "hoàn tiền", "guarantee"];
  if (kwWarranty.some(k => s.includes(k))) return "warranty";
  const kwDelivery = [ "nhanh", "instant"];
  if (kwDelivery.some(k => s.includes(k))) return "delivery";
  return "generic";
}

function extractWarrantyFromFreeText(text: string) {
  const t = text;
  const pick = [];
  const cond = /Warranty Conditions[\s\S]*?(?=(Warranty Will Not Apply|$))/i.exec(t);
  if (cond) pick.push(cond[0].trim());
  const excl = /Warranty Will Not Apply[\s\S]*$/i.exec(t);
  if (excl) pick.push(excl[0].trim());
  return pick.join("\n\n");
}

function keywordProximityBoost(q: string, d: Doc) {
  const s = vnNormalize(q);
  const isWarranty = classifyIntent(q) === "warranty";
  if (!isWarranty) return 0;

  const hay = vnNormalize([d.fields.warranty_period, d.fields.warranty_method].join("\n"));
  const hits = ["warranty", "bao hanh", "bảo hành", "refund", "hoan tien", "hoàn tiền"]
    .reduce((acc, k) => acc + (hay.includes(k) ? 1 : 0), 0);
  return hits * 0.2; // cộng nhẹ vào điểm cosine
}

function buildContextForDoc(d: Doc, intent: string) {
  if (intent === "warranty") {
    const extra = extractWarrantyFromFreeText(d.text);
    return [
      d.title && `Title: ${d.title}`,
      d.fields.warranty_period && `Warranty Period: ${d.fields.warranty_period}`,
      d.fields.warranty_method && `Warranty Method: ${d.fields.warranty_method}`,
      extra && `Warranty Notes:\n${extra}`,
    ].filter(Boolean).join("\n");
  }
  return `Title: ${d.title}\n${d.text}`;
}
function buildPrompt(intent: string, retrievedText: string, q: string) {
  const system =
`You are a concise DigiShop support agent.
Answer ONLY using the provided documents.
If unknown, say you don't know and offer to escalate.
Keep the answer VERY short and structured.`;

  // Template cho warranty
  const formatWarranty =
`Return a 3–5 line answer:
- Warranty period:
- Refund policy:
- Not covered:
Max 90 words. No marketing.`;

  const formatGeneric = `Keep to 3 bullet lines. Max 100 words.`;

  const format = intent === "warranty" ? formatWarranty : formatGeneric;

  return `${system}

RELEVANT DOCUMENTS:
${retrievedText || "No relevant documents found."}

USER QUESTION:
${q}

INSTRUCTIONS:
${format}`;
}
function postProcessShort(answer: string, intent: string) {
  let out = answer.trim();

  // Cắt markdown/thừa
  out = out.replace(/\n{3,}/g, "\n\n").trim();

  // Giới hạn ~100 từ
  const words = out.split(/\s+/);
  if (words.length > 100) out = words.slice(0, 100).join(" ") + "…";

  // Nếu warranty mà thiếu 3 dòng, cố định format
  if (intent === "warranty" && !/Warranty period:/i.test(out)) {
    // tạo từ kho tài liệu không cần model (rất ngắn gọn)
    out = out.replace(/^- /gm, ""); // normalize
    // nếu vẫn không có, trả câu “không tìm thấy”
  }

  return out;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const q = (body.message || "").trim();
    if (!q) return NextResponse.json({ ok: false, error: "Empty message" }, { status: 400 });

    const intent = classifyIntent(q);

    // retrieval
    const qVec = toVector(tokenize(q));
    const scored = docs
      .map((d) => ({ d, score: cosine(qVec, d.vec) + keywordProximityBoost(q, d) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .filter((s) => s.score > 0);

    // Chỉ feed phần cần thiết theo intent
    const retrievedText = scored
      .map((s, idx) => `DOC ${idx + 1} - ${s.d.title}:\n${buildContextForDoc(s.d, intent)}`)
      .join("\n\n---\n\n");

    const prompt = buildPrompt(intent, retrievedText, q);

    const gen = await callGenerativeModel(
      JSON.stringify({
        prompt,
        max_tokens: 220,       // giảm để ngắn gọn
        temperature: 0.2,
        stop: ["\n\n\n"],      // dừng sớm
      })
    );

    if (gen) {
      const raw = typeof gen === "string" ? gen : JSON.stringify(gen);
      const answer = postProcessShort(raw, intent);
      return NextResponse.json({ ok: true, answer, sources: scored.map((s) => s.d.title), intent });
    }

    // Fallback: tự tóm tắt cực ngắn cho warranty
    if (intent === "warranty" && scored[0]) {
      const d = scored[0].d;
      const extra = extractWarrantyFromFreeText(d.text);
      const short =
        `- Warranty period: ${d.fields.warranty_period || "Theo gói đã chọn"}\n` +
        `- Refund policy: ${d.fields.warranty_method || "Hoàn/đổi theo phần thời gian chưa dùng"}\n` +
        `- Not covered: thay đổi email/mật khẩu/PIN, xóa profile, vi phạm TOS.`;
      return NextResponse.json({ ok: true, answer: short, sources: [d.title], intent });
    }

    const fallback = retrievedText || "Sorry — I couldn't find relevant documents to answer that. Please try again or contact support.";
    return NextResponse.json({ ok: true, answer: fallback, sources: scored.map((s) => s.d.title), intent });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}