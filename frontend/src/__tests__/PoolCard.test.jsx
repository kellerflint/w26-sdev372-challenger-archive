import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PoolCard from '../app/Components/PoolCard';

vi.mock('next/link', () => ({
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('PoolCard', () => {
  it('renders a player matchup heading', () => {
    render(<PoolCard />);
    expect(screen.getByRole('heading', { name: /player one vs player two/i })).toBeInTheDocument();
  });

  it('renders a "View Stats" link pointing to /poolmatch', () => {
    render(<PoolCard />);
    const link = screen.getByRole('link', { name: /view stats/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/poolmatch');
  });

  it('renders the score', () => {
    render(<PoolCard />);
    expect(screen.getByText(/score:\s*2\s*-\s*7/i)).toBeInTheDocument();
  });

  it('renders a date and location', () => {
    render(<PoolCard />);
    expect(screen.getByText(/01\.21\.2026/)).toBeInTheDocument();
    expect(screen.getByText(/bellevue/i)).toBeInTheDocument();
  });
});
