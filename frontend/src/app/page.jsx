import Header from "./Components/Header";
import Image from "next/image";
import moneyGif from "./../../public/money.gif"

export default function Home() {
  
  return (
    <>
      <Header />
      <div class="main-content">
        <h1 id="hero-title">Challenger Archive</h1>
        <p id="hero-desc">Where MMA & Pool Meet.</p>
        <div class="img-div">
          <Image id="moneyGif" src={moneyGif} alt="Money falling"></Image>
        </div>
      </div>
    </>
  );
}
