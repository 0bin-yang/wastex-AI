import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWasteReport extends Document {
  imageUrl: string;
  publicId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  wasteTypes: string[];
  severity: "mild" | "moderate" | "severe" | "critical";
  description?: string;
  aiAnalysis?: {
    confidence: number;
    rawLabels: string[];
    summary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WasteReportSchema = new Schema<IWasteReport>(
  {
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary Public ID is required"],
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    wasteTypes: {
      type: [String],
      default: [],
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe", "critical"],
      required: [true, "Severity level is required"],
      default: "mild",
    },
    description: {
      type: String,
      trim: true,
    },
    aiAnalysis: {
      confidence: { type: Number },
      rawLabels: [{ type: String }],
      summary: { type: String },
      recyclingGuidance: { type: String },
      carbonSaving: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

WasteReportSchema.index({ "location.lat": 1, "location.lng": 1 });

export const WasteReport: Model<IWasteReport> =
  mongoose.models.WasteReport ||
  mongoose.model<IWasteReport>("WasteReport", WasteReportSchema);
