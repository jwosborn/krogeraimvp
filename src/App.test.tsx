import React from 'react'
import { act, fireEvent, getByRole, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event';
import productsMock from './mocks/productsMock.json';
import { UploadButton } from './components/UploadButton';
import renderer from 'react-test-renderer';
import { Loader } from './components/Loader';

const ReactTestRenderer = require('react-test-renderer');

// Mocks
jest.mock('xlsx', () => ({
  read: jest.fn().mockReturnValue({
    SheetNames: ['UPLOAD'],
    Sheets: {
      Sheet1: {}
    }
  }),
  utils: {
    sheet_to_json: jest.fn().mockReturnValue([['Index', 'group',	'Product_Title',	'New Shrimp Title',	'UPC', 'brand','claim/raised',	'attribute',	'cook-state',	'meat type',	'flavor',	'cut type',	'marketing',	'ingredients',	'ingredients2',	'Feature', 'Bullets',	'category',	'DescPrompt',	'BulletPrompt'],
    ['']])
  }
}));

// Mock function for CSVToArray (if it's a custom function)
jest.mock('./utils/format', () => ({
  CSVToArray: jest.fn().mockReturnValue([['Header1', 'Header2'], ['Row1Data1', 'Row1Data2']])
}));


// Test case: Verify initialization of the App component
it('initializes properly', () => {
  render(<App />);
  const title = screen.getByText(/product description generator/i);
  const credentialsDialog = screen.getByRole('dialog');

  // test if title and dialog are on screen
  expect(title).toBeInTheDocument();
  expect(credentialsDialog).toBeInTheDocument();
});


// Test case: Verify credential setting functionality
it('sets credentials', async () => {
  render(<App />);
  const userInput = screen.getByLabelText(/enter user/i)

  expect(userInput).toBeInTheDocument();

  const user = userEvent.setup()
  await act(async () => {
    await user.type(userInput, 'foo')
  })

  expect(userInput).toHaveValue('foo')
});

describe('UploadButton', () => {
  // Mock state update functions
  const mockSetProducts = jest.fn();
  const mockSetChoosingSheet = jest.fn();
  const mockSetSheet = jest.fn();
  const mockSetSheetChoices = jest.fn();
  const mockSetWb = jest.fn();

  // Mock files for upload
  const mockXLSXFile = new File([''], 'example.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const mockCSVFile = new File(['Header1,Header2\nRow1Data1,Row1Data2'], 'example.csv', { type: 'text/csv' });

  it('renders the file upload component when products array is empty', () => {
    const { getByText } = render(
      <UploadButton
        products={[]}
        setProducts={mockSetProducts}
        setChoosingSheet={mockSetChoosingSheet}
        setSheet={mockSetSheet}
        setSheetChoices={mockSetSheetChoices}
        setWb={mockSetWb}
      />
    );
    expect(getByText('Browse Files')).toBeInTheDocument();
  });

  it('does not render the file upload component when products array is not empty', () => {
    const { queryByText } = render(
      <UploadButton
        products={productsMock}
        setProducts={mockSetProducts}
        setChoosingSheet={mockSetChoosingSheet}
        setSheet={mockSetSheet}
        setSheetChoices={mockSetSheetChoices}
        setWb={mockSetWb}
      />
    );
    expect(queryByText('Browse Files')).not.toBeInTheDocument();
  });

  it('handles file upload for XLSX files', async () => {
    const component = renderer.create(
      <UploadButton
      products={[]}
      setProducts={mockSetProducts}
      setChoosingSheet={mockSetChoosingSheet}
      setSheet={mockSetSheet}
      setSheetChoices={mockSetSheetChoices}
      setWb={mockSetWb}
    />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it('handles file upload for CSV files', async () => {
  //   const { getByText } = render(
  //     <UploadButton
  //       products={[]}
  //       setProducts={mockSetProducts}
  //       setChoosingSheet={mockSetChoosingSheet}
  //       setSheet={mockSetSheet}
  //       setSheetChoices={mockSetSheetChoices}
  //       setWb={mockSetWb}
  //     />
  //   );

  //   const fileUpload = getByText('Browse Files').parentNode;
  //   fireEvent.change(fileUpload, { target: { files: [mockCSVFile] } });

  //   // Wait for any asynchronous operations
  //   await waitFor(() => {
  //     expect(mockSetProducts).toHaveBeenCalled();
  //     // Additional assertions
  //   });
  // });

  // multiple sheets in an Excel file, or other edge cases.
});

describe('Loader Component', () => {
  // Mock state update functions
  const mockSetLoading = jest.fn();
  
  it('Loader shows dialog element when loading', () =>{
    const { getByText } = render(
      <Loader
        loading={true}
        setLoading={mockSetLoading}
      />
    );

    expect(getByText('Generating Amazing Content...')).toBeInTheDocument();
  });

  it('Loader shows null when not loading', () =>{
    const { queryByText } = render(
      <Loader
        loading={false}
        setLoading={mockSetLoading}
      />
    );

    // Check that the text is not present in the document render
    expect(queryByText('Generating Amazing Content...')).not.toBeInTheDocument();
  });
})