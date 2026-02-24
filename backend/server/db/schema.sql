CREATE DATABASE IF NOT EXISTS challengerArchive;
USE challengerArchive;

CREATE TABLE IF NOT EXISTS poolPlayers(
    playerId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    win INT,
    loss INT
);

CREATE TABLE IF NOT EXISTS mmaFighters(
    fighterId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS mmaMatches (
    matchId INT AUTO_INCREMENT PRIMARY KEY,
    matchFighters VARCHAR(100) NOT NULL,
    headHits INT,
    bodyHits INT,
    dodges INT,
    blocks INT,
    notes VARCHAR(300), 
    opponentId INT,
    FOREIGN KEY (opponentId) REFERENCES mmaFighters(fighterId)
);

CREATE TABLE IF NOT EXISTS poolGames(
    gameId INT AUTO_INCREMENT PRIMARY KEY,
    playerId INT NOT NULL,
    shotAtt INT,
    shotPot INT,
    errors INT,
    effSafety INT,
    opponentId INT,
    FOREIGN KEY (playerId) REFERENCES poolPlayers(playerId)
);
