import Header from "../Components/Header";
import PoolCard from "../Components/PoolCard";

export default function Home() {
  return (
    <>
      <Header />
      <h1>PoolBoard</h1>
      <div class="match-cards-list">
      <PoolCard />
      <PoolCard />
      <PoolCard />
      <PoolCard />
      </div>
    </>
  );
}
