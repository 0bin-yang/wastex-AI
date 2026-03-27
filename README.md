***

# WasteX-AI

**AI-Powered Waste Awareness Platform**

Report, analyze, and visualize waste and litter hotspots to create cleaner communities. Capture photos of waste, let AI detect waste types and severity, then view everything on an interactive map.

[
[

## Key Features

- **Waste Reporting** — Upload or capture photos of litter, illegal dumping, or waste piles
- **Automatic GPS Capture** — Records exact location with every report
- **Client-Side Image Compression** — Images compressed before upload for faster submission
- **AI-Powered Analysis** — Hugging Face vision models detect waste types and estimate severity
- **Recycling Guidance** — Actionable recycling instructions per detected waste type
- **Carbon Footprint Estimation** — Calculates CO2 savings if waste is diverted from landfill
- **Interactive Severity Map** — Color-coded markers showing waste hotspots (Mild to Critical)
- **Heatmap View** — Toggle between pin markers and heatmap to visualize waste density
- **Neighborhood Leaderboard** — GPS radius-based clustering ranks neighborhoods by report activity
- **Filters & Dashboard** — Filter by severity, waste type, or date with skeleton loading states
- **Toast Notifications** — Real-time feedback on submission progress and errors
- **Mobile-First** — Optimized for field reporting on phones

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| **AI/ML** | Hugging Face Inference API |
| **Maps** | Leaflet.js, leaflet.heat, OpenStreetMap |
| **Storage** | Cloudinary |
| **Database** | MongoDB Atlas + Mongoose |
| **Utils** | browser-image-compression, geolib, Sonner, Lucide React |

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
Create `.env.local` and add your credentials:

```env
MONGODB_URI=your_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   ├── map/page.tsx               # Interactive map + heatmap
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

## Severity Scale

| Severity | Color |
|----------|-------|
| Mild | Green |
| Moderate | Yellow |
| Severe | Orange |
| Critical | Red |

## Leaderboard Logic

Neighborhoods grouped by GPS radius: 500m, 1km, 2km, 5km.  
Ranked by total waste reports, CO2 savings, and most common waste type per zone.

## Carbon Footprint Calculation

```
CO2 Savings = Waste Volume (kg) × Severity Multiplier × CO2 Factor (kgCO2/kg)
```
Severity multipliers: Mild(0.5), Moderate(1.0), Severe(2.0), Critical(5.0)

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

made with love by murire
## License
This project is [MIT](LICENSE) licensed.

***
