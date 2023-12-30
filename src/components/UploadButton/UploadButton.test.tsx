import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import productsMock from '../../mocks/productsMock.json';
import { UploadButton } from '../../components/UploadButton/UploadButton';
import renderer from 'react-test-renderer';

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
  });