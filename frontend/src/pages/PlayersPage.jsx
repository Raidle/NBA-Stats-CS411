/*
  PlayersPage.jsx - Player Search + Top Scorers

  THIS IS THE MOST IMPORTANT FILE TO UNDERSTAND.
  It demonstrates the two core React concepts you need:

  1. useState  → "remember something" (like a variable that triggers re-render)
  2. useEffect → "do something when the page loads" (like fetching data)

  The flow:
  - Page loads → useEffect fires → fetch("/api/players/top-scorers") 
    → Flask runs your Query 1 → returns JSON → setPlayers(data) 
    → React re-renders the table with data
*/

import React, { useState, useEffect } from "react";
import StatsTable from "../components/StatsTable";

/* ── Styles ── */
const styles = {
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  searchRow: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
    alignItems: "center",
  },
  input: {
    background: "#141a2e",
    border: "1px solid #2a3350",
    borderRadius: 8,
    padding: "10px 16px",
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    width: 280,
    fontFamily: "Outfit, sans-serif",
  },
  button: (active) => ({
    background: active ? "#f97316" : "#1e2740",
    color: active ? "#fff" : "#94a3b8",
    border: active ? "1px solid #f97316" : "1px solid #2a3350",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Outfit, sans-serif",
    transition: "all 0.2s",
  }),
};

// Define which columns to display in each view
const topScorerColumns = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "teamName", label: "Team" },
  { key: "gamesPlayed", label: "GP" },
  { key: "avgPoints", label: "PPG" },
  { key: "avgRebounds", label: "RPG" },
  { key: "avgAssists", label: "APG" },
];

const searchColumns = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "heightInches", label: "Height (in)" },
  { key: "bodyWeightLbs", label: "Weight (lbs)" },
];

function PlayersPage() {
  /*
    useState explained:
    
    const [players, setPlayers] = useState([]);
    
    - "players" is the current value (starts as empty array [])
    - "setPlayers" is the function to UPDATE that value
    - When you call setPlayers(newData), React re-renders the component
    
    Think of it like a whiteboard:
    - "players" = what's written on the board right now
    - "setPlayers" = erasing and writing something new
    - React = the person watching the board who updates the screen when it changes
  */
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("topScorers"); // "topScorers" or "search"

  /*
    useEffect explained:

    useEffect(() => { ... }, [view]);

    - The function inside runs AFTER the component renders
    - The [view] at the end means "re-run this whenever 'view' changes"
    - If you used [] (empty array), it would run only ONCE on page load

    Think of it like a recipe instruction:
    "After setting up the kitchen, go fetch the ingredients."
    The [view] part says: "Also re-fetch if the customer changes their order."
  */
  useEffect(() => {
    if (view === "topScorers") {
      fetchTopScorers();
    }
  }, [view]);

  // Fetch top scorers from Flask (your Query 1)
  async function fetchTopScorers() {
    setLoading(true);
    try {
      /*
        fetch() sends an HTTP request to your Flask backend.
        
        Why "/api/players/top-scorers" without "http://localhost:5000"?
        Because of the "proxy" setting in package.json — React automatically
        forwards requests to Flask during development.
      */
      const response = await fetch("/api/players/top-scorers");
      const data = await response.json();
      setPlayers(data);  // This triggers React to re-render with the new data
    } catch (error) {
      console.error("Failed to fetch top scorers:", error);
      setPlayers([]);
    }
    setLoading(false);
  }

  // Search players by name
  async function handleSearch() {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setView("search");
    try {
      const response = await fetch(
        `/api/players/search?name=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to search players:", error);
      setPlayers([]);
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Players</h1>
        <p style={styles.subtitle}>
          {view === "topScorers"
            ? "Players averaging above the league-wide scoring average (Advanced Query 1)"
            : `Search results for "${searchTerm}"`}
        </p>
      </div>

      {/* Search bar + view toggle buttons */}
      <div style={styles.searchRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search by player name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Allow pressing Enter to search
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button style={styles.button(false)} onClick={handleSearch}>
          Search
        </button>
        <button
          style={styles.button(view === "topScorers")}
          onClick={() => setView("topScorers")}
        >
          Top Scorers
        </button>
      </div>

      {/* The StatsTable component does all the heavy lifting */}
      <StatsTable
        columns={view === "topScorers" ? topScorerColumns : searchColumns}
        data={players}
        loading={loading}
      />
    </div>
  );
}

export default PlayersPage;
