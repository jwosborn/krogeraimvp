import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { Login } from '../../components/Login/Login';

describe('Login Component', () => {
    // Mock state update functions
    const mockUser = 'meaghan';
    const mockSetUser = jest.fn();
    const mockSetIsLogin = jest.fn();
    
    it('Login works with user input (happy path)', async () =>{
      render(
        <Login 
          user={mockUser}
          setUser={mockSetUser} 
          isLogin={false} 
          setIsLogin={mockSetIsLogin}      
        />
      );
      
      // test if the button rendered with expected test
      const userInput = screen.getByLabelText(/enter user/i)
  
      expect(userInput).toBeInTheDocument();
    
      fireEvent.change(userInput, { target: { value: 'meaghan' } });
      fireEvent.keyDown(userInput, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 }); //Enter press
  
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalled();
        expect(mockSetIsLogin).toHaveBeenCalledWith(true);
      })
    });
  
    it('Login throws error for invalid user (sad path)', async () =>{
      const { queryByText } = render(
        <Login 
          user={''} 
          setUser={mockSetUser} 
          isLogin={false} 
          setIsLogin={mockSetIsLogin}      
        />
      );
      
      // test if the button rendered with expected test
      const userInput = screen.getByLabelText(/enter user/i)
  
      expect(userInput).toBeInTheDocument();
      expect(queryByText("Invalid Credentials")).not.toBeInTheDocument();
    
      fireEvent.change(userInput, { target: { value: 'InvalidUser' } });
      fireEvent.keyDown(userInput, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 }); //Enter press
  
      // Test if user was set and if error message appears 
      expect(mockSetUser).toHaveBeenCalledWith('InvalidUser');
      expect(queryByText("Invalid Credentials")).toBeInTheDocument();
  
    });
  });