import Link from 'next/link';

export default function PoolCard() {
  return (
    <>
        <h2><span>Player One </span><span>2 </span><span> 7</span><span> Player Two</span></h2>
        <p>01.21.2026 - 4:50pm</p>
        <p>Bellevue, WA</p>
        <Link href="/poolmatch"><p>View Stats</p></Link>
        {/* CREATE API "/poolmatch:id" to find pool match by ID */}
    </>
  );
}
