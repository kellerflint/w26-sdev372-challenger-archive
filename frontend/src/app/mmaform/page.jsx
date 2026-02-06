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
      <h1>MMA Form</h1>
      <form action={handleSubmit}>
        <div class="player-form-div">
            <div class="player-form">
                <p>Fighter One</p>
                <label>Name</label>
                    <input type="text"></input>
                <label>Name</label>
                    <input type="number"></input>
                <label>Head Hits</label>
                    <input type="number"></input>
                <label>Body Hits</label>
                    <input type="number"></input>
                <label>Dodges</label>
                    <input type="number"></input>
                <label>Notes</label>
                    <input type="text"></input>
            </div>
            <div class="player-form">
            <p>Fighter Two</p>
            <label>Name</label>
                <input type="text"></input>
            <label>Name</label>
                <input type="number"></input>
            <label>Head Hits</label>
                <input type="number"></input>
            <label>Body Hits</label>
                <input type="number"></input>
            <label>Dodges</label>
                <input type="number"></input>
            <label>Notes</label>
                <input type="text"></input>
            </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
