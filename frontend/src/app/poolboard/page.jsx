import Header from "../Components/Header";
import Footer from "../Components/Footer"
import PoolCard from "../Components/PoolCard";

export default function Home() {
  return (
    <>
      <Header />
      <h1>PoolBoard</h1>
      <div className="match-cards-list">
        <PoolCard />
        <PoolCard />
        <PoolCard />
        <PoolCard />
      </div>
      <Footer />
    </>
  );
}
