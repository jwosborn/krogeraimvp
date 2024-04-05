import * as React from 'react';

const logo = require('../../assets/kroger-logo.png');
const Header = () => {
    return ( <div className="font-main">
                    <img className="max-h-10rem" src={logo} alt="Kroger Logo" />
                    <h3>This is only a demo and is not functional.</h3>
    </div> );
}
 
export default Header;