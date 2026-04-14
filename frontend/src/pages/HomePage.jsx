/*
  HomePage.jsx - Landing Page

  This is a simple welcome page with links to the main features.
  No data fetching needed here — it's just static content.
*/

import React from "react";
import { Link } from "react-router-dom";

const styles = {
  hero: {
    textAlign: "center",
    padding: "80px 20px",
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: 16,
    letterSpacing: "-1px",
  },
  accent: {
    color: "#f97316",
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
    marginBottom: 48,
    maxWidth: 500,
    margin: "0 auto 48px",
    lineHeight: 1.6,
  },
  cardsRow: {
    display: "flex",
    gap: 24,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    background: "#141a2e",
    border: "1px solid #2a3350",
    borderRadius: 16,
    padding: "32px 28px",
    width: 280,
    textDecoration: "none",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.5,
  },
};

function HomePage() {
  const cards = [
    {
      to: "/players",
      title: "🏀 Top Scorers",
      desc: "Find players scoring above the league average, with per-game stats across their career.",
    },
    {
      to: "/teams",
      title: "🏟️ Home vs Away",
      desc: "Compare team performance at home versus on the road, with win counts and margins.",
    },
  ];

  return (
    <div style={styles.hero}>
      <h1 style={styles.title}>
        NBA <span style={styles.accent}>Analytics</span>
      </h1>
      <p style={styles.subtitle}>
        Explore player stats, team performance, and game data
        from your NBA database.
      </p>
      <div style={styles.cardsRow}>
        {cards.map((card) => (
          <Link key={card.to} to={card.to} style={styles.card}>
            <div style={styles.cardTitle}>{card.title}</div>
            <div style={styles.cardDesc}>{card.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
