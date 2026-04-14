/*
  StatsTable.jsx - Reusable Data Table Component

  This is the most important "LEGO brick" — it takes ANY array of data
  and displays it as a styled table. You tell it which columns to show
  and it handles the rest.

  Usage:
    <StatsTable
      columns={[
        { key: "firstName", label: "First Name" },
        { key: "avgPoints", label: "PPG" },
      ]}
      data={[
        { firstName: "LeBron", avgPoints: 27.1 },
        { firstName: "Steph", avgPoints: 24.6 },
      ]}
    />
  
  "columns" defines WHAT to show and in what order.
  "data" is the actual rows (usually from your Flask API).
*/

import React from "react";

/* ── Styles ── */
const styles = {
  wrapper: {
    overflowX: "auto",               // Allows horizontal scroll on small screens
    borderRadius: 12,
    border: "1px solid #2a3350",
    background: "#141a2e",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",       // Removes gaps between cells
    fontSize: 14,
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    background: "#1e2740",
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #2a3350",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 16px",
    borderBottom: "1px solid #1e2740",
    color: "#e2e8f0",
    whiteSpace: "nowrap",
  },
  rowEven: {
    background: "rgba(30, 39, 64, 0.3)",
  },
  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },
  loading: {
    textAlign: "center",
    padding: 40,
    color: "#f97316",
  },
};

function StatsTable({ columns, data, loading }) {
  // Show loading state
  if (loading) {
    return (
      <div style={styles.wrapper}>
        <p style={styles.loading}>Loading data...</p>
      </div>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div style={styles.wrapper}>
        <p style={styles.empty}>No results found.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} style={index % 2 === 0 ? {} : styles.rowEven}>
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>
                  {row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatsTable;
