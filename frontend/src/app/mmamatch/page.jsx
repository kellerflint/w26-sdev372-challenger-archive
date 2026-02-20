"use client";

import { useEffect, useState } from "react";
import Header from "../Components/Header";

export default function Home() {
  
  const [data, setData] = useState(null);

  useEffect(() => {
      fetch("http://localhost:3001/matches")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);


  return (
    <>
      <Header />
      <h1>MMAMatch</h1>
      <span>{JSON.stringify(data)}</span>
    </>
  );
}
