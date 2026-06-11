import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// Self-hosted fonts so the app works fully offline
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
