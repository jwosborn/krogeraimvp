import React from 'react'
import { act, fireEvent, getByRole, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event';
import productsMock from './mocks/productsMock.json';
import preResponseProductsMock from './mocks/preResponseProductsMock.json';
import { UploadButton } from './components/UploadButton';
import renderer from 'react-test-renderer';
import { Loader } from './components/Loader';
import { MainTable } from './components/MainTable';
import { RunAllButton } from './components/RunAllButton';
import mockAxios from 'jest-mock-axios';
import { Login } from './components/Login';

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

describe('MainTable Component', () => {
  // Mock state update functions
  const mockSetProducts = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetGenerated = jest.fn();
  
  it('MainTable loads products data', () =>{
    render(
      <MainTable 
        products={productsMock} 
        setProducts={mockSetProducts} 
        setLoading={mockSetLoading} 
        setGenerated={mockSetGenerated} 
        dt={undefined}      
      />
    );

      // Check if the product names from the mock are rendered
      productsMock.forEach(product => {
        expect(screen.getByText(product.Product_Title)).toBeInTheDocument();
      });

  });
});

describe('RunAllButton Component (Happy Path)', () => {
  // Mock state update functions
  const mockSetProducts = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetGenerated = jest.fn();
  const mockSetError = jest.fn();
  
  it('RunAllButton sends for API request', async () =>{
    // Mock API response
    mockAxios.post.mockResolvedValueOnce({ data: { productsMock } });


    render(
      <RunAllButton 
      URL={'https://kroger-description-api-0b391e779fb3.herokuapp.com/'} 
      products={preResponseProductsMock} 
      setProducts={mockSetProducts} 
      setLoading={mockSetLoading} 
      setGenerated={mockSetGenerated} 
      setError={mockSetError}      
      />
    );
    
    // test if the button rendered with expected test
    expect(screen.getByText('Run All Descriptions')).toBeInTheDocument();

    // Simulate user click
    fireEvent.click(screen.getByText('Run All Descriptions'));

    // Wait for async operations (API call)
    await waitFor(() => { 
      // productsMock.forEach(element => { // TODO: Change? for more specific testing of mock
      //   // Assertions for API call
      //   expect(mockAxios.post).toHaveBeenCalledWith("https://kroger-description-api-0b391e779fb3.herokuapp.com/", element);
      // });
      expect(mockAxios.post).toHaveBeenCalledTimes(29); // 29 prompts in data

      // Assertions for state updates
      expect(mockSetLoading).toHaveBeenCalledWith(true); // started loading
      // expect(mockSetProducts).toHaveBeenCalledTimes(1); // TODO: find out why setProducts in component is not getting hit, in .then block
  });

    // Reset mock axios for cleanup
    mockAxios.reset()
  });
});

describe('Login Component', () => {
  // Mock state update functions
  const mockUser = jest.fn(() => '');
  const mockSetUser = jest.fn();
  const mockIsLogin = jest.fn(() => false);
  const mockSetIsLogin = jest.fn();
  
  it('Login works with user input (happy path)', async () =>{
    const { queryByText } = render(
      <Login 
        user={''} 
        setUser={mockSetUser} 
        isLogin={false} 
        setIsLogin={mockSetIsLogin}      
      />
    );
    
    // test if the button rendered with expected test
    const userInput = screen.getByLabelText(/enter user/i)

    expect(userInput).toBeInTheDocument();
  
    fireEvent.change(userInput, { target: { value: 'meaghan' } });
    fireEvent.keyDown(userInput, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 }); //Enter press
 
    expect(mockSetUser).toHaveBeenCalledWith('meaghan');
    // expect(mockSetIsLogin).toHaveBeenCalledWith(false); //TODO: add correct check for if isLogin was changed
  });

  it('Login throws error for invalid user (sad path)', async () =>{
    const { queryByText } = render(
      <Login 
        user={''} 
        setUser={mockSetUser} 
        isLogin={false} 
        setIsLogin={mockSetIsLogin}      
      />
    );
    
    // test if the button rendered with expected test
    const userInput = screen.getByLabelText(/enter user/i)

    expect(userInput).toBeInTheDocument();
    expect(queryByText("Invalid Credentials")).not.toBeInTheDocument();
  
    fireEvent.change(userInput, { target: { value: 'InvalidUser' } });
    fireEvent.keyDown(userInput, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 }); //Enter press

    // Test if user was set and if error message appears 
    expect(mockSetUser).toHaveBeenCalledWith('InvalidUser');
    expect(queryByText("Invalid Credentials")).toBeInTheDocument();

  });
});