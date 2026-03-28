"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, MapPin, CheckCircle, Leaf, Recycle } from "lucide-react";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Severity, WasteType } from "@/types";
import { toast } from "sonner";

interface AIResult {
  wasteTypes: WasteType[];
  severity: Severity;
  confidence: number;
  summary: string;
  recyclingGuidance: string;
  carbonSaving: number;
}

const STEPS = ["uploading", "analyzing", "submitting"] as const;
type Step = "idle" | typeof STEPS[number] | "done";

const STEP_LABELS: Record<string, string> = {
  uploading: "Compressing & uploading image...",
  analyzing: "AI analyzing waste...",
  submitting: "Saving report...",
};

function getProgress(step: Step): number {
  if (step === "idle") return 0;
  if (step === "uploading") return 30;
  if (step === "analyzing") return 65;
  if (step === "submitting") return 90;
  if (step === "done") return 100;
  return 0;
}

export default function ReportForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [description, setDescription] = useState("");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Compress in background
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });
      setCompressedFile(compressed);
    } catch {
      // fallback to original if compression fails
      setCompressedFile(file);
    }
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Location captured!");
      },
      () => setError("Could not get location. Please enable GPS.")
    );
  };

  const handleSubmit = async () => {
    if (!compressedFile || !location) {
      setError("Please add a photo and allow location access.");
      return;
    }
    setError(null);

    try {
      // 1. Upload image
      setStep("uploading");
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || uploadData.error) throw new Error(uploadData.error || "Upload failed");
      const { url: imageUrl, publicId } = uploadData;

      // 2. Analyze with AI
      setStep("analyzing");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const analysis = await analyzeRes.json();
      if (!analyzeRes.ok || analysis.error) throw new Error(analysis.error || "Analysis failed");
      if (!analysis.wasteTypes || !analysis.severity) throw new Error("Invalid AI response");
      setAiResult(analysis);

      // 3. Save report
      setStep("submitting");
      const saveRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          publicId,
          location,
          wasteTypes: analysis.wasteTypes,
          severity: analysis.severity,
          description,
          aiAnalysis: {
            confidence: analysis.confidence,
            rawLabels: analysis.rawLabels,
            summary: analysis.summary,
            recyclingGuidance: analysis.recyclingGuidance,
            carbonSaving: analysis.carbonSaving,
          },
        }),
      });
      if (!saveRes.ok) throw new Error("Failed to save report");

      setStep("done");
      toast.success(`Report submitted! You saved ~${analysis.carbonSaving}kg CO₂ 🌱`);
      setTimeout(() => router.push("/map"), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      toast.error(msg);
      setStep("idle");
    }
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <CheckCircle className="text-green-500 w-16 h-16" />
        <h2 className="text-2xl font-bold text-gray-800">Report Submitted!</h2>
        {aiResult && (
          <p className="text-green-600 font-medium">
            🌱 You helped save ~{aiResult.carbonSaving}kg of CO₂
          </p>
        )}
        <p className="text-gray-500">Redirecting to the map...</p>
      </div>
    );
  }

  const isLoading = (STEPS as readonly string[]).includes(step);
  const progress = getProgress(step);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Image Upload */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-10 h-10" />
            <p className="font-medium">Drop photo here or click to upload</p>
            <p className="text-sm">Auto-compressed before upload</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Location */}
      <button
        onClick={getLocation}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-colors font-medium ${
          location
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-gray-300 text-gray-600 hover:border-green-400"
        }`}
      >
        <MapPin className="w-5 h-5" />
        {location ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Capture GPS Location"}
      </button>

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional: describe what you see..."
        className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
        rows={3}
      />

      {/* AI Result Preview */}
      {aiResult && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700">AI Analysis</p>
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={aiResult.severity} />
            {aiResult.wasteTypes.map((t) => (
              <span key={t} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">{t}</span>
            ))}
          </div>
          <p className="text-xs text-gray-500">{aiResult.summary}</p>

          {/* Carbon Saving */}
          <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2">
            <Leaf className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-xs text-green-700 font-medium">
              Reporting this waste could save ~{aiResult.carbonSaving}kg CO₂ from landfill
            </p>
          </div>

          {/* Recycling Guidance */}
          <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-2">
            <Recycle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">{aiResult.recyclingGuidance}</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{STEP_LABELS[step]}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <Camera className="w-5 h-5" />
        {isLoading ? STEP_LABELS[step] : "Submit Report"}
      </button>
    </div>
  );
}
