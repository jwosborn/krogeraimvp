import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import { Loader } from '../../components/Loader/Loader';

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
});