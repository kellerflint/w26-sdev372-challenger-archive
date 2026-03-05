CREATE DATABASE IF NOT EXISTS challengerarchive;
USE challengerarchive;

CREATE TABLE IF NOT EXISTS poolPlayers(
    playerId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
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
    fighterOneHeadHits INT,
    fighterTwoHeadHits INT,
    fighterOneBodyHits INT,
    fighterTwoBodyHits INT,
    fighterOneDodges INT,
    fighterTwoDodges INT,
    fighterOneBlocks INT,
    fighterTwoBlocks INT,
    fighterOneNotes VARCHAR(300),
    fighterTwoNotes VARCHAR(300),
    matchDate DATETIME,
    location VARCHAR(255),

    fighterOneId INT,
    fighterTwoId INT,

    FOREIGN KEY (fighterOneId) REFERENCES mmaFighters(fighterId),
    FOREIGN KEY (fighterTwoId) REFERENCES mmaFighters(fighterId)
);

CREATE TABLE IF NOT EXISTS poolGames(
    gameId INT AUTO_INCREMENT PRIMARY KEY,
    playerOneId INT NOT NULL,
    playerTwoId INT NOT NULL,
    playerOneScore INT,
    playerTwoScore INT,
    playerOneShotAtt INT,
    playerTwoShotAtt INT,
    playerOneShotPot INT,
    playerTwoShotPot INT,
    playerOneErrors INT,
    playerTwoErrors INT,
    playerOneSafeties INT,
    playerTwoSafeties INT,
    matchDate DATETIME,
    location VARCHAR(255),

    FOREIGN KEY (playerOneId) REFERENCES poolPlayers(playerId),
    FOREIGN KEY (playerTwoId) REFERENCES poolPlayers(playerId)
);
