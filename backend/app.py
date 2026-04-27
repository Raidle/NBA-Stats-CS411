from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from db import run_query, get_connection

app = Flask(__name__)
# CORS = "Cross-Origin Resource Sharing"
# Allow common local frontend origins used by React (3000) and Vite (5173),
# including localhost and 127.0.0.1 which the browser treats as different origins.
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS(
    app,
    resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.route('/')
def index():
    return "<h1>Backend is UP!</h1>"

# ROUTE 1: Get all players (basic)
@app.route("/api/players")
def get_players():
    sql = """
        SELECT playerId, firstName, lastName, heightInches, bodyWeightLbs
        FROM Player
        ORDER BY lastName, firstName
    """
    rows = run_query(sql)
    payload = [{
        "playerId": row["playerId"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "heightInches": row["heightInches"],
        "bodyWeightLbs": row["bodyWeightLbs"]
    } for row in rows]
    return jsonify(payload)

# ADVANCED QUERY 1: 
@app.route("/api/players/leader-board")
def leader_board():
    sql = """
        SELECT
            p.playerId,
            p.firstName,
            p.lastName,
            COUNT(*) AS games_played,
            ROUND(AVG(pgs.points), 2) AS avg_points
        FROM PlayerGameStats pgs
        JOIN Player p
            ON p.playerId = pgs.playerId
        GROUP BY p.playerId, p.firstName, p.lastName
        HAVING COUNT(*) >= 50
        ORDER BY avg_points DESC;  
    """
    rows = run_query(sql)
    payload = [{
        "playerId": row["playerId"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "gamesPlayed": row["games_played"],
        "avgPoints": row["avg_points"]
    } for row in rows]
    return jsonify(payload)


# ADVANCED QUERY 2: Players averaging above the league-wide average in points, with their team info
@app.route("/api/players/top-scorers")
def top_scorers():
    sql = """
        SELECT
            p.playerId,
            p.firstName,
            p.lastName,
            t.name AS teamName,
            COUNT(pgs.gameId) AS gamesPlayed,
            ROUND(AVG(pgs.points), 2)   AS avgPoints,
            ROUND(AVG(pgs.rebounds), 2) AS avgRebounds,
            ROUND(AVG(pgs.assists), 2)  AS avgAssists
        FROM PlayerGameStats pgs
        JOIN Player p 
            ON pgs.playerId = p.playerId
        JOIN Team t   
            ON pgs.teamId = t.teamId
        GROUP BY p.playerId, p.firstName, p.lastName, t.name
        HAVING AVG(pgs.points) > (
        SELECT AVG(points) FROM PlayerGameStats
        )
        ORDER BY avgPoints DESC
        LIMIT 50;
    """
    rows = run_query(sql)
    payload = [{
        "playerId": row["playerId"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "teamName": row["teamName"],
        "gamesPlayed": row["gamesPlayed"],
        "avgPoints": row["avgPoints"],
        "avgRebounds": row["avgRebounds"],
        "avgAssists": row["avgAssists"]
    } for row in rows]
    return jsonify(payload)


# ADVANCED QUERY 3: 
@app.route("/api/teams/home-away")
def team_avg_score():
    sql = """
    SELECT 
        t.teamId,
        t.name AS teamName,
        t.city,
        ROUND(AVG(CASE WHEN tgs.isHome = 1 THEN tgs.teamScore END), 2) AS avgHomeScore,
        ROUND(AVG(CASE WHEN tgs.isHome = 0 THEN tgs.teamScore END), 2) AS avgAwayScore,
        ROUND(
            AVG(CASE WHEN tgs.isHome = 1 THEN tgs.teamScore END) -
            AVG(CASE WHEN tgs.isHome = 0 THEN tgs.teamScore END),
        2) AS homeAwayDiff
    FROM TeamGameStats tgs
    JOIN Team t
        ON tgs.teamId = t.teamId
    GROUP BY t.teamId, t.name, t.city
    HAVING AVG(CASE WHEN tgs.isHome = 1 THEN tgs.teamScore END) >
        AVG(CASE WHEN tgs.isHome = 0 THEN tgs.teamScore END)
    ORDER BY homeAwayDiff DESC; 
    """
    rows = run_query(sql)
    payload = [{
        "teamId": row["teamId"],
        "teamName": row["teamName"],
        "city": row["city"],
        "avgHomeScore": row["avgHomeScore"],
        "avgAwayScore": row["avgAwayScore"],
        "homeAwayDiff": row["homeAwayDiff"]
    } for row in rows]
    return jsonify(payload)


# Keyword Search: Search Player by PlayerName[firstName, lastName]
@app.route("/api/players/search")
def search_players():
    name = request.args.get("name", "")
    sql = """
        SELECT playerId, firstName, lastName, heightInches, bodyWeightLbs
        FROM Player
        WHERE firstName LIKE %s OR lastName LIKE %s
        ORDER BY lastName, firstName
        LIMIT 50
    """
    wildcard = f"%{name}%"
    rows = run_query(sql, (wildcard, wildcard))
    payload = [{
        "playerId": row["playerId"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "heightInches": row["heightInches"],
        "bodyWeightLbs": row["bodyWeightLbs"]
    } for row in rows]
    return jsonify(payload)


# STORED PROCEDURE: Geting a report for a player
@app.route("/api/players/report")
def player_report():
    name = request.args.get("name", "")
    conn = get_connection()
    
    try:
        with conn.cursor() as cursor:
            # Find the player by name
            cursor.execute("""
                SELECT playerId FROM Player
                WHERE firstName LIKE %s OR lastName LIKE %s
                LIMIT 1
            """, (f"%{name}%", f"%{name}%"))
            player = cursor.fetchone()
            
            if not player:
                return jsonify({"error": "Player not found"}), 404
            
            # Calling the Stored Procedure from GCP MySQL
            cursor.callproc("GetPlayerPerformance", (player["playerId"],))
            career_stats = cursor.fetchall()
            cursor.nextset()
            team_comparison = cursor.fetchall()
        return jsonify({
            "careerStats": career_stats,
            "teamComparison": team_comparison
        })
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=8000)
    