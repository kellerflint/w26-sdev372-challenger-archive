import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MMACard from '../app/Components/MMACard';

vi.mock('next/link', () => ({
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('MMACard', () => {
  it('renders a fighter matchup heading', () => {
    render(<MMACard />);
    expect(screen.getByRole('heading', { name: /fighter one vs fighter two/i })).toBeInTheDocument();
  });

  it('renders a "View Notes" link pointing to /mmamatch', () => {
    render(<MMACard />);
    const link = screen.getByRole('link', { name: /view notes/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/mmamatch');
  });

  it('renders a date and location', () => {
    render(<MMACard />);
    expect(screen.getByText(/01\.22\.2026/)).toBeInTheDocument();
    expect(screen.getByText(/kent/i)).toBeInTheDocument();
  });
});
