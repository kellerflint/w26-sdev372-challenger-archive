"use client";
import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { apiFetch } from "../../lib/api.client";

export default function Home() {

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      matchDate: formData.get("matchDate"),
      location: formData.get("matchLocation"),
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

    await apiFetch("/mma/postMmaMatch", {
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
        <div className="pool-form-body">
          <div className="match-details">
            <h3>Match Details</h3>
            <div className="match-fields">
              <div className="match-field">
                <label htmlFor="matchDate">Date &amp; Time</label>
                <input id="matchDate" name="matchDate" type="datetime-local" required />
              </div>
              <div className="match-field">
                <label htmlFor="matchLocation">Location</label>
                <input id="matchLocation" name="matchLocation" placeholder="Location" required />
              </div>
            </div>
          </div>
          <div className="player-form-div">
            <div className="player-form">
              <h3>Fighter One</h3>
              <input name="fighterOneName" placeholder="Name" />
              <input name="fighterOneHead" type="number" placeholder="Head Hits" />
              <input name="fighterOneBody" type="number" placeholder="Body Hits" />
              <input name="fighterOneDodges" type="number" placeholder="Dodges" />
              <input name="fighterOneBlocks" type="number" placeholder="Blocks" />
              <input name="fighterOneNotes" placeholder="Notes" />
            </div>
            <div className="player-form">
              <h3>Fighter Two</h3>
              <input name="fighterTwoName" placeholder="Name" />
              <input name="fighterTwoHead" type="number" placeholder="Head Hits" />
              <input name="fighterTwoBody" type="number" placeholder="Body Hits" />
              <input name="fighterTwoDodges" type="number" placeholder="Dodges" />
              <input name="fighterTwoBlocks" type="number" placeholder="Blocks" />
              <input name="fighterTwoNotes" placeholder="Notes" />
            </div>
          </div>
        </div>
        <button type="submit" className="link-buttons">Submit</button>
      </form>
      <Footer />
    </>
  );
}
