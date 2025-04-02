# Rotterdam Marathon Supporter App

A web application that helps marathon spectators track runners during the Rotterdam '25 marathon. The application transforms race data into an interactive interface that predicts where runners will be at specific times based on their starting wave and expected pace.

## Features

- **Runner Tracking**: Enter a runner's name, starting wave, and expected pace to predict their location throughout the race
- **Interactive Timeline**: Visual timeline showing when the runner will pass specific viewing locations
- **Location Details**: Information about each viewing location including distance, expected time, and estimated finish time
- **Google Maps Integration**: Get directions to viewing locations with a single click
- **Route Map**: Visual representation of the marathon route with key landmarks
- **Responsive Design**: Works on mobile devices for on-the-go tracking

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build for production
npm run build

# Start the production server
npm run start
```

### Deploying to GitHub Pages

This application can be deployed as a static site to GitHub Pages for easy sharing. Since the backend won't be available in this deployment, the application will use static data calculations instead.

To deploy:

1. Fork or clone this repository to your GitHub account
2. Go to your repository's Settings > Pages
3. Set the source to 'GitHub Actions'
4. The workflow will automatically deploy your app whenever you push to the main branch

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Node.js, Express
- Data Handling: Zod for validation, TanStack Query for data fetching
- Mapping: Static marathon route map with visual indicators
- Deployment: GitHub Pages for static deployment

## License

This project is licensed under the MIT License.