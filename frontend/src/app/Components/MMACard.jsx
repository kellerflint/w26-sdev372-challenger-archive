import Link from 'next/link';

export default function MMACard() {
  return (
    <>
        <h2><span>Fighter One </span><span> Fighter Two</span></h2>
        <p>01.22.2026 - 5:12pm</p>
        <p>Kent, WA</p>
        <Link href="/mmamatch"><p>View Notes</p></Link>
        {/* CREATE API "/mmamatch:id" to find pool match by ID */}
    </>
  );
}
