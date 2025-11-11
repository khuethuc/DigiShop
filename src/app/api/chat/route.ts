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
      warranty_method: p.warranty_method,
      order_fulfillment: p.order_fulfillment,
      info: p.info,
    },
  };
});

async function callGenerativeModel(payload: any) {
  const url = process.env.GENERATIVE_API_URL;
  const key = process.env.GENERATIVE_API_KEY;
  if (!url || !key) {
    console.error("Missing GENERATIVE_API_URL or GENERATIVE_API_KEY");
    return null;
  }

  let parsed: any = null;
  if (typeof payload === "string") {
    try {
      parsed = JSON.parse(payload);
    } catch (e) {
      parsed = null;
    }
  } else {
    parsed = payload;
  }

  try {
    if (url.includes("openai") || url.includes("api.openai.com")) {
      const model = process.env.GENERATIVE_MODEL || "gpt-4o-mini";
      const body: any = {
        model: parsed?.model || model,
        messages: parsed?.messages || [{ role: "user", content: parsed?.prompt || payload }],
        max_tokens: parsed?.max_tokens || 512,
        temperature: parsed?.temperature ?? 0.7,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error(`OpenAI API error: ${res.status} ${res.statusText}`);
        return null;
      }
      const data = await res.json();
      const choice = data.choices?.[0];
      if (!choice) {
        console.error("No choices in OpenAI response");
        return null;
      }
      return choice.message?.content ?? choice.text ?? null;
    }

    const genericBody = parsed ?? { prompt: payload, max_tokens: 512 };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(genericBody),
    });
    if (!res.ok) {
      console.error(`Generic API error: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data.text ?? data.output ?? data.response ?? null;
  } catch (err) {
    console.error("callGenerativeModel error:", err);
    return null;
  }
}

function classifyIntent(q: string): "warranty" | "payment" | "returns" | "generic" | "greeting" {
  const s = vnNormalize(q);
  const kwWarranty = ["warranty", "bao hanh", "bảo hành", "refund", "hoan tien", "hoàn tiền", "guarantee"];
  const kwPayment = ["payment", "thanh toán", "pay", "mua", "instant", "buy", "purchase"];
  const kwReturns = ["return", "trả hàng", "tra hang", "hoàn trả", "hoan tra", "refund", "hoan tien", "hoàn tiền"];
  const kwGreeting = ["hi", "hello", "hey", "xin chao"];
  if (kwWarranty.some((k) => s.includes(k))) return "warranty";
  if (kwPayment.some((k) => s.includes(k))) return "payment";
  if (kwReturns.some((k) => s.includes(k))) return "returns";
  if (kwGreeting.some((k) => s.includes(k))) return "greeting";
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
  const intent = classifyIntent(q);
  const hay = vnNormalize([d.text, d.fields.warranty_period, d.fields.warranty_method].join("\n"));
  if (intent === "warranty") {
    const hits = ["warranty", "bao hanh", "bảo hành", "refund", "hoan tien", "hoàn tiền"]
      .reduce((acc, k) => acc + (hay.includes(k) ? 1 : 0), 0);
    return hits * 0.2;
  } else if (intent === "payment") {
    const hits = ["payment", "thanh toán", "pay", "mua", "instant"].reduce((acc, k) => acc + (hay.includes(k) ? 1 : 0), 0);
    return hits * 0.2;
  } else if (intent === "returns") {
    const hits = ["refund", "hoan tien", "hoàn tiền", "return", "trả hàng"].reduce((acc, k) => acc + (hay.includes(k) ? 1 : 0), 0);
    return hits * 0.2;
  }
  return 0;
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
  } else if (intent === "payment") {
    return [
      d.title && `Title: ${d.title}`,
      d.text && `Description: ${d.text}`,
      d.fields.order_fulfillment && `Delivery: ${d.fields.order_fulfillment}`,
    ].filter(Boolean).join("\n");
  } else if (intent === "returns") {
    const extra = extractWarrantyFromFreeText(d.text);
    return [
      d.title && `Title: ${d.title}`,
      d.fields.warranty_period && `Warranty Period: ${d.fields.warranty_period}`,
      d.fields.warranty_method && `Warranty Method: ${d.fields.warranty_method}`,
      extra && `Return Notes:\n${extra}`,
    ].filter(Boolean).join("\n");
  } else if (intent === "greeting") {
    return `Title: General Support\nDigiShop offers services like Deezer Premium, Google One, Canva Pro, and Evernote Premium. Ask about payment, returns, or warranties!`;
  }
  return `Title: ${d.title}\n${d.text}`;
}

function buildPrompt(intent: string, retrievedText: string, q: string) {
  const system = `You are a concise DigiShop support agent. Answer ONLY using the provided documents. If unknown, say you don't know and offer to escalate. Keep the answer VERY short and to the point.`;
  const formatWarranty = `Return a 3-5 line answer:\n- Warranty period:\n- Refund policy:\n- Not covered:\nMax 90 words. No marketing.`;
  const formatPayment = `Explain the payment process in 1-3 sentences, including how credentials or invitations are delivered. Max 100 words.`;
  const formatReturns = `Describe the return process in 2-4 sentences, including refund conditions and exclusions. Max 100 words.`;
  const formatGreeting = `Respond with a friendly greeting and offer assistance in 1-2 sentences. Max 50 words.`;
  const formatGeneric = `Keep your answer to 1-3 short sentences. Max 100 words.`;
  const format =
    intent === "warranty" ? formatWarranty :
    intent === "payment" ? formatPayment :
    intent === "returns" ? formatReturns :
    intent === "greeting" ? formatGreeting : formatGeneric;
  const extra = "Use natural, conversational language. Do not repeat the user's question. Do not start with 'Based on the documents...'.";
  return `${system}\n\nRELEVANT DOCUMENTS:\n${retrievedText || "No relevant documents found."}\n\nUSER QUESTION:\n${q}\n\nINSTRUCTIONS:\n${format}\n${extra}`;
}

function normalizeServerAnswer(a: string) {
  if (!a) return a;
  let s = String(a).replace(/[\t\f\v]+/g, " ").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n");
  s = s.trim();
  s = s.replace(/(\b\w+\b)(?:\s+\1)+/gi, "$1");
  const lines = s.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    if (out.length > 0 && out[out.length - 1] === line) continue;
    out.push(line);
  }
  s = out.join("\n");
  if (!/[\.\?\!]$/.test(s) && s.split(/[\.\?\!]/).length <= 1 && s.length < 200) {
    s = s + ".";
  }
  return s;
}

const requestCache = new Map<string, { answer: string; sources: string[]; intent: string }>();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const q = (body.message || "").trim();
    const requestId = body.requestId;
    const history = body.history || [];
    console.log(`Received request: Query="${q}", RequestId=${requestId || "none"}, HistoryLength=${history.length}`);
    if (!q) return NextResponse.json({ ok: false, error: "Empty message" }, { status: 400 });

    // Check cache for duplicate request
    if (requestId && requestCache.has(requestId)) {
      const cached = requestCache.get(requestId);
      console.log(`Returning cached response for RequestId=${requestId}`);
      return NextResponse.json({ ok: true, ...cached });
    }

    // Handle vague queries
    if (q.length <= 3 || ["hi", "hello", "hey"].includes(vnNormalize(q))) {
      const answer = "Hi! How can I assist you with DigiShop services today?";
      const response = { answer, sources: [], intent: "greeting" };
      if (requestId) {
        requestCache.set(requestId, response);
        setTimeout(() => requestCache.delete(requestId), 5 * 60 * 1000);
      }
      return NextResponse.json({ ok: true, ...response });
    }

    const intent = classifyIntent(q);
    console.log(`Intent: ${intent}, Query: ${q}, RequestId=${requestId || "none"}`);

    let contextualQuery = q;
    let lastDiscussedProduct = null;
    const recentHistory = history.slice(-5);
    for (let i = recentHistory.length - 1; i >= 0; i--) {
      const msg = recentHistory[i].content;
      const foundProduct = docs.find((d) => vnNormalize(msg).includes(vnNormalize(d.title)));
      if (foundProduct) {
        lastDiscussedProduct = foundProduct.title;
        break;
      }
    }
    if (lastDiscussedProduct) {
      contextualQuery = `${q} for ${lastDiscussedProduct}`;
    }
    console.log(`Contextual Query: ${contextualQuery}, Last Product: ${lastDiscussedProduct || "none"}`);

    const qVec = toVector(tokenize(contextualQuery));
    const scored = docs
      .map((d) => ({ d, score: cosine(qVec, d.vec) + keywordProximityBoost(q, d) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .filter((s) => s.score > 0);
    console.log(`Retrieved Docs: ${scored.map((s) => s.d.title).join(", ")}`);

    const retrievedText = scored
      .map((s, idx) => `DOC ${idx + 1} - ${s.d.title}:\n${buildContextForDoc(s.d, intent)}`)
      .join("\n\n---\n\n");

    const prompt = buildPrompt(intent, retrievedText, q);
    const payload = {
      prompt,
      max_tokens: 220,
      temperature: 0.2,
      stop: ["\n\n\n"],
    };

    const gen = await callGenerativeModel(payload);
    console.log(`Generative Model Response: ${gen || "none"}`);

    let answer, sources;
    if (gen) {
      const raw = typeof gen === "string" ? gen : JSON.stringify(gen);
      const normalizedRaw = normalizeServerAnswer(raw);
      answer = postProcessShort(normalizedRaw, intent);
      sources = scored.map((s) => s.d.title);
    } else if (intent === "warranty" && scored[0]) {
      const d = scored[0].d;
      const extra = extractWarrantyFromFreeText(d.text);
      answer =
        `- Warranty period: ${d.fields.warranty_period || "Theo gói đã chọn"}\n` +
        `- Refund policy: ${d.fields.warranty_method || "Hoàn/đổi theo phần thời gian chưa dùng"}\n` +
        `- Not covered: thay đổi email/mật khẩu/PIN, xóa profile, vi phạm TOS.`;
      sources = [d.title];
    } else if (intent === "payment" && scored[0]) {
      const d = scored[0].d;
      answer = `Pay through the website, and you'll instantly receive ${d.fields.order_fulfillment?.toLowerCase() || "credentials or an invitation link"}.`;
      sources = [d.title];
    } else if (intent === "returns" && scored[0]) {
      const d = scored[0].d;
      const extra = extractWarrantyFromFreeText(d.text);
      answer = `Return within 7 days if access is lost for a full refund or re-invitation. After 7 days, refunds are proportional to unused time. No returns for unauthorized changes or TOS violations.`;
      sources = [d.title];
    } else {
      answer = "Sorry — I couldn't find relevant documents to answer that. Please try again or contact support.";
      sources = scored.map((s) => s.d.title);
    }

    const response = { answer, sources, intent };
    if (requestId) {
      requestCache.set(requestId, response);
      setTimeout(() => requestCache.delete(requestId), 5 * 60 * 1000);
    }

    console.log(`Response: Answer="${answer}", Sources=[${sources.join(", ")}], Intent=${intent}`);
    return NextResponse.json({ ok: true, ...response });
  } catch (err) {
    console.error(`POST error: ${err}, Query="${q}", RequestId=${requestId || "none"}`);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

function postProcessShort(normalizedRaw: string, intent: string): string {
  if (!normalizedRaw) return normalizedRaw;

  const truncateWords = (s: string, max: number) => {
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length <= max) return s;
    return words.slice(0, max).join(" ") + "...";
  };

  if (intent === "warranty") {
    const lines = normalizedRaw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const tryExtract = (keys: string[]): string => {
      for (const l of lines) {
        const low = l.toLowerCase();
        for (const k of keys) {
          if (low.includes(k)) {
            const parts = l.split(/[:\-]\s*/);
            if (parts.length > 1) return parts.slice(1).join(": ").trim();
            return l.replace(new RegExp(k, "i"), "").replace(/^[:\-\s]+/, "").trim();
          }
        }
      }
      for (const k of keys) {
        const re = new RegExp(k + "[:\\-]?\\s*([^\\n\\r]+)", "i");
        const m = normalizedRaw.match(re);
        if (m && m[1]) return m[1].trim();
      }
      return "";
    };
    const period = tryExtract(["warranty period", "warranty:", "warranty", "thời gian bảo hành", "bao hành"]);
    const refund = tryExtract(["refund policy", "refund:", "refund", "hoàn tiền", "hoan tien"]);
    const notCovered = tryExtract(["not covered", "will not apply", "warranty will not apply", "không được bảo hành", "loại trừ"]);
    const p = period || "Theo gói đã chọn";
    const r = refund || "Hoàn/đổi theo phần thời gian chưa dùng";
    const n = notCovered || "Thay đổi email/mật khẩu/PIN, xóa profile, vi phạm TOS.";
    const out = `- Warranty period: ${p}\n- Refund policy: ${r}\n- Not covered: ${n}`;
    return truncateWords(out, 90);
  } else if (intent === "payment") {
    const sentences = normalizedRaw.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
    const pick = (sentences.slice(0, 2).join(" ") || normalizedRaw).trim();
    return truncateWords(pick, 100);
  } else if (intent === "returns") {
    const lines = normalizedRaw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const tryExtract = (keys: string[]): string => {
      for (const l of lines) {
        const low = l.toLowerCase();
        for (const k of keys) {
          if (low.includes(k)) {
            const parts = l.split(/[:\-]\s*/);
            if (parts.length > 1) return parts.slice(1).join(": ").trim();
            return l.replace(new RegExp(k, "i"), "").replace(/^[:\-\s]+/, "").trim();
          }
        }
      }
      for (const k of keys) {
        const re = new RegExp(k + "[:\\-]?\\s*([^\\n\\r]+)", "i");
        const m = normalizedRaw.match(re);
        if (m && m[1]) return m[1].trim();
      }
      return "";
    };
    const refund = tryExtract(["refund policy", "refund:", "refund", "hoàn tiền", "hoan tien", "return", "trả hàng"]);
    const notCovered = tryExtract(["not covered", "will not apply", "warranty will not apply", "không được bảo hành", "loại trừ"]);
    const r = refund || "Return within 7 days for a full refund or re-invitation; after 7 days, proportional refund.";
    const n = notCovered || "No returns for unauthorized changes or TOS violations.";
    const out = `${r}\n${n}`;
    return truncateWords(out, 100);
  } else if (intent === "greeting") {
    const sentences = normalizedRaw.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
    const pick = (sentences.slice(0, 1).join(" ") || normalizedRaw).trim();
    return truncateWords(pick || "Hi! How can I assist you with DigiShop services today?", 50);
  }

  const sentences = normalizedRaw.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
  const pick = (sentences.slice(0, 2).join(" ") || normalizedRaw).trim();
  return truncateWords(pick, 100);
}