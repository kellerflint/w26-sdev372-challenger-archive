import Header from "../Components/Header";

export default async function Home() {
  let data = await fetch('http://localhost:3001/players');
  let matches = await data.text();
  return (
    <>
      <Header />
      <h1>PoolMatch</h1>
      <span>{matches}</span>
    </>
  );
}
