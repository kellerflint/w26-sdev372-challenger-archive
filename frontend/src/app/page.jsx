"use client"

import { useEffect, useState } from "react";
import Header from "./Components/Header";
import Image from "next/image";
import moneyGif from "./../../public/money.gif"
export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <Header />
      <div class="main-content">
        <h1 id="hero-title">Challenger Archive</h1>
        <p id="hero-desc">Where MMA & Pool Meet.</p>

        <div class="img-div">
          <Image id="moneyGif" src={moneyGif} alt="Money falling"></Image>
          <h3><i>Testing if API works: {data.sport}</i></h3>
          <img alt="thumbnail of sport" src={data.sportPic} width="250"></img>
        </div>
      </div>
    </>
  );
}
