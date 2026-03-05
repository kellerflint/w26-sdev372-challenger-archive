"use client";

import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Link from "next/link";

export default function Home() {
  const [leaders, setLeaders] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/pool/getPoolLeaderboard")
      .then((res) => res.json())
      .then((data) => setLeaders(data))
      .catch((err) => console.error(err));
  }, []);

  const formatMatchDate = (value) => {
    if (!value) return "TBD";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const dateOptions = { month: "2-digit", day: "2-digit", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };
    return `${parsed.toLocaleDateString("en-US", dateOptions)} • ${parsed.toLocaleTimeString("en-US", timeOptions)}`;
  };

  if (!leaders) {
    return (
      <>
        <Header />
        <main className="page-container">
          <h1>PoolBoard</h1>
          <p>Loading leaderboard…</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <h1>PoolBoard</h1>
        <div className="match-cards-list">
          {leaders.map((leader, index) => {
            const match = leader.recentMatch;
            const winPct = Math.round((leader.winPct ?? 0) * 100);
            const opponent = match
              ? match.playerOneId === leader.playerId
                ? match.playerTwo
                : match.playerOne
              : null;
            const playerScore = match
              ? match.playerOneId === leader.playerId
                ? match.playerOneScore
                : match.playerTwoScore
              : null;
            const opponentScore = match
              ? match.playerOneId === leader.playerId
                ? match.playerTwoScore
                : match.playerOneScore
              : null;

            return (
              <div key={leader.playerId} className="matches-class">
                <h2>Rank #{index + 1}</h2>
                <p>
                  <strong>{leader.firstName}</strong>
                </p>
                <p>Record: {leader.win} - {leader.loss} ({winPct}% win)</p>
                {match ? (
                  <>
                    <p>
                      <strong>Latest Match:</strong> {match.playerOne} vs {match.playerTwo}
                    </p>
                    <p>
                      Score: {playerScore} - {opponentScore}
                    </p>
                    <p>Opponent: {opponent}</p>
                    <p>{formatMatchDate(match.matchDate)}</p>
                    <p>{match.location}</p>
                  </>
                ) : (
                  <p>No matches recorded yet.</p>
                )}
                <Link href="/poolmatch" className="link-buttons">
                  View Stats
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
