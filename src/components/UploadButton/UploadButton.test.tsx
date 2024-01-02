// fileUtils.test.ts
import * as xlsx from 'xlsx';
import '@testing-library/jest-dom'
import {
  generateTableData,
  handleCSVUpload,
  handleXLSXUpload,
  setSheetInState,
  handleImport,
} from './UploadButtonFuncs';
import { CSVToArray } from '../../utils/format.js'
import { UploadButton } from './UploadButton';
import { fireEvent, render, screen } from '@testing-library/react';
import productsMock from '../../mocks/productsMock.json';

// Mocks
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));
jest.mock('../../utils/format', () => ({
  CSVToArray: jest.fn()
}));

// Helper function to mock FileReader
const mockFileReader = () => {
  const originalFileReader = (global as any).FileReader;
  function FileReaderMock() {
    this.onload = null;
    this.readAsBinaryString = jest.fn((file) => {
      this.onload({ target: { result: 'file content' } });
    });
    this.readAsArrayBuffer = jest.fn((file) => {
      this.onload({ target: { result: new ArrayBuffer(10) } });
    });
  }
  (global as any).FileReader = FileReaderMock;
  return () => {
    (global as any).FileReader = originalFileReader;
  };
};

describe('UploadButtonFuncs', () => {
  let restoreFileReader: () => void;

  beforeEach(() => {
    restoreFileReader = mockFileReader();
    (xlsx.read as jest.Mock).mockClear();
    (xlsx.utils.sheet_to_json as jest.Mock).mockClear();
    (CSVToArray as jest.Mock).mockClear();
  });

  afterEach(() => {
    restoreFileReader();
  });

  it('generateTableData', () => {
    const testData = [['header1', 'header2'], ['value1', 'value2']];
    const result = generateTableData(testData);
    expect(result).toEqual([{ header1: 'value1', header2: 'value2' }]);
  });

  it('handleXLSXUpload multiple sheets', async () => {
    const setWbMock = jest.fn();
    const setChoosingSheetMock = jest.fn();
    const setSheetMock = jest.fn();
    const setSheetChoicesMock = jest.fn();
    const setSheetInStateMock = jest.fn();

    const xlsxReadMock = jest.spyOn(xlsx, 'read').mockReturnValue({
      SheetNames: ['UPLOAD', 'UPLOAD2'],
      Sheets: { UPLOAD: {}, UPLOAD2: {} },
    });

    const eventMock = {
      files: [new File(['XLSX Content'], 'file.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })],
    };

    await handleXLSXUpload(
      eventMock,
      setWbMock,
      setChoosingSheetMock,
      setSheetMock,
      setSheetChoicesMock,
      setSheetInStateMock
    );

    expect(setWbMock).toHaveBeenCalledWith(expect.objectContaining({
      SheetNames: ['UPLOAD', 'UPLOAD2'],
      Sheets: { UPLOAD: {}, UPLOAD2: {} },
    }));

    expect(setChoosingSheetMock).toHaveBeenCalledWith(true);
    expect(setSheetMock).toHaveBeenCalledWith('');
    expect(setSheetChoicesMock).toHaveBeenCalledWith(['UPLOAD', 'UPLOAD2']);
    xlsxReadMock.mockRestore();
  });

  it('handleXLSXUpload single sheet', async () => {
    const setWbMock = jest.fn();
    const setChoosingSheetMock = jest.fn();
    const setSheetMock = jest.fn();
    const setSheetChoicesMock = jest.fn();
    const setSheetInStateMock = jest.fn();

    const xlsxReadMock = jest.spyOn(xlsx, 'read').mockReturnValue({
      SheetNames: ['UPLOAD'],
      Sheets: { UPLOAD: {}},
    });

    const eventMock = {
      files: [new File(['XLSX Content'], 'file.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })],
    };

    await handleXLSXUpload(
      eventMock,
      setWbMock,
      setChoosingSheetMock,
      setSheetMock,
      setSheetChoicesMock,
      setSheetInStateMock
    );

    expect(setWbMock).toHaveBeenCalledWith(expect.objectContaining({
      SheetNames: ['UPLOAD'],
      Sheets: { UPLOAD: {} },
    }));

    expect(setSheetInStateMock).toHaveBeenCalledWith(xlsx, expect.objectContaining({}));
    xlsxReadMock.mockRestore();
  });

  it('setSheetInState', () => {
    // Mock data returned by sheet_to_json
    const mockData = [
      ['DescPrompt', 'BulletPrompt'],
      ['exampleDesc1', 'exampleBullet1'],
      ['exampleDesc2', 'exampleBullet2']
    ];
    (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const setProductsMock = jest.fn();
    const wsMock = {};
    setSheetInState(xlsx, wsMock, setProductsMock);

    expect(setProductsMock).toHaveBeenCalledWith([{"BulletPrompt": "exampleBullet1", "DescPrompt": "exampleDesc1"}, {"BulletPrompt": "exampleBullet2", "DescPrompt": "exampleDesc2"}]);
    
    // Restore mocks
    jest.restoreAllMocks();
  });

  it('handleImport with XLSX file', async () => {
    const setProductsMock = jest.fn(() => null);
    const setWbMock = jest.fn();
    const setChoosingSheetMock = jest.fn();
    const setSheetMock = jest.fn();
    const setSheetChoicesMock = jest.fn();

    const xlsxReadMock = jest.spyOn(xlsx, 'read').mockReturnValue({
      SheetNames: ['UPLOAD', 'UPLOAD2'],
      Sheets: { UPLOAD: {}, UPLOAD2: {} },
    });

    const eventMock = {
      files: [new File(['XLSX Content'], 'file.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })],
    };

    await handleImport(eventMock, setProductsMock, setWbMock, setChoosingSheetMock, setSheetMock, setSheetChoicesMock);

    expect(setProductsMock).not.toHaveBeenCalled();
    expect(setWbMock).toHaveBeenCalledWith(expect.objectContaining({
      SheetNames: ['UPLOAD', 'UPLOAD2'],
      Sheets: { UPLOAD: {}, UPLOAD2: {} },
    }));
    expect(setChoosingSheetMock).toHaveBeenCalledWith(true);
    expect(setSheetMock).toHaveBeenCalledWith('');
    expect(setSheetChoicesMock).toHaveBeenCalledWith(['UPLOAD', 'UPLOAD2']);
    xlsxReadMock.mockRestore();
  });
});

describe('UploadButton Component', () => {
  // Mock state update functions
  const mockSetProducts = jest.fn();
  const mockSetChoosingSheet = jest.fn();
  const mockSetSheet = jest.fn();
  const mockSetSheetChoices = jest.fn();
  const mockSetWb = jest.fn();

  const file = new File([new ArrayBuffer(1)], 'file.jpg');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock files for upload
  const mockXLSXFile = new File([''], 'example.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const mockCSVFile = new File(['Header1,Header2\nRow1Data1,Row1Data2'], 'example.csv', { type: 'text/csv' });

  it('renders the file upload component when products array is empty', () => {
    render(
      <UploadButton
        products={[]}
        setProducts={mockSetProducts}
        setChoosingSheet={mockSetChoosingSheet}
        setSheet={mockSetSheet}
        setSheetChoices={mockSetSheetChoices}
        setWb={mockSetWb}
      />
    );
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
  });

  it('does not render the file upload component when products array is not empty', () => {
    render(
      <UploadButton
        products={productsMock}
        setProducts={mockSetProducts}
        setChoosingSheet={mockSetChoosingSheet}
        setSheet={mockSetSheet}
        setSheetChoices={mockSetSheetChoices}
        setWb={mockSetWb}
      />
    );
    expect(screen.queryByText('Browse Files')).not.toBeInTheDocument();
  });
});
