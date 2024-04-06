import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import "./authStuff.css"

const AuthenticationButton = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect, loginWithPopup, logout } = useAuth0();

    return isAuthenticated ? (<>
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
