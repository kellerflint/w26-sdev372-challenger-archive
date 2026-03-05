INSERT INTO poolPlayers (firstName, win, loss) VALUES
('Kratos', 0, 0),
('Nathan Drake', 0, 0),
('Cole MacGrath', 0, 0),
('Aloy', 0, 0),
('Jade', 0, 0),
('Captain Price', 0, 0);

INSERT INTO poolGames (
    playerOneId,
    playerTwoId,
    playerOneScore,
    playerTwoScore,
    playerOneShotAtt,
    playerTwoShotAtt,
    playerOneShotPot,
    playerTwoShotPot,
    playerOneErrors,
    playerTwoErrors,
    playerOneSafeties,
    playerTwoSafeties,
    matchDate,
    location
) VALUES
(2, 4, 10, 12, 19, 22, 16, 18, 4, 3, 2, 4, '2026-03-09 13:10:00', 'Horizon Harmonics Billiards'),
(3, 5, 9, 11, 21, 23, 18, 19, 3, 2, 4, 3, '2026-03-10 15:45:00', 'Raincrown Billiard Den'),
(4, 6, 13, 5, 26, 15, 24, 11, 1, 6, 5, 2, '2026-03-11 19:05:00', 'Forbidden West Rackhouse'),
(5, 1, 8, 10, 18, 21, 15, 17, 5, 3, 2, 3, '2026-03-12 17:20:00', 'Jak and Daxter Drift Lounge'),
(6, 2, 7, 11, 17, 20, 13, 16, 4, 2, 3, 4, '2026-03-13 21:50:00', 'Call of Cue: Verdansk Studio'),
(1, 4, 14, 9, 30, 19, 25, 16, 1, 3, 6, 3, '2026-03-14 18:15:00', 'Olympus Rackscape'),
(5, 3, 10, 11, 22, 24, 17, 18, 3, 2, 2, 3, '2026-03-15 20:40:00', 'Mafia Cue Cantina'),
(4, 1, 12, 10, 25, 23, 21, 20, 2, 3, 4, 2, '2026-03-16 18:00:00', 'God of Chalk Coliseum'),
(2, 6, 9, 12, 20, 26, 15, 20, 4, 3, 2, 5, '2026-03-17 19:25:00', 'Nathan\'s Nile Breakroom'),
(3, 5, 11, 8, 23, 18, 19, 15, 2, 4, 3, 1, '2026-03-18 16:30:00', 'Cole\'s Infamous Rack');

INSERT INTO mmaFighters (firstName, lastName) VALUES
('Jon', 'Jones'),
('Israel', 'Adesanya'),
('Alex', 'Pereira'),
('Max', 'Holloway'),
('Francis', 'Ngannou'),
('Amanda', 'Nunes');

INSERT INTO mmaMatches (
  matchFighters,
  fighterOneHeadHits,
  fighterTwoHeadHits,
  fighterOneBodyHits,
  fighterTwoBodyHits,
  fighterOneDodges,
  fighterTwoDodges,
  fighterOneBlocks,
  fighterTwoBlocks,
  fighterOneNotes,
  fighterTwoNotes,
  matchDate,
  location,
  fighterOneId,
  fighterTwoId
) VALUES
('Jon Jones vs Israel Adesanya', 24, 19, 15, 12, 10, 7, 4, 5, 'Title pace', 'Countered rhythm', '2026-02-21 20:30:00', 'Las Vegas Octagon', 1, 2),
('Alex Pereira vs Max Holloway', 28, 15, 18, 10, 12, 5, 6, 4, 'Precision striking', 'Volume boxing', '2026-03-01 19:45:00', 'Rio Fight Arena', 3, 4),
('Francis Ngannou vs Amanda Nunes', 10, 12, 6, 14, 3, 6, 8, 9, 'Power punching', 'Defensive footwork', '2026-03-05 21:10:00', 'Paris Knockout Stadium', 5, 6),
('Israel Adesanya vs Max Holloway', 27, 13, 17, 9, 11, 6, 5, 3, 'Technical kicks', 'Unpredictable counters', '2026-03-09 18:00:00', 'Auckland Fight Dome', 2, 4),
('Jon Jones vs Frances Ngannou', 30, 11, 14, 9, 13, 4, 7, 5, 'Wrestling control', 'Searching openings', '2026-03-11 20:00:00', 'Newark Event Center', 1, 5),
('Amanda Nunes vs Alex Pereira', 21, 18, 13, 15, 8, 7, 6, 4, 'Champion pace', 'Tactical resets', '2026-03-14 17:30:00', 'Rio Fight Dome', 6, 3);
