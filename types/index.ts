export type WasteType =
  | "plastic"
  | "organic"
  | "electronic"
  | "hazardous"
  | "mixed"
  | "unknown";

export type Severity = "mild" | "moderate" | "severe" | "critical";

export interface WasteReport {
  _id?: string;
  imageUrl: string;
  publicId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  wasteTypes: WasteType[];
  severity: Severity;
  description?: string;
  aiAnalysis: {
    confidence: number;
    rawLabels: string[];
    summary: string;
    recyclingGuidance?: string;
    carbonSaving?: number;
  };
  createdAt: string;
}

export interface ReportFilters {
  severity?: Severity;
  wasteType?: WasteType;
  dateFrom?: string;
  dateTo?: string;
}
