import Header from "../Components/Header";
import MMACard from "../Components/MMACard";

export default function Home() {
  return (
    <>
      <Header />
      <h1>MMABoard</h1>
      <div class="match-cards-list">
      <MMACard />
      <MMACard />
      <MMACard />
      <MMACard />
      </div>
    </>
  );
}
