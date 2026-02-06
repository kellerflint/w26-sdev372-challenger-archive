import Header from "../Components/Header";

export default function Home() {
  const handleSubmit = {
    //take all the info
    //add it to a json obj
    //call an api link
    //send the json obj via api link
    
  } 
  return (
    <>
      <Header />
      <h1>Pool Form</h1>
      <form action={handleSubmit}>
        <div class="player-form-div">
            <div class="player-form">
            <p>Player One</p>
                <label for="playerone">Name: </label>
                    <input type="text" id="playerone" name="playerone"></input>
                <label for="playeronescore">Score: </label>
                    <input type="number" id="playeronescore" name="playeronescore"></input>
                <label>Made Balls</label>
                    <input type="number" id="playeronemade"></input>
                <label>Attempted Balls</label>
                    <input type="number" id="playeroneatt"></input>
                <label>Errors</label>
                    <input type="number" id="playeroneerr"></input>
                <label>Safeties</label>
                    <input type="number" id="playeronesafe"></input>
            </div>
            <div class="player-form">
            <p>Player Two</p>
                <label for="playertwo">Name: </label>
                    <input type="text" id="playertwo" name="playertwo"></input>
                <label for="playertwoscore">Score: </label>
                    <input type="number" id="playertwoscore" name="playertwoscore"></input>
                <label>Made Balls</label>
                    <input type="number" id="playertwomade"></input>
                <label>Attempted Balls</label>
                    <input type="number" id="playertwoatt"></input>
                <label>Errors</label>
                    <input type="number" id="playertwoerr"></input>
                <label>Safeties</label>
                    <input type="number" id="playertwosafe"></input>
            </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
