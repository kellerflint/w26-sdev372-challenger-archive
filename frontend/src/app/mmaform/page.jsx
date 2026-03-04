"use client";
import Header from "../Components/Header";
import Footer from "../Components/Footer"

export default function Home() {

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      fighterOne: {
        name: formData.get("fighterOneName"),
        headHits: Number(formData.get("fighterOneHead")),
        bodyHits: Number(formData.get("fighterOneBody")),
        dodges: Number(formData.get("fighterOneDodges")),
        blocks: Number(formData.get("fighterOneBlocks")),
        notes: formData.get("fighterOneNotes"),
      },
      fighterTwo: {
        name: formData.get("fighterTwoName"),
        headHits: Number(formData.get("fighterTwoHead")),
        bodyHits: Number(formData.get("fighterTwoBody")),
        dodges: Number(formData.get("fighterTwoDodges")),
        blocks: Number(formData.get("fighterTwoBlocks")),
        notes: formData.get("fighterTwoNotes"),
      },
    };

    await fetch("http://localhost:3001/matches/mmaMatches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("MMA Match Saved!");
  }

  return (
    <>
      <Header />
      <h1>MMA Form</h1>

      <form onSubmit={handleSubmit}>
        <div class="player-form-div">
          <div class="player-form">
            <h3>Fighter One</h3>
            <input name="fighterOneName" placeholder="Name" />
            <input name="fighterOneHead" type="number" placeholder="Head Hits" />
            <input name="fighterOneBody" type="number" placeholder="Body Hits" />
            <input name="fighterOneDodges" type="number" placeholder="Dodges" />
            <input name="fighterOneBlocks" type="number" placeholder="Blocks" />
            <input name="fighterOneNotes" placeholder="Notes" />
          </div>
          <div class="player-form">
            <h3>Fighter Two</h3>
            <input name="fighterTwoName" placeholder="Name" />
            <input name="fighterTwoHead" type="number" placeholder="Head Hits" />
            <input name="fighterTwoBody" type="number" placeholder="Body Hits" />
            <input name="fighterTwoDodges" type="number" placeholder="Dodges" />
            <input name="fighterTwoBlocks" type="number" placeholder="Blocks" />
            <input name="fighterTwoNotes" placeholder="Notes" />
          </div>
        </div>
        <button type="submit" className="link-buttons">Submit</button>
      </form>
      <Footer />
    </>
  );
}
