import { createRoot } from "react-dom/client";
import App from "./App";
// Make sure the CSS is imported and loaded
import "./index.css";

// Get the current marathon from config if available
try {
  const marathonName = localStorage.getItem('selectedMarathon') || 'Rotterdam';
  document.title = `${marathonName} Marathon - Runner Tracker`;
} catch (e) {
  // Fallback if localStorage not available
  document.title = "Marathon Runner Tracker";
}

createRoot(document.getElementById("root")!).render(<App />);
