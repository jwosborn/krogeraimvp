import React from 'react'
import { act, fireEvent, getByRole, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event';
import bulletMockResponse from './mocks/BulletResponseMock.json';
import { UploadButton } from './components/UploadButton';


describe("Test Generate Descriptions App", () => {
  
  beforeEach(async () => {
    render(<App />);
    const userInput = screen.getByLabelText(/enter user/i);
    const user = userEvent.setup();
    
    // Type into the input field
    await user.type(userInput, 'meaghan');
  })

  // Test case: Upload button functionality + DropdownSelect component
  test('upload xlxs', async () => {
    const mockFile = new File(['file contents'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const uploadButton = screen.getByText('Browse Files')
    expect(uploadButton).toBeInTheDocument();

    // Simulate the click event on the upload button
    fireEvent.click(uploadButton);

    // Find the file input element
    // const inputEl = screen.getByLabelText(/file input label/i); // Replace with the actual label or appropriate selector
    fireEvent.change(uploadButton, { target: { files: [mockFile] } });

    // Assert setProducts was called with the expected data
    // This step requires that you have a mock of setProducts available
    // expect(mockSetProducts).toHaveBeenCalledWith(expectedProducts);
  });
    
});

// Test case: Verify initialization of the App component
test('initializes properly', () => {
  render(<App />);
  const title = screen.getByText(/product description generator/i);
  const credentialsDialog = screen.getByRole('dialog');

  // test if title and dialog are on screen
  expect(title).toBeInTheDocument();
  expect(credentialsDialog).toBeInTheDocument();
});

// Test case: Verify credential setting functionality
test('sets credentials', async () => {
  const {debug} = render(<App />);
  const userInput = screen.getByLabelText(/enter user/i)

  expect(userInput).toBeInTheDocument();

  const user = userEvent.setup()
  await act(async () => {
    await user.type(userInput, 'foo')
  })

  debug();

  expect(userInput).toHaveValue('foo')
  })  