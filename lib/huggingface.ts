import { WasteType, Severity } from "@/types";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY!;
const WASTE_MODEL = "microsoft/resnet-50";

const WASTE_LABEL_MAP: Record<string, WasteType> = {
  plastic: "plastic",
  bottle: "plastic",
  bag: "plastic",
  "plastic bag": "plastic",
  container: "plastic",
  organic: "organic",
  food: "organic",
  vegetable: "organic",
  fruit: "organic",
  compost: "organic",
  electronic: "electronic",
  electronics: "electronic",
  battery: "electronic",
  computer: "electronic",
  phone: "electronic",
  hazardous: "hazardous",
  chemical: "hazardous",
  toxic: "hazardous",
  paint: "hazardous",
  cardboard: "mixed",
  paper: "mixed",
  metal: "mixed",
  glass: "mixed",
  tin: "mixed",
  can: "mixed",
  trash: "mixed",
  garbage: "mixed",
  waste: "mixed",
  litter: "mixed",
  rubbish: "mixed",
  debris: "mixed",
};

// kg CO2 saved per kg of waste diverted from landfill
const CARBON_SAVINGS_KG: Record<WasteType, number> = {
  plastic: 1.5,
  organic: 0.5,
  electronic: 20.0,
  hazardous: 5.0,
  mixed: 0.8,
  unknown: 0.5,
};

const RECYCLING_GUIDANCE: Record<WasteType, string> = {
  plastic: "Rinse and flatten plastic items before placing in the blue recycling bin. Remove caps and labels where possible.",
  organic: "Place in the green compost bin. Food scraps and garden waste can be composted to create nutrient-rich soil.",
  electronic: "Do NOT place in regular bins. Take to your nearest e-waste drop-off point or electronics retailer recycling program.",
  hazardous: "Handle with care. Take to a licensed hazardous waste facility. Never pour chemicals down drains or mix with regular waste.",
  mixed: "Sort items where possible — paper, metal, and glass go in the recycling bin. Non-recyclables go in the general waste bin.",
  unknown: "Sort and separate waste types before disposal. When in doubt, check your local council's waste guide.",
};

function mapLabelsToWasteTypes(labels: string[]): WasteType[] {
  const types = new Set<WasteType>();
  for (const label of labels) {
    const lower = label.toLowerCase();
    for (const [key, type] of Object.entries(WASTE_LABEL_MAP)) {
      if (lower.includes(key)) types.add(type);
    }
  }
  return types.size > 0 ? Array.from(types) : ["mixed"];
}

function inferSeverity(confidence: number, labelCount: number): Severity {
  const score = confidence * (1 + labelCount * 0.1);
  if (score > 0.85) return "critical";
  if (score > 0.65) return "severe";
  if (score > 0.4) return "moderate";
  return "mild";
}

function estimateCarbonSaving(wasteTypes: WasteType[], severity: Severity): number {
  const severityMultiplier: Record<Severity, number> = {
    mild: 1,
    moderate: 3,
    severe: 8,
    critical: 20,
  };
  const base = wasteTypes.reduce((sum, t) => sum + (CARBON_SAVINGS_KG[t] ?? 0.5), 0);
  return parseFloat((base * severityMultiplier[severity]).toFixed(2));
}

function buildRecyclingGuidance(wasteTypes: WasteType[]): string {
  return wasteTypes.map((t) => RECYCLING_GUIDANCE[t]).join(" | ");
}

export async function analyzeWasteImage(imageUrl: string): Promise<{
  wasteTypes: WasteType[];
  severity: Severity;
  confidence: number;
  rawLabels: string[];
  summary: string;
  recyclingGuidance: string;
  carbonSaving: number;
}> {
  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error("Failed to fetch image for analysis");
    const imageBuffer = await imageRes.arrayBuffer();

    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${WASTE_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "image/jpeg",
        },
        body: imageBuffer,
      }
    );

    if (!response.ok) throw new Error(`HuggingFace API error: ${response.status}`);

    const results: { label: string; score: number }[] = await response.json();
    const topResults = results.slice(0, 5);
    const rawLabels = topResults.map((r) => r.label);
    const confidence = topResults[0]?.score ?? 0;
    const wasteTypes = mapLabelsToWasteTypes(rawLabels);
    const severity = inferSeverity(confidence, topResults.length);
    const carbonSaving = estimateCarbonSaving(wasteTypes, severity);
    const recyclingGuidance = buildRecyclingGuidance(wasteTypes);

    return {
      wasteTypes,
      severity,
      confidence,
      rawLabels,
      summary: `Detected: ${rawLabels.join(", ")}. Confidence: ${(confidence * 100).toFixed(1)}%.`,
      recyclingGuidance,
      carbonSaving,
    };
  } catch {
    return {
      wasteTypes: ["mixed"],
      severity: "mild",
      confidence: 0,
      rawLabels: [],
      summary: "AI analysis unavailable. Manual review required.",
      recyclingGuidance: RECYCLING_GUIDANCE.mixed,
      carbonSaving: 0,
    };
  }
}
