import React from "react";
import { Link, useLocation } from "react-router-dom";

const styles = {
  nav: {
    background: "#141a2e",
    borderBottom: "1px solid #2a3350",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    height: 60,
    position: "sticky",  // Stays at top when you scroll
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f97316",
    textDecoration: "none",
    marginRight: 40,
    letterSpacing: "-0.5px",
  },
  linksContainer: {
    display: "flex",
    gap: 8,
  },
  link: (isActive) => ({
    color: isActive ? "#f97316" : "#94a3b8",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    background: isActive ? "rgba(249,115,22,0.1)" : "transparent",
    transition: "all 0.2s",
  }),
};

function Navbar() {
  // useLocation() tells us what URL the user is currently on
  // so we can highlight the active link
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/players", label: "Players" },
    { to: "/teams", label: "Teams" },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🏀 NBA Analytics
      </Link>
      <div style={styles.linksContainer}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={styles.link(location.pathname === link.to)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
