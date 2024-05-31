import * as React from 'react';

const logo = require('../../assets/Kroger Logo Vector_White.png');
const Header = () => {
    return (
        <div style={{ background: '#084999', color: 'white' }} className="font-kroger p-4">
            <img className="max-h-7rem" src={logo} alt="Kroger Logo" />
        </div>
    );
}
 
export default Header;