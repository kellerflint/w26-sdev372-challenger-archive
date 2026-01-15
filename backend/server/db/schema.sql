CREATE TABLE poolPlayers(
    playerId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    win INT,
    loss INT
    
);

CREATE TABLE mmaFighters(
    fighterId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
);

CREATE TABLE mmaMatches (
    matchId INT AUTO_INCREMENT PRIMARY KEY,
    matchFighters VARCHAR(100) NOT NULL,
    headHits INT,
    bodyHits INT,
    dodges INT,
    blocks INT,
    notes VARCHAR(300), 
    fighterSecondaryId INT KEY
);

CREATE TABLE poolGames(
    gameId INT AUTO_INCREMENT PRIMARY KEY,
    matchPlayers VARCHAR(100) NOT NULL,
    shotAtt INT,
    shotPot INT,
    errors INT,
    effSafety INT,
    playerSecondaryId INT KEY
);

