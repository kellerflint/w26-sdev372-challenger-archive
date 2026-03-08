import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../app/Components/Header';

vi.mock('next/link', () => ({
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('Header', () => {
  it('renders the Home link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('renders MMA navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /mma leaderboard/i })).toHaveAttribute('href', '/mmaboard');
    expect(screen.getByRole('link', { name: /mma form/i })).toHaveAttribute('href', '/mmaform');
    expect(screen.getByRole('link', { name: /mma match/i })).toHaveAttribute('href', '/mmamatch');
  });

  it('renders Pool navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /pool leaderboard/i })).toHaveAttribute('href', '/poolboard');
    expect(screen.getByRole('link', { name: /pool form/i })).toHaveAttribute('href', '/poolform');
    expect(screen.getByRole('link', { name: /pool match/i })).toHaveAttribute('href', '/poolmatch');
  });
});
