import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlayersPage from "./pages/PlayersPage";
import TeamsPage from "./pages/TeamsPage";

/* ── Global Styles ── */
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Outfit', sans-serif;
    background: #0a0e1a;
    color: #e2e8f0;
    min-height: 100vh;
  }

  /* Accent color used throughout the app */
  :root {
    --accent: #f97316;       /* NBA orange */
    --accent-dim: #c2410c;
    --surface: #141a2e;
    --surface-light: #1e2740;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border: #2a3350;
  }
`;
document.head.appendChild(globalStyle);

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is OUTSIDE <Routes> so it appears on every page */}
      <Navbar />

      {/* Only the matching page renders here */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

