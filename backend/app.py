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

@app.post("/api/login")
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Placeholder for authentication logic
    if username == "admin" and password == "password":
        return "Login successful!", 200
    else:
        return "Invalid credentials", 401

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

@app.post("/api/players")
def add_player():
    data = request.get_json(silent=True) or {}
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    height_inches = data.get("heightInches")
    weight_lbs = data.get("bodyWeightLbs")

    if not first_name or not last_name:
        return jsonify({"error": "firstName and lastName are required"}), 400

    next_id_sql = "SELECT COALESCE(MAX(playerId), 0) + 1 AS nextPlayerId FROM Player"
    next_id_row = run_query(next_id_sql)
    next_player_id = next_id_row[0]["nextPlayerId"]

    sql = """
        INSERT INTO Player (playerId, firstName, lastName, heightInches, bodyWeightLbs)
        VALUES (%s, %s, %s, %s, %s)
    """
    run_query(sql, (next_player_id, first_name, last_name, height_inches, weight_lbs))
    return jsonify({"message": "Player added successfully", "playerId": next_player_id}), 201

# Get player by ID (basic)
@app.route("/api/players/<int:player_id>")
def get_player(player_id):
    sql = """
        SELECT playerId, firstName, lastName, heightInches, bodyWeightLbs
        FROM Player
        WHERE playerId = %s
    """
    rows = run_query(sql, (player_id,))
    if not rows:
        return jsonify({"error": "Player not found"}), 404
    row = rows[0]
    payload = {
        "playerId": row["playerId"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "heightInches": row["heightInches"],
        "bodyWeightLbs": row["bodyWeightLbs"]
    }
    return jsonify(payload)

@app.delete("/api/players/<int:player_id>")
def delete_player(player_id):
    sql = """
        DELETE FROM Player
        WHERE playerId = %s
    """
    run_query(sql, (player_id,))
    return jsonify({"message": "Player deleted successfully"})

@app.put("/api/players/<int:player_id>")
def update_player(player_id):
    data = request.get_json(silent=True) or {}
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    height_inches = data.get("heightInches")
    weight_lbs = data.get("bodyWeightLbs")

    if not first_name or not last_name:
        return jsonify({"error": "firstName and lastName are required"}), 400

    sql = """
        UPDATE Player
        SET firstName = %s, lastName = %s, heightInches = %s, bodyWeightLbs = %s
        WHERE playerId = %s
    """
    run_query(sql, (first_name, last_name, height_inches, weight_lbs, player_id))
    return jsonify({"message": "Player updated successfully"})

# ADVANCED QUERY 1: Leaderboard
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
       
       
# TRANSACTION: Transferring a player      
@app.route("/api/players/transfer", methods=["POST"])
def transfer_player():
    data = request.get_json()
    player_name = data["playerName"]
    new_team_name = data["newTeamName"]

    conn = get_connection()
    try:                            
        with conn.cursor() as cursor:
            cursor.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")  # only one person can edit the document at a time, the strictest isolation level
        conn.begin()
        with conn.cursor() as cursor:                                       # BEGIN TRANSACTION; -> start the transaction
            # Find player by name
            cursor.execute("""
                SELECT playerId, firstName, lastName FROM Player
                WHERE firstName LIKE %s OR lastName LIKE %s
                LIMIT 1
            """, (f"%{player_name}%", f"%{player_name}%"))
            player = cursor.fetchone()
            if not player:
                conn.rollback()
                return jsonify({"error": "Player not found"}), 404

            # Find team by name
            cursor.execute("""
                SELECT teamId, name FROM Team
                WHERE name LIKE %s
                LIMIT 1
            """, (f"%{new_team_name}%",))
            team = cursor.fetchone()
            if not team:
                conn.rollback()
                return jsonify({"error": "Team not found"}), 404

            player_id = player["playerId"]
            new_team_id = team["teamId"]
            
            # Get player's current team
            cursor.execute("""
                SELECT 
                    t.teamId, 
                    t.name AS teamName, 
                    COUNT(*) AS gamesPlayed
                FROM PlayerGameStats pgs
                JOIN Team t ON pgs.teamId = t.teamId
                WHERE pgs.playerId = %s
                GROUP BY t.teamId, t.name
                ORDER BY gamesPlayed DESC
                LIMIT 1
            """, (player_id,))
            current = cursor.fetchone()             # returns a single row

            if not current:
                conn.rollback()
                return jsonify({"error": "Player has no game stats"}), 404
            
            # Get the 5 games that will be moved (before updating)
            # date is a reserved word in MySQL. Wrap it in backticks:
            cursor.execute("""
                SELECT 
                    pgs.gameId, 
                    g.gameDate, 
                    pgs.points, 
                    pgs.rebounds, 
                    pgs.assists
                FROM PlayerGameStats pgs
                JOIN Game g ON pgs.gameId = g.gameId
                WHERE pgs.playerId = %s
                ORDER BY g.gameDate DESC
                LIMIT 5
            """, (player_id,))
            moved_games = cursor.fetchall()

            # Update their 5 most recent games
            cursor.execute("""                              # UPDATE; -> updating the game information
                UPDATE PlayerGameStats
                SET teamId = %s
                WHERE playerId = %s
                AND gameId IN (
                    SELECT gameId FROM (
                        SELECT gameId 
                        FROM PlayerGameStats
                        WHERE playerId = %s
                        ORDER BY gameId DESC
                        LIMIT 5
                    ) AS recent
                )
            """, (new_team_id, player_id, player_id))

        conn.commit()                               # COMMIT; -> save the transaction
        return jsonify({
            "message": "Player transferred successfully",
            "playerName": f"{player['firstName']} {player['lastName']}",
            "fromTeam": current["teamName"],
            "toTeam": team["name"],
            "movedGames": moved_games
        })
    except Exception as e:
        conn.rollback()                             # ROLLBACK; -> undo the transaction
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=8000)