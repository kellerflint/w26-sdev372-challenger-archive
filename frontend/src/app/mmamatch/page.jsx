"use client";

import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/mma/getMmaMatches")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  const formatMatchDate = (value) => {
    if (!value) return "TBD";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const dateOptions = { month: "2-digit", day: "2-digit", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };
    return `${parsed.toLocaleDateString("en-US", dateOptions)} • ${parsed.toLocaleTimeString("en-US", timeOptions)}`;
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <h1>MMA Match</h1>
        <div className="cards-container">
          {data.map(match => (
            <div key={match.matchId} className="matches-class">
              <h2>Match #{match.matchId}</h2>
              <p><strong>Match Fighters:</strong> {match.matchFighters}</p>
              <p><strong>Fighter One:</strong> {match.fighterOne}</p>
              <p><strong>Fighter Two:</strong> {match.fighterTwo}</p>
              <p><strong>Head Hits:</strong> {match.fighterOneHeadHits} - {match.fighterTwoHeadHits}</p>
              <p><strong>Body Hits:</strong> {match.fighterOneBodyHits} - {match.fighterTwoBodyHits}</p>
              <p><strong>Dodges:</strong> {match.fighterOneDodges} - {match.fighterTwoDodges}</p>
              <p><strong>Blocks:</strong> {match.fighterOneBlocks} - {match.fighterTwoBlocks}</p>
              {match.fighterOneNotes && (
                <p><strong>Fighter One Notes:</strong> {match.fighterOneNotes}</p>
              )}
              {match.fighterTwoNotes && (
                <p><strong>Fighter Two Notes:</strong> {match.fighterTwoNotes}</p>
              )}
              <p><strong>Match Date:</strong> {formatMatchDate(match.matchDate)}</p>
              <p><strong>Location:</strong> {match.location}</p>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  );

}
