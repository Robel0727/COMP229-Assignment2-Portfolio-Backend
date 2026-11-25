
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../pages/Contact';

describe('Contact Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays all required contact form fields', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('submits contact information successfully', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Contact submitted successfully'
      })
    });

    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Student' }
    });

    fireEvent.change(screen.getByLabelText(/contact number/i), {
      target: { value: '4165550123' }
    });

    fireEvent.change(screen.getByLabelText(/^email:/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Testing the contact form.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://comp229-assignment2-portfolio-backend-jde2.onrender.com/api/contacts',
      expect.objectContaining({
        method: 'POST'
      })
    );
  });

  it('displays an error when contact submission fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network connection failed'));

    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Student' }
    });

    fireEvent.change(screen.getByLabelText(/contact number/i), {
      target: { value: '4165550123' }
    });

    fireEvent.change(screen.getByLabelText(/^email:/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Testing an error.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Network connection failed'
    );
  });
});
