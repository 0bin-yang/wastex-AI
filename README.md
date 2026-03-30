# WasteX-AI

**AI-Powered Waste Awareness Platform**

Report, analyze, and visualize waste and litter hotspots to create cleaner communities.
Capture photos of waste, let AI detect waste types and severity, then view everything on an interactive map.

---

## Key Features

- **Waste Reporting** — Upload or capture photos of litter, illegal dumping, or waste piles
- **Automatic GPS Capture** — Records exact location with every report
- **Client-Side Image Compression** — Images are compressed before upload for faster submission
- **AI-Powered Analysis** — Uses Hugging Face vision models to detect waste types and estimate severity
- **Recycling Guidance** — Actionable recycling instructions per detected waste type
- **Carbon Footprint Estimation** — Calculates CO2 savings if waste is diverted from landfill
- **Interactive Severity Map** — Color-coded markers showing waste hotspots (Mild to Critical)
- **Heatmap View** — Toggle between pin markers and a heatmap to visualize waste density
- **Neighborhood Leaderboard** — GPS radius-based clustering ranks neighborhoods by report activity
- **Filters and Dashboard** — Filter reports by severity, waste type, or date with skeleton loading states
- **Toast Notifications** — Real-time feedback on submission progress and errors
- **Mobile-Friendly** — Optimized for field reporting on phones

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
- **AI Vision**: Hugging Face Inference API via router.huggingface.co
- **Maps**: Leaflet.js + leaflet.heat with OpenStreetMap
- **Image Compression**: browser-image-compression
- **Image Storage**: Cloudinary
- **Database**: MongoDB Atlas + Mongoose
- **Geospatial Clustering**: geolib
- **Notifications**: Sonner
- **Icons**: Lucide React

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/0bin-yang/WasteX-AI.git
cd WasteX-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory and fill in your credentials:

```env
MONGODB_URI=your_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
wastex-ai/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts       # Hugging Face AI analysis
│   │   ├── leaderboard/route.ts   # GPS radius neighborhood clustering
│   │   ├── reports/route.ts       # GET/POST waste reports
│   │   └── upload/route.ts        # Cloudinary image upload
│   ├── dashboard/page.tsx         # Filtered reports dashboard
│   ├── leaderboard/page.tsx       # Neighborhood leaderboard
│   ├── map/page.tsx               # Interactive map with heatmap toggle
│   ├── report/page.tsx            # Report submission page
│   └── page.tsx                   # Landing page
├── components/
│   ├── Navbar.tsx
│   ├── ReportForm.tsx
│   ├── WasteMap.tsx
│   └── SeverityBadge.tsx
├── lib/
│   ├── cloudinary.ts
│   ├── huggingface.ts
│   └── mongodb.ts
├── models/
│   └── WasteReport.ts
└── types/
    └── index.ts
```

---

## Severity Scale

| Severity | Color  |
|----------|--------|
| Mild     | 🟢 Green  |
| Moderate | 🟡 Yellow |
| Severe   | 🟠 Orange |
| Critical | 🔴 Red    |

---

## Leaderboard

Neighborhoods are grouped by GPS radius (500m, 1km, 2km, or 5km). Each zone is ranked by the number of waste reports submitted. The leaderboard also displays total CO2 savings and the most common waste type per zone.

---

## Carbon Footprint Estimation

Each waste type has an estimated CO2 saving per kilogram diverted from landfill. Severity acts as a multiplier to estimate the volume of waste. The result is shown on the report form after AI analysis, on each dashboard card, and as a running total across all reports.

---

## License

MIT
