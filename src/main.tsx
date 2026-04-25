import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide splash once React has mounted and the first paint is complete.
const hideSplash = () => {
  const splash = document.getElementById("ruh-splash");
  if (!splash) return;
  splash.classList.add("ruh-splash-hide");
  window.setTimeout(() => splash.remove(), 450);
};

if (document.readyState === "complete") {
  requestAnimationFrame(() => requestAnimationFrame(hideSplash));
} else {
  window.addEventListener("load", () => {
    requestAnimationFrame(() => requestAnimationFrame(hideSplash));
  });
}
