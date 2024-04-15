import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import "./authStuff.css"
import useAuth from '../../hooks/useAuth';

const AuthenticationButton = () => {
    const auth  = useAuth();
    const navigate = useNavigate();
    const temp = useAuth0();
    const { isAuthenticated, loginWithRedirect, loginWithPopup, logout, user } = useAuth0();

    return isAuthenticated ? (<>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {console.log(temp)}
            <button className="Authbutton" onClick={() => logout()}>
                Log Out
            </button>
            <button className="Authbutton"onClick={() => navigate("/krogeraimvp")}>
                Description-generator
            </button>
            <button className="Authbutton" onClick={() => navigate("/kroger-intake-form")}>
                Intake-form
            </button>
            <button className="Authbutton" onClick={() => navigate("/kroger-image-upload")}>
                Image-upload
            </button>
        </>
    ) : (
        <button className="Authbutton" onClick={() => loginWithPopup()}>Log In popup</button>
    );
};

export default AuthenticationButton;
