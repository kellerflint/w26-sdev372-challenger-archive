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
      <h1>MMAForm</h1>
      <form action={handleSubmit}>
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
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
