import Link from 'next/link';

export default function MMACard() {
  return (
    <>
          <div class="match-card">
            <h2><span>Fighter One </span><span> Fighter Two</span></h2>
            <div>
              <p>01.22.2026 - 5:12pm</p>
              <p>Kent, WA</p>
              <Link href="/mmamatch" className="view-notes-link"><p>View Notes</p></Link>
              {/* CREATE API "/mmamatch:id" to find pool match by ID */}
            </div>
          </div>
    </>
  );
}
