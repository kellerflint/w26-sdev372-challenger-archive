"use client";

import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { apiFetch } from "../../lib/api.client";

export default function Home() {
    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

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
            matchDate: formData.get("matchdate"),
            location: formData.get("location"),
        }

        try {
            const response = await apiFetch("/pool", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const payload = response.json ? await response.json().catch(() => null) : null;
            if (!response.ok) {
                const errorMessage = payload?.error ?? 'Unable to save pool match at this time.';
                alert(errorMessage);
                return;
            }

            alert("Pool Match Saved!");
        } catch (error) {
            console.error(error);
            alert("Unable to save pool match. Please try again.");
        }
    }
    return (
        <>
            <Header />
            <h1>PoolForm</h1>
            <form onSubmit={handleSubmit}>
                <div className="pool-form-body">
                    <div className="match-details">
                        <h3>Match Details</h3>
                        <div className="match-fields">
                            <div className="match-field">
                                <label htmlFor="matchdate">Date &amp; Time</label>
                                <input name="matchdate" type="datetime-local" id="matchdate" required />
                            </div>
                            <div className="match-field">
                                <label htmlFor="location">Location</label>
                                <input name="location" type="text" id="location" placeholder="Location" required />
                            </div>
                        </div>
                    </div>

                    <div className="player-form-div">
                        <div className="player-form">
                            <h3>Player One</h3>
                            <input name="playerone" placeholder="Name" />
                            <input name="playeronescore" type="number" placeholder="Score" />
                            <input name="playeronemade" type="number" placeholder="Made Balls" />
                            <input name="playeroneatt" type="number" placeholder="Attempted Balls" />
                            <input name="playeroneerr" type="number" placeholder="Errors" />
                            <input name="playeronesafe" type="number" placeholder="Safeties" />
                        </div>

                        <div className="player-form">
                            <h3>Player Two</h3>
                            <input name="playertwo" placeholder="Name" />
                            <input name="playertwoscore" type="number" placeholder="Score" />
                            <input name="playertwomade" type="number" placeholder="Made Balls" />
                            <input name="playertwoatt" type="number" placeholder="Attempted Balls" />
                            <input name="playertwoerr" type="number" placeholder="Errors" />
                            <input name="playertwosafe" type="number" placeholder="Safeties" />
                        </div>
                    </div>
                </div>
                <button type="submit" className="link-buttons">Submit</button>
            </form>
            <Footer />
        </>
    );
}
