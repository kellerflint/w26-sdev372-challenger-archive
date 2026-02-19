import Header from "../Components/Header";

export default async function Home() {
  let data = await fetch('http://localhost:3001/players');
  let matches = await data.text();

  let data2 = await fetch('http://localhost:3001/players/odds');
  let stats = await data2.text();
  return (
    <>
      <Header />
      <h1>PoolMatch</h1>
      <span>{matches}</span>

      <h2>Mock Stats</h2>
      <span>{stats}</span>
    </>
  );
}
