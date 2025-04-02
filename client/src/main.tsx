import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "Rotterdam '25 - Marathon Runner Tracker";
createRoot(document.getElementById("root")!).render(<App />);
