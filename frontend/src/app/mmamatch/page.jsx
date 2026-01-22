import Header from "../Components/Header";

export default async function Home() {

  let data = await fetch('http://localhost:3001/matches');
  let matches = await data.text();
  return (
    <>
      <Header />
      <h1>MMAMatch</h1>
      <span>{matches}</span>
    </>
  );
}
