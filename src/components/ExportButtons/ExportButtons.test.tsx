import { fireEvent, render, waitFor } from "@testing-library/react";
import productsMock from '../../mocks/productsMock.json';
import * as xlsx from 'xlsx';
import { ExportButtons } from "./ExportButtons";
  
// Mock 'file-saver' saveAs function
jest.mock('file-saver', () => ({
saveAs: jest.fn(),
}));

// Mocking the 'xlsx' module
jest.mock('xlsx', () => ({
...jest.requireActual('xlsx'),
utils: {
    json_to_sheet: jest.fn(),
},
write: jest.fn(),
}));


describe('ExportButtons Component', () => {
  

    const mockGenerated = true;
  
  
    it('Export to xlxs', async () => {  
      const { getByTestId } = render(
        <ExportButtons
          products={productsMock}
          generated={mockGenerated}
          dt={undefined}
        />
      );
  
      const exportButtons = getByTestId('Export-Excel');
  
      fireEvent.click(exportButtons);
  
      // Wait for the asynchronous code to complete
      await Promise.resolve();
  
      await waitFor(() => {
        // Assertions 
        expect(xlsx.utils.json_to_sheet).toHaveBeenCalledWith(productsMock);
        expect(xlsx.write).toHaveBeenCalledWith(
          { Sheets: { data: xlsx.utils.json_to_sheet(productsMock) }, SheetNames: ['data'] },
          { bookType: 'xlsx', type: 'array' }
        );
      })
    });
  });