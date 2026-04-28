CREATE PROCEDURE GetPlayerPerformance(IN p_playerId INT)
BEGIN
    DECLARE playerExists INT;
    
    # Check if player exists before running queries
    SELECT COUNT(*) INTO playerExists
    FROM  Player
    WHERE playerId = p_playerId;
    
    IF playerExists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ERROR! Player not found';
    ELSE
        # Player career stats per team
        SELECT p.firstName, p.lastName, t.name AS teamName,
               COUNT(*) AS gamesPlayed,
               ROUND(AVG(pgs.points), 2)   AS avgPoints,
               ROUND(AVG(pgs.rebounds), 2) AS avgRebounds,
               ROUND(AVG(pgs.assists), 2)  AS avgAssists,
               MAX(pgs.points)             AS careerMaxPointsPerGame
        FROM PlayerGameStats pgs
        JOIN Player p ON pgs.playerId = p.playerId
        JOIN Team t   ON pgs.teamId   = t.teamId
        WHERE p.playerId = p_playerId
        GROUP BY p.firstName, p.lastName, t.name;


        # Player vs teammates comparison
        SELECT t.name                           AS teamName,
               (SELECT ROUND(AVG(points), 2) 
                FROM PlayerGameStats 
                WHERE teamId = t.teamId)        AS teamAvgPoints,
               ROUND(AVG(pgs_player.points), 2) AS playerAvgPoints
        FROM PlayerGameStats pgs_player
        JOIN PlayerGameStats pgs2 ON pgs_player.teamId = pgs2.teamId
        JOIN Team t               ON pgs_player.teamId = t.teamId
        WHERE pgs_player.playerId = p_playerId
        GROUP BY t.name;
    END IF;
END