"use client"

import Header from "./Components/Header";
import Footer from "./Components/Footer"
import Image from "next/image";
import pool from "./../../public/pool-homepage.jpg"
import mma from "./../../public/mma-homepage.jpg"
import form from "../../public/form.png"
import board from "../../public/board.png"
import match from "../../public/match.png"

export default function Home() {

  return (
    <>
      <Header />
      <div className="homepage-container">
        <div className="main-content">
          <h1 id="hero-title">Challenger Archive</h1>
          <p id="hero-desc">Log, track, and analyze your MMA and Pool matches all in one place.</p>
          <div className="homepage-images">
            <Image src={mma} className="homepage-pics" alt="placeholder" />
            <h1>X</h1>
            <Image src={pool} className="homepage-pics" alt="placeholder" />
          </div>
          <h2>How to use ChallengerArchive:</h2>
          <div className="step-images">
            <p id="hero-step">1. Input your matches in the form</p>
            <Image src={form} className="homepage-pics" alt="placeholder" />
          </div>
          <div className="step-images">
            <p id="hero-step">2. View your matches in the leaderboard</p>
            <Image src={board} className="homepage-pics" alt="placeholder" />
          </div>
          <div className="step-images">
            <p id="hero-step">3. Analyze your statistics to improve your game!</p>
            <Image src={match} className="homepage-pics" alt="placeholder" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
