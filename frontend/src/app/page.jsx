"use client"

import Header from "./Components/Header";
import Footer from "./Components/Footer"
import Image from "next/image";
import pool from "./../../public/pool-homepage.jpg"
import mma from "./../../public/mma-homepage.jpg"

export default function Home() {

  return (
    <>
      <Header />
      <div className="homepage-container">
        <div className="main-content">
          <h1 id="hero-title">Challenger Archive</h1>
          <p id="hero-desc">Where MMA & Pool Meet.</p>
          <div className="homepage-images">
            <Image src={mma} className="homepage-pics" alt="placeholder" />
            <h1>X</h1>
            <Image src={pool} className="homepage-pics" alt="placeholder" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
