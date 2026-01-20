import Link from 'next/link';

export default function Header() {
  return (
    <div className="header">
      <nav>
        <button><Link href="/">Home</Link></button>
        <button><Link href="/poolboard">Pool Leaderboard</Link></button>
        <button><Link href="/mmaboard">MMA Leaderboard</Link></button>
        <button><Link href="/poolform">Pool Form</Link></button>
        <button><Link href="/mmaform">MMA Form</Link></button>
        <button><Link href="/poolmatch">Pool Match</Link></button>
        <button><Link href="/mmamatch">MMA Match</Link></button>
      </nav>
    </div>
  );
}
