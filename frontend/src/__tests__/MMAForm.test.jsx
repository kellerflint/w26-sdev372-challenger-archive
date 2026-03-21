import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MMAFormPage from '../app/mmaform/page';

vi.mock('next/link', () => ({
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock apiFetch so the form doesn't hit a real server
vi.mock('../lib/api.client', () => ({
  apiFetch: vi.fn().mockResolvedValue({ ok: true }),
}));

import { apiFetch } from '../lib/api.client';

describe('MMAForm page', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all form fields', () => {
    render(<MMAFormPage />);

    expect(screen.getByLabelText(/date & time/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
    // There are two Name inputs — one per fighter
    expect(screen.getAllByPlaceholderText(/^name$/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders Fighter One and Fighter Two sections', () => {
    render(<MMAFormPage />);
    expect(screen.getByRole('heading', { name: /fighter one/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /fighter two/i })).toBeInTheDocument();
  });

  it('calls apiFetch with the correct payload on submit', async () => {
    const user = userEvent.setup();
    
    window.alert = () => {};
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<MMAFormPage />);

    const [nameOne, nameTwo] = screen.getAllByPlaceholderText(/^name$/i);
    const [headOne, headTwo] = screen.getAllByPlaceholderText(/head hits/i);
    const locationInput = screen.getByPlaceholderText(/location/i);
    const dateInput = screen.getByLabelText(/date & time/i);

    await user.type(nameOne, 'Alice');
    await user.type(nameTwo, 'Bob');
    await user.type(headOne, '3');
    await user.type(headTwo, '1');
    await user.type(locationInput, 'Kent');
    await user.type(dateInput, '2026-01-15T18:00');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(apiFetch).toHaveBeenCalledOnce();
    const [url, options] = apiFetch.mock.calls[0];
    expect(url).toBe('/mma/postMmaMatch');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(body.fighterOne.name).toBe('Alice');
    expect(body.fighterTwo.name).toBe('Bob');
    expect(body.fighterOne.headHits).toBe(3);
    expect(body.location).toBe('Kent');
  });
});
