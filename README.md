# WasteX-AI

**AI-Powered Waste Awareness Platform**

Report, analyze, and visualize waste and litter hotspots to drive cleaner communities. Users can capture photos of waste, leverage AI to detect waste types and severity, and view aggregated data on an interactive map.

## Key Features

- Waste reporting with photo upload or camera capture
- Automatic GPS location capture for every report
- Client-side image compression for optimal upload performance
- AI-powered waste detection and severity analysis using Hugging Face vision models
- Recycling guidance based on detected waste types
- Carbon footprint estimation for diverted waste
- Interactive severity map with color-coded markers (Mild to Critical)
- Heatmap view to visualize waste density
- Neighborhood leaderboard based on GPS-radius clustering
- Advanced filters and dashboard with skeleton loading states
- Real-time toast notifications for user feedback
- Mobile-first responsive design optimized for field use

## Tech Stack

| Category     | Technologies                                      |
|--------------|---------------------------------------------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| **AI/ML**    | Hugging Face Inference API                        |
| **Maps**     | Leaflet.js, leaflet.heat, OpenStreetMap           |
| **Storage**  | Cloudinary                                        |
| **Database** | MongoDB Atlas + Mongoose                          |
| **Utilities**| browser-image-compression, geolib, Sonner, Lucide React |

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/0bin-yang/Wastex-AI.git
cd Wastex-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Architecture

```
wastex-ai/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # AI analysis endpoint
│   │   ├── leaderboard/route.ts      # Neighborhood leaderboard logic
│   │   ├── reports/route.ts          # CRUD operations for waste reports
│   │   └── upload/route.ts           # Cloudinary image upload handler
│   ├── dashboard/page.tsx            # Reports dashboard with filters
│   ├── leaderboard/page.tsx          # Neighborhood rankings
│   ├── map/page.tsx                  # Interactive map + heatmap
│   ├── report/page.tsx               # Waste reporting form
│   └── page.tsx                      # Landing / Home page
├── components/
│   ├── Navbar.tsx
│   ├── ReportForm.tsx
│   ├── WasteMap.tsx
│   ├── SeverityBadge.tsx
│   └── ui/                           # Reusable UI components
├── lib/
│   ├── cloudinary.ts
│   ├── huggingface.ts
│   └── mongodb.ts
├── models/
│   └── WasteReport.ts                # Mongoose schema
└── types/
    └── index.ts                      # TypeScript type definitions
```

## Severity Scale

| Severity   | Color  |
|------------|--------|
| Mild       | Green  |
| Moderate   | Yellow |
| Severe     | Orange |
| Critical   | Red    |

## Carbon Footprint Estimation

```text
CO2 Savings = Waste Volume (kg) × Severity Multiplier × CO2 Factor (kgCO2/kg)
```

**Severity Multipliers:**
- Mild: 0.5
- Moderate: 1.0
- Severe: 2.0
- Critical: 5.0

## Leaderboard Logic

Neighborhoods are clustered using GPS radius (500m, 1km, 2km, 5km). Rankings are calculated based on:
- Total number of reports
- Estimated CO₂ savings
- Most frequent waste types per zone

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

---
```
