import React from 'react'
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event';

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
  render(<App />);
  const userInput = screen.getByLabelText(/enter user/i)

  expect(userInput).toBeInTheDocument();

  const user = userEvent.setup()
  await act(async () => {
    await user.type(userInput, 'foo')
  })

  expect(userInput).toHaveValue('foo')

  })


// test('uploads a file', async () => {
//     const { container } = render(<App />)
//     const userInput = screen.getByLabelText(/enter user/i)

//     expect(userInput).toBeInTheDocument();

//     const file = new File(['hello'], 'hello.png', {type: 'image/png'})
//     const user = userEvent.setup()
//     await act(async () => {
//       await user.type(userInput, 'meaghan')
//     })

//     const fileInput: any = container.querySelector(
//         'input[type="file"]'
//     )

//     await act(async () => {
//         await user.upload(fileInput, file)
//         expect(fileInput.files[0]).toStrictEqual(file)
//     })
// });