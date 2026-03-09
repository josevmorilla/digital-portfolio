import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminMessages from '../pages/admin/AdminMessages';

vi.mock('../services/api', () => ({
  contactMessagesAPI: {
    getAll: vi.fn(),
    markAsRead: vi.fn(),
    markAsUnread: vi.fn(),
    delete: vi.fn(),
  },
}));

import { contactMessagesAPI } from '../services/api';

const mockMessages = [
  { id: '1', name: 'Alice', email: 'alice@test.com', message: 'Hello there, this is a test message from Alice with enough text.', read: false, createdAt: '2025-01-15T10:00:00Z' },
  { id: '2', name: 'Bob', email: 'bob@test.com', message: 'Another message here from Bob with enough text to preview.', read: true, createdAt: '2025-01-14T10:00:00Z', phone: '555-1234' },
];

function renderMessages() {
  return render(
    <MemoryRouter>
      <AdminMessages />
    </MemoryRouter>
  );
}

describe('AdminMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contactMessagesAPI.getAll.mockResolvedValue({ data: mockMessages });
  });

  test('shows loading spinner initially', () => {
    contactMessagesAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderMessages();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders message list after loading', async () => {
    renderMessages();
    await waitFor(() => expect(screen.getByText(/Inbox/)).toBeInTheDocument());
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('shows unread count', async () => {
    renderMessages();
    await waitFor(() => expect(screen.getByText(/1 unread/)).toBeInTheDocument());
  });

  test('selects a message to view details', async () => {
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    // Click the message item button containing Alice
    const aliceBtn = screen.getByText('Alice').closest('button');
    fireEvent.click(aliceBtn);
    await waitFor(() => expect(screen.getByText('Message Details')).toBeInTheDocument());
    expect(screen.getAllByText('alice@test.com').length).toBeGreaterThan(0);
  });

  test('shows phone when available in selected message', async () => {
    renderMessages();
    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());
    const bobBtn = screen.getByText('Bob').closest('button');
    fireEvent.click(bobBtn);
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  test('closes message detail', async () => {
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Alice'));
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('Message Details')).not.toBeInTheDocument();
  });

  test('marks message as read', async () => {
    contactMessagesAPI.markAsRead.mockResolvedValue({});
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    const aliceBtn = screen.getByText('Alice').closest('button');
    fireEvent.click(aliceBtn);
    const readBtn = screen.getByText('Mark as Read');
    fireEvent.click(readBtn);
    await waitFor(() => expect(contactMessagesAPI.markAsRead).toHaveBeenCalledWith('1'));
  });

  test('marks message as unread', async () => {
    contactMessagesAPI.markAsUnread.mockResolvedValue({});
    renderMessages();
    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());
    const bobBtn = screen.getByText('Bob').closest('button');
    fireEvent.click(bobBtn);
    const unreadBtn = screen.getByText('Mark as Unread');
    fireEvent.click(unreadBtn);
    await waitFor(() => expect(contactMessagesAPI.markAsUnread).toHaveBeenCalledWith('2'));
  });

  test('deletes a message', async () => {
    contactMessagesAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    const aliceBtn = screen.getByText('Alice').closest('button');
    fireEvent.click(aliceBtn);
    fireEvent.click(screen.getByText('Delete Message'));

    expect(globalThis.confirm).toHaveBeenCalled();
    await waitFor(() => expect(contactMessagesAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('cancels delete', async () => {
    globalThis.confirm = vi.fn(() => false);
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    const aliceBtn = screen.getByText('Alice').closest('button');
    fireEvent.click(aliceBtn);
    fireEvent.click(screen.getByText('Delete Message'));
    expect(contactMessagesAPI.delete).not.toHaveBeenCalled();
  });

  test('handles markAsUnread error', async () => {
    contactMessagesAPI.markAsUnread.mockRejectedValue(new Error('Network'));
    renderMessages();
    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());
    const bobBtn = screen.getByText('Bob').closest('button');
    fireEvent.click(bobBtn);
    fireEvent.click(screen.getByText('Mark as Unread'));
    await waitFor(() => expect(contactMessagesAPI.markAsUnread).toHaveBeenCalledWith('2'));
  });

  test('handles delete error', async () => {
    contactMessagesAPI.delete.mockRejectedValue(new Error('Network'));
    globalThis.confirm = vi.fn(() => true);
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    const aliceBtn = screen.getByText('Alice').closest('button');
    fireEvent.click(aliceBtn);
    fireEvent.click(screen.getByText('Delete Message'));
    await waitFor(() => expect(contactMessagesAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('shows empty state', async () => {
    contactMessagesAPI.getAll.mockResolvedValue({ data: [] });
    renderMessages();
    await waitFor(() => expect(screen.getByText('No messages yet')).toBeInTheDocument());
  });

  test('handles fetch error', async () => {
    contactMessagesAPI.getAll.mockRejectedValue(new Error('Network error'));
    renderMessages();
    await waitFor(() => expect(screen.getByText(/Inbox/)).toBeInTheDocument());
  });

  test('handles mark as read error', async () => {
    contactMessagesAPI.markAsRead.mockRejectedValue(new Error('Failed'));
    renderMessages();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    const aliceBtn = screen.getByText('Alice').closest('button');
    fireEvent.click(aliceBtn);
    fireEvent.click(screen.getByText('Mark as Read'));
    // Should not crash
    await waitFor(() => expect(contactMessagesAPI.markAsRead).toHaveBeenCalled());
  });

  test('has back to dashboard link', async () => {
    renderMessages();
    await waitFor(() => expect(screen.getByText('Back to Dashboard')).toBeInTheDocument());
  });
});
