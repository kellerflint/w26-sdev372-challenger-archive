"use client";

import { useEffect, useState } from "react";
import Header from "../Components/Header";

export default function Home() {
  
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
      fetch("http://localhost:3001/matches")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));

      fetch("http://localhost:3001/players/odds")
      .then(res => res.text())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!data || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <h1>PoolMatch</h1>
      <span>{JSON.stringify(data)}</span>

      <h2>Mock Stats</h2>
      <span>{JSON.stringify(stats)}</span>
    </>
  );

}
