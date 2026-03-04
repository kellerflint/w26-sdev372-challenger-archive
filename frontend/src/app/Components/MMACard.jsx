import Link from "next/link";

export default function MMACard() {
  return (
    <div className="matches-class">
      <h2>Fighter One vs Fighter Two</h2>
      <p>01.22.2026 • 5:12 PM</p>
      <p>Kent, WA</p>

      <Link href="/mmamatch" className="link-buttons">View Notes</Link>
    </div>
  );
}