AegisStorm AI

A responsive single-page cyclone-risk and vulnerability dashboard prototype for the Bay of Bengal / Odisha coast. Built with Next.js, React, Tailwind CSS, Leaflet / React-Leaflet and Lucide React.

Run locally

Bash


npm install
npm run dev



Open the local Next.js preview at the URL/port printed by the development server. npm run lint runs ESLint; npx tsc --noEmit checks TypeScript types.

Prototype scope

•
Leaflet map centered at 19.8°N, 85.8°E, using OpenStreetMap tiles, interactive hazard circles, a Route 16 corridor and critical-infrastructure popups.

•
Scenario selector for Cyclone Fani, Cyclone Amphan and a Category 4 simulation.

•
The “Gemini Multimodal Vulnerability Assessment” control produces local, illustrative advisory content. It is a frontend simulation and does not call Gemini or any external AI service.

•
The SAR inundation-index panel is mock data and is not live Google Earth Engine output.

•
The cyclone parameters, modeled exposure, forecast window and alerts in this demo are illustrative. This is not an official warning or operational emergency-management product.

Image attribution

Cyclone Fani satellite image: NOAA National Environmental Satellite, Data, and Information Service (NESDIS), “Cyclone Fani Batters India's Coastal Odisha State”. The selected image is bundled at public/images/cyclone-fani.webp for the project preview.

