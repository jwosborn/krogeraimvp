import { useAuth0 } from '@auth0/auth0-react';
import AuthenticationButton from '../Auth/AuthenticationButton';
import '../Auth/authStuff.css'

export const NewLogin = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='Authcontainer'>
      <AuthenticationButton />
    </div>
  );
}