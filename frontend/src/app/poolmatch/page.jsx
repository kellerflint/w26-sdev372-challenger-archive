"use client"

import { useEffect, useState } from "react";
import Header from "../Components/Header";

export default function Home() {
  const [matches, setMatches] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/players")
      .then(res => res.text())
      .then(data => setMatches(data))
      .catch(err => console.error(err));

    fetch("http://localhost:3001/players/odds")
      .then(res => res.text())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!matches || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <h1>PoolMatch</h1>
      <span>{JSON.stringify(matches)}</span>

      <h2>Mock Stats</h2>
      <span>{JSON.stringify(stats)}</span>
    </>
  );
}
