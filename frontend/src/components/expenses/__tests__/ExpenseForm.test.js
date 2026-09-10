import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseForm from '../ExpenseForm';

const categories = [
  { id: 1, name: 'Food', is_default: true },
  { id: 2, name: 'Transport', is_default: true },
];

describe('ExpenseForm', () => {
  test('submits the entered values with the right shape', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <ExpenseForm categories={categories} initialValues={null} onSubmit={handleSubmit} onCancel={() => {}} />
    );

    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '25.50' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Coffee' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));

    const submitted = handleSubmit.mock.calls[0][0];
    expect(submitted.category_id).toBe(1);
    expect(submitted.amount).toBe(25.5);
    expect(submitted.description).toBe('Coffee');
    expect(submitted.is_recurring).toBe(false);
    expect(submitted.recurrence_interval).toBeNull();
  });

  test('shows the backend error message when submission fails', async () => {
    const handleSubmit = jest.fn().mockRejectedValue(new Error('Amount must be a positive number'));
    render(
      <ExpenseForm categories={categories} initialValues={null} onSubmit={handleSubmit} onCancel={() => {}} />
    );

    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

    expect(await screen.findByText('Amount must be a positive number')).toBeInTheDocument();
  });

  test('reveals the recurrence interval field only when "repeats" is checked', () => {
    render(
      <ExpenseForm categories={categories} initialValues={null} onSubmit={jest.fn()} onCancel={() => {}} />
    );

    expect(screen.queryByLabelText('Repeats every')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('This expense repeats'));

    expect(screen.getByLabelText('Repeats every')).toBeInTheDocument();
  });
});
