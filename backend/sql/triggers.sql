CREATE TRIGGER check_playerStats
BEFORE INSERT ON PlayerGameStats
FOR EACH ROW
BEGIN
    -- Points can't be negative
    IF NEW.points < 0 THEN
        SIGNAL SQLSTATE '45000'                             -- user-defined exception
        SET MESSAGE_TEXT = 'Points cannot be negative';     -- message for the exception
    END IF;
    
    # Minutes must be between 0 and 73 [48 + 25]
    IF NEW.minutes < 0 OR NEW.minutes > 73 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Minutes must be between 0 and 73';
    END IF;
    
    # if fg_percent (field goal percentage) is null, default to 0
    IF NEW.fg_percent IS NULL THEN
        SET NEW.fg_percent = 0.0;
    END IF;
END
