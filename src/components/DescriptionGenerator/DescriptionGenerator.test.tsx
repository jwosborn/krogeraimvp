import { act, render, screen } from '@testing-library/react';
import DescriptionGenerator from './DescriptionGenerator';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event';

describe('Complete App testing', () => {
  // Test case: Verify initialization of the App component
  it('initializes properly', () => {
    render(<DescriptionGenerator />);
    const title = screen.getByText(/product description generator/i);
    const credentialsDialog = screen.getByRole('dialog');

    // test if title and dialog are on screen
    expect(title).toBeInTheDocument();
    expect(credentialsDialog).toBeInTheDocument();
  });


  // Test case: Verify credential setting functionality
  it('sets credentials', async () => {
    render(<DescriptionGenerator />);
    const userInput = screen.getByLabelText(/enter user/i)

    expect(userInput).toBeInTheDocument();

    const user = userEvent.setup()
    await act(async () => {
      await user.type(userInput, 'foo')
    })

    expect(userInput).toHaveValue('foo')
  });
});