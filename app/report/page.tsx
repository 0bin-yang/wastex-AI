import ReportForm from "@/components/ReportForm";

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report Waste</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a photo — AI will detect waste type and severity automatically.</p>
      </div>
      <ReportForm />
    </div>
  );
}
