import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import productsMock from '../../mocks/productsMock.json';
import { MainTable } from '../../components/MainTable/MainTable';

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