import Link from 'next/link';

export default function Header() {
  return (
    <div className="header">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/poolboard">Pool Leaderboard</Link>
        <Link href="/mmaboard">MMA Leaderboard</Link>
        <Link href="/poolform">Pool Form</Link>
        <Link href="/mmaform">MMA Form</Link>
        <Link href="/poolmatch">Pool Match</Link>
        <Link href="/mmamatch">MMA Match</Link>
      </nav>
    </div>
  );
}
