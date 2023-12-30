import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import productsMock from '../../mocks/productsMock.json';
import preResponseProductsMock from '../../mocks/preResponseProductsMock.json';
import { RunAllButton } from '../../components/RunAllButton/RunAllButton';
import mockAxios from 'jest-mock-axios';

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