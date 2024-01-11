import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { DropdownSelect } from './DropdownSelect';
import * as xlsx from 'xlsx';

jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

const mockData = [
  [
    1,
    1,
    "Kroger® Beer Battered Shrimp 24 oz",
    "Kroger® Beer Battered Shrimp",
    "00011110900234",
    "Kroger",
    null,
    "Beer Battered",
    null,
    "Shrimp",
    null,
    null,
    "11 g protein per serving.\r\r\nSee nutritional information for cholesterol and sodium content.\r\r\nContains a bioengineered food ingredient.\r\r\nWhere awesome meets affordable. Why choose between great taste and great price when you can have both? Kroger Brand products are made to exceed your expectations while fitting your budget.",
    null,
    "Shrimp, Wheat Flour, Beer (Water, Hops, Rice, Malted Barley, Corn), Soybean Oil, Baking Powder (Sodium Aluminum Phosphate, Sodium Bicarbonate), Salt, Sugar, Palm Oil, Paprika Extract (for Color), Turmeric Extract (for Color) Whey, Sodium Tripolyphosphate.",
    "Made with rich lager beer.",
    "shrimp",
    "You are a world class marketing copywriter. Using 65 words or less, write a product description for a shrimp product. The product is Kroger® Beer Battered Shrimp. The target consumer is practical. Do not use words above a 8th grade education level. Use 65 words or less. Do not use an introductory sentence, but include the product name in the first sentence. Begin the first sentence with the product name. Do not embellish. Use national brand and other retailer private label product descriptions as reference. Mention suggestions for serving at occasions when possible. Use 4 sentences, the first sentence must begin with the product name. Do not mention ingredients not listed here: Shrimp, Wheat Flour, Beer (Water, Hops, Rice, Malted Barley, Corn), Soybean Oil, Baking Powder (Sodium Aluminum Phosphate, Sodium Bicarbonate), Salt, Sugar, Palm Oil, Paprika Extract (for Color), Turmeric Extract (for Color) Whey, Sodium Tripolyphosphate. Use this marketing message for reference: 11 g protein per serving.\r\r\nSee nutritional information for cholesterol and sodium content.\r\r\nContains a bioengineered food ingredient.\r\r\nWhere awesome meets affordable. Why choose between great taste and great price when you can have both? Kroger Brand products are made to exceed your expectations while fitting your budget.",
    "Give me five succinct bullet points (no more than 12 words per bullet point) for Kroger® Beer Battered Shrimp. Use this info for writing the bullets: 11 g protein per serving.\r\r\nSee nutritional information for cholesterol and sodium content.\r\r\nContains a bioengineered food ingredient.\r\r\nWhere awesome meets affordable. Why choose between great taste and great price when you can have both? Kroger Brand products are made to exceed your expectations while fitting your budget. Made with rich lager beer.. Don't mention any ingredients not mentioned here: Shrimp, Wheat Flour, Beer (Water, Hops, Rice, Malted Barley, Corn), Soybean Oil, Baking Powder (Sodium Aluminum Phosphate, Sodium Bicarbonate), Salt, Sugar, Palm Oil, Paprika Extract (for Color), Turmeric Extract (for Color) Whey, Sodium Tripolyphosphate."
  ], []
]

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
      SheetNames: ['Sheet1', 'Sheet2'],
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

      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
  
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