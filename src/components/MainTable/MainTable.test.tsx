import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import productsMock from '../../mocks/productsMock.json';
import MainTable from '../../components/MainTable/MainTable';
import axios from 'axios';

jest.mock('axios')

describe('MainTable Component', () => {
    // Mock state update functions
    const mockSetProducts = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetGenerated = jest.fn();
    
    it('MainTable loads products data', () => {
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

    it('generateDescription works on button click', async () => {
      let { getByTestId } = render(
        <MainTable 
          products={[productsMock[0]]} 
          setProducts={mockSetProducts} 
          setLoading={mockSetLoading} 
          setGenerated={mockSetGenerated} 
          dt={undefined}      
        />
      );

      const firstGenerateButton = getByTestId('generateButton0')
      expect(firstGenerateButton).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(firstGenerateButton);
    
        // asynchronous delay if needed
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true);
        // expect(mockSetProducts).toHaveBeenCalled(); //TODO: SetProducts not getting called in mock
      })
    });

    it('EditCellComplete Function', async () => {
      let { queryByText } = render(
        <MainTable 
          products={[productsMock[0]]} 
          setProducts={mockSetProducts} 
          setLoading={mockSetLoading} 
          setGenerated={mockSetGenerated} 
          dt={undefined}      
        />
      );

      let cell = queryByText('Kroger® Beer Battered Shrimp 24 oz')

      expect(cell).toBeInTheDocument();
      fireEvent.click(cell);
      fireEvent.keyDown(cell, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 }); //Enter press
      // Wait for the asynchronous code to complete
      await Promise.resolve();

      await waitFor(() => {
        // Assertions 
        expect(mockSetProducts).toHaveBeenCalled();
        expect(mockSetLoading).toHaveBeenCalled();
      });
    });
  });