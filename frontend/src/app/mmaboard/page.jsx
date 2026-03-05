"use client";

import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [leaders, setLeaders] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/mma/getMmaLeaderboard")
      .then((res) => res.json())
      .then((data) => setLeaders(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setLeaders([]);
      });
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
          <h1>MMABoard</h1>
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
        <h1>MMABoard</h1>
        <div className="match-cards-list">
          {(Array.isArray(leaders) ? leaders : []).map((leader, index) => {
            const match = leader.recentMatch;
            return (
              <div key={leader.fighterId} className="matches-class">
                <h2>Rank #{index + 1}</h2>
                <p><strong>{leader.firstName}</strong></p>
                <p>Metric: {leader.totalMetric.toFixed(0)}</p>
                {match ? (
                  <>
                    <p><strong>Latest Match:</strong> {match.matchFighters}</p>
                    <p>
                      Head Hits: {match.fighterOneHeadHits} - {match.fighterTwoHeadHits}
                    </p>
                    <p>
                      Body Hits: {match.fighterOneBodyHits} - {match.fighterTwoBodyHits}
                    </p>
                    <p>
                      Dodges: {match.fighterOneDodges} - {match.fighterTwoDodges}
                    </p>
                    <p>
                      Blocks: {match.fighterOneBlocks} - {match.fighterTwoBlocks}
                    </p>
                    <p>{formatMatchDate(match.matchDate)}</p>
                    <p>{match.location}</p>
                  </>
                ) : (
                  <p>No matches yet.</p>
                )}
                <Link href="/mmamatch" className="link-buttons">View Stats</Link>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
