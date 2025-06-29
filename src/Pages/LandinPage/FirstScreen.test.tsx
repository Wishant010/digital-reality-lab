import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import HomePage from './FirstScreen';

describe('HomePage', () => {
  it('renders hack button', () => {
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /Hack Website/i })).toBeInTheDocument();
  });

  it('shows initiating hack after click', async () => {
    vi.useFakeTimers();
    render(<HomePage />);
    const button = screen.getByRole('button', { name: /Hack Website/i });
    await userEvent.click(button);
    vi.runAllTimers();
    expect(await screen.findByText(/Initiating Hack/i)).toBeInTheDocument();
  });
});
