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

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players/top-scorers")
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Top Scorers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>PPG</th>
            <th>RPG</th>
            <th>APG</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.playerId}>
              <td>{p.firstName} {p.lastName}</td>
              <td>{p.teamName}</td>
              <td>{p.avgPoints}</td>
              <td>{p.avgRebounds}</td>
              <td>{p.avgAssists}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
