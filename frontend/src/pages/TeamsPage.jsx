/*
  TeamsPage.jsx - Team Home vs Away Performance

  This page displays your Advanced Query 2 results.
  It works the same way as PlayersPage:
    Page loads → useEffect → fetch → setData → table renders
*/

import React, { useState, useEffect } from "react";
import StatsTable from "../components/StatsTable";

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
    lineHeight: 1.5,
  },
};

const columns = [
  { key: "teamName", label: "Team" },
  { key: "city", label: "City" },
  { key: "avgHomeScore", label: "Avg Home Score" },
  { key: "avgAwayScore", label: "Avg Away Score" },
  { key: "homeAwayDiff", label: "Home-Away Diff" },
];

function TeamsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch on page load (empty dependency array = run once)
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/teams/home-away");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
        setData([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Team Performance</h1>
        <p style={styles.subtitle}>
          Home vs Away win records with average victory margins (Advanced Query 2).
          <br />
          Uses a UNION of home wins and away wins with a self-join on TeamGameStats.
        </p>
      </div>

      <StatsTable columns={columns} data={data} loading={loading} />
    </div>
  );
}

export default TeamsPage;
