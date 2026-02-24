"use client";

import Header from "../Components/Header";

export default function Home() {
    function handleSubmit(formData) {
        const playerOne = {
            name: formData.get("playerone"),
            score: Number(formData.get("playeronescore")),
            madeBalls: Number(formData.get("playeronemade")),
            attemptedBalls: Number(formData.get("playeroneatt")),
            errors: Number(formData.get("playeroneerr")),
            safeties: Number(formData.get("playeronesafe")),
        }
        const playerTwo = {
            name: formData.get("playertwo"),
            score: Number(formData.get("playertwoscore")),
            madeBalls: Number(formData.get("playertwomade")),
            attemptedBalls: Number(formData.get("playertwoatt")),
            errors: Number(formData.get("playertwoerr")),
            safeties: Number(formData.get("playertwosafe")),
        }
        const data = {
            playerOne: playerOne,
            playerTwo: playerTwo,
        }
        console.log(data);

        return data;
    }
  return (
    <>
      <Header />
      <h1>Pool Form</h1>
      <form onSubmit={handleSubmit}>
        <div class="player-form-div">
            <div class="player-form">
            <p>Player One</p>
                <label for="playerone">Name: </label>
                    <input type="text" id="playerone" name="playerone"></input>
                <label for="playeronescore">Score: </label>
                    <input type="number" id="playeronescore" name="playeronescore"></input>
                <label>Made Balls</label>
                    <input type="number" id="playeronemade" name="playeronemade"></input>
                <label>Attempted Balls</label>
                    <input type="number" id="playeroneatt" name="playeroneatt"></input>
                <label>Errors</label>
                    <input type="number" id="playeroneerr" name="playeroneerr"></input>
                <label>Safeties</label>
                    <input type="number" id="playeronesafe" name="playeronesafe"></input>
            </div>
            <div class="player-form">
            <p>Player Two</p>
                <label for="playertwo">Name: </label>
                    <input type="text" id="playertwo" name="playertwo"></input>
                <label for="playertwoscore">Score: </label>
                    <input type="number" id="playertwoscore" name="playertwoscore"></input>
                <label>Made Balls</label>
                    <input type="number" id="playertwomade" name="playertwomade"></input>
                <label>Attempted Balls</label>
                    <input type="number" id="playertwoatt" name="playertwoatt"></input>
                <label>Errors</label>
                    <input type="number" id="playertwoerr" name="playertwoerr"></input>
                <label>Safeties</label>
                    <input type="number" id="playertwosafe" name="playertwosafe"></input>
            </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
