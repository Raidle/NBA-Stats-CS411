USE nba_analytics;

-- Clean bad existing data first
UPDATE PlayerGameStats
SET minutes = NULL
WHERE minutes < 0;

UPDATE PlayerGameStats
SET ft_percent = NULL
WHERE ft_percent IS NOT NULL
  AND (ft_percent < 0 OR ft_percent > 1);

UPDATE PlayerGameStats
SET fg_percent = NULL
WHERE fg_percent IS NOT NULL
  AND (fg_percent < 0 OR fg_percent > 1);

UPDATE TeamGameStats
SET ft_percent = NULL
WHERE ft_percent IS NOT NULL
  AND (ft_percent < 0 OR ft_percent > 1);

UPDATE TeamGameStats
SET fg_percent = NULL
WHERE fg_percent IS NOT NULL
  AND (fg_percent < 0 OR fg_percent > 1);

-- PlayerGameStats
ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_points
CHECK (points >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_turnovers
CHECK (turnovers >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_minutes
CHECK (minutes IS NULL OR minutes >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_blocks
CHECK (blocks >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_steals
CHECK (steals >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_assists
CHECK (assists >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_rebounds
CHECK (rebounds >= 0);

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_ft_percent
CHECK (ft_percent IS NULL OR (ft_percent >= 0 AND ft_percent <= 1));

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_three_percent
CHECK (three_percent IS NULL OR (three_percent >= 0 AND three_percent <= 1));

ALTER TABLE PlayerGameStats
ADD CONSTRAINT pgs_fg_percent
CHECK (fg_percent IS NULL OR (fg_percent >= 0 AND fg_percent <= 1));

-- TeamGameStats
ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_isHome
CHECK (isHome IN (0, 1));

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_teamScore
CHECK (teamScore >= 0);

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_assists
CHECK (assists >= 0);

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_blocks
CHECK (blocks >= 0);

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_steals
CHECK (steals >= 0);

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_rebounds
CHECK (rebounds >= 0);

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_turnovers
CHECK (turnovers >= 0);

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_ft_percent
CHECK (ft_percent IS NULL OR (ft_percent >= 0 AND ft_percent <= 1));

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_three_percent
CHECK (three_percent IS NULL OR (three_percent >= 0 AND three_percent <= 1));

ALTER TABLE TeamGameStats
ADD CONSTRAINT tgs_fg_percent
CHECK (fg_percent IS NULL OR (fg_percent >= 0 AND fg_percent <= 1));

-- Makes sure there is only 1 row of home_team and away_team per game
ALTER TABLE TeamGameStats
ADD CONSTRAINT uqi_home_away_games
UNIQUE (gameId, isHome);