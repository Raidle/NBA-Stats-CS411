from flask import Flask, jsonify
from flask_cors import CORS
from db import run_query

app = Flask(__name__)
# CORS = "Cross-Origin Resource Sharing"
# React runs on port 3000, Flask on port 5000 - they're different "origins"
# Without CORS, the browser blocks React from talking to Flask (security feature)
# This line says "it's okay, let port 3000 talk to me"
CORS(app)

@app.route('/')
def index():
    return "Hello World!"

# ROUTE 1: Get all players (basic)
@app.route("/api/players")
def get_players():
    sql = """
        SELECT playerId, firstName, lastName, heightInches, bodyWeightLbs
        FROM Player
        ORDER BY lastName, firstName
        LIMIT 50
    """
    rows = run_query(sql)
    return jsonify(rows)



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
    return jsonify(rows)


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
        ORDER BY avgPoints DESC;
    """
    rows = run_query(sql)
    return jsonify(rows)


# ADVANCED QUERY 3: 
@app.route("/api/players/team-avg-score-away")
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
    return jsonify(rows)



if __name__ == '__main__':
    app.run(debug=True)


