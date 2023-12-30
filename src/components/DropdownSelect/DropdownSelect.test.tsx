import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { DropdownSelect } from './DropdownSelect';

describe('DropdownSelect Component', () => {
    // Mock state update functions
    const mockWb = {
      Sheets: {
        Sheet1: {
          A1: { v: 'Header1' },
          A2: { v: 'Value1' },
        },
        Sheet2: {
          A1: { v: 'Header2' },
          A2: { v: 'Value2' },
        },
      },
      SheetNames: ['Sheet1', 'Sheet2', /* other sheet names */],
    };
    
    const mockSheet = 'Sheet1';
    const mockSetSheet = jest.fn();
    const mockSetChoosingSheet = jest.fn();
    const mockSetProducts = jest.fn();
    const mockSheetChoices = [{ label: 'Sheet1', value: 'Sheet1' }, { label: 'Sheet2', value: 'Sheet2'}];
    
    it('Selecting workbook sheet updates state', async () =>{
      const { getByTestId } = render(
        <DropdownSelect 
          wb={mockWb} 
          sheet={mockSheet} 
          setSheet={mockSetSheet} 
          setChoosingSheet={mockSetChoosingSheet} 
          setProducts={mockSetProducts} 
          sheetChoices={mockSheetChoices}      
        />
      );
  
      const dropdownSelect = getByTestId('DropdownSelect');
  
      fireEvent.click(dropdownSelect);
      fireEvent.click(screen.getByText('Sheet2'));
  
      await waitFor(() => {
        // Assertions
        expect(mockSetSheet).toHaveBeenCalledWith('Sheet2');
        expect(mockSetChoosingSheet).toHaveBeenCalledWith(false);
        expect(mockSetProducts).toHaveBeenCalled(); 
      })
    });
  });