# Marathon Tracker App

A cutting-edge marathon tracking web application that transforms spectator engagement through innovative real-time visualization and interactive technologies, enabling comprehensive runner tracking and performance analysis.

## Features

- Predict runner locations based on starting wave and expected finish time
- Visual timeline of runner's journey through the marathon
- Multi-language support (Dutch and English)
- Shareable links for runner tracking
- Support for multiple marathons (Rotterdam, Amsterdam)
- Pace comparison to see if runners are faster or slower than expected

## Deployment Options

This application can be built as a static site since all calculations are performed client-side.

### Option 1: Static Build

To create a static build that can be deployed to any static hosting service:

```bash
chmod +x ./build-static.sh
./build-static.sh
```

This will generate the static files in the `static-build` directory.

### Option 2: GitHub Pages

To deploy to GitHub Pages:

1. Push this code to a GitHub repository
2. Enable GitHub Pages in the repository settings
3. Set up CI/CD with the included GitHub Actions workflow by setting the Pages source to "GitHub Actions"

The GitHub Actions workflow will automatically build and deploy the application to GitHub Pages.

## Development

To run the application locally:

```bash
npm run dev
```

This will start the development server.