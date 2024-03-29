import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import productsMock from '../../mocks/productsMock.json';
import preResponseProductsMock from '../../mocks/preResponseProductsMock.json';
import { RunAllButton } from '../../components/RunAllButton/RunAllButton';
import mockAxios from 'jest-mock-axios';
import { generateDescriptions, handleAIRequest } from './RunAllButtonFuncs';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('RunAllButton Component', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });  

    // Mock state update functions
    const mockSetProducts = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetGenerated = jest.fn();
    const mockSetError = jest.fn();
    
    it('RunAllButton renders and sends for API request', async () =>{
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
      
      // test for button render
      expect(screen.getByText('Run All Descriptions')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Run All Descriptions'));
  
      // Assertions
      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledTimes(29); // 29 prompts in data
        expect(mockSetLoading).toHaveBeenCalledWith(true); // started loading
    });
  
      // Reset mock axios for cleanup
      mockAxios.reset()
    });
  });

describe('RunAllButtonFuncs function tests', () =>{
  afterEach(() => {
    jest.clearAllMocks();
  });  

  beforeEach(() => {
    // Reset mock functions before each test
    mockSetLoading.mockClear();
    mockSetProducts.mockClear();
    mockSetGenerated.mockClear();
    mockSetError.mockClear();
    (axios.post as jest.Mock).mockClear();

    // Mock axios.post (assuming it's used in handleAIRequest)
    (axios.post as jest.Mock)
      .mockResolvedValueOnce({ data: [{ message: { content: 'Mock Test Description' } }] })
      .mockResolvedValueOnce({ data: [{ message: { content: 'Mock Test Bullets' } }] });

  });

  // Mock state update functions
  const mockSetProducts = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetGenerated = jest.fn();
  const mockSetError = jest.fn();
  const mockIndex = 0;
  const mockURL = '';


  it('generateDescriptions function creates descriptions', async () => {
    generateDescriptions([productsMock[0]], mockSetLoading, mockSetProducts, mockURL, mockSetGenerated, mockSetError);

    // Assertions
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetProducts).toHaveBeenCalled();
      expect(mockSetGenerated).toHaveBeenCalledWith(true);
    })
  })

  it('handleAIRequest returns with expected data', async () => {
    // Setup mock parameters
    const singleProductMock = productsMock[0]
    const mockIndex = 0;
    const mockURL = 'http://mockForTesturl.com';
    const mockSetError = jest.fn();

    // Call the function and await its result
    const result = await handleAIRequest(singleProductMock, mockIndex, mockURL, mockSetLoading, mockSetError);

    // Assertions
    expect(result).toEqual({
      index: mockIndex,
      description: 'Mock Test Description',
      bullets: 'Mock Test Bullets',
    });

    // Restore original implementation if needed
    jest.restoreAllMocks();
  });
});

describe("Failure Scenarios", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });  

  beforeEach(() => {
    // Reset mock functions before each test
    mockSetLoading.mockClear();
    mockSetError.mockClear();
    (axios.post as jest.Mock).mockClear();

    // Mock axios.post to throw an error
    (axios.post as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'));
  });

  // Mock state update functions
  const mockSetLoading = jest.fn();
  const mockSetError = jest.fn();

  it('handleAIRequest returns with ERROR', async () => {
    // Setup mock parameters
    const singleProductMock = productsMock[0]
    const mockIndex = 0;
    const mockURL = 'http://mockForTesturl.com';

    try {
      // Call the function and await its result
      await handleAIRequest(singleProductMock, mockIndex, mockURL, mockSetLoading, mockSetError);
  
    } catch (error) {
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetError).toHaveBeenCalledWith(true);
    }

    jest.restoreAllMocks();
  });

})