import Link from "next/link";

export default function PoolCard() {
  return (
    <div className="matches-class">
      <h2>Player One vs Player Two</h2>
      <p>Score: 2 - 7</p>
      <p>01.21.2026 • 4:50 PM</p>
      <p>Bellevue, WA</p>

      <Link href="/poolmatch" className="link-buttons">View Stats</Link>
    </div>
  );
}