// import { withAuthenticationRequired } from "@auth0/auth0-react";
// import React from "react";
// // import { PageLoader } from "@oom/page-loader";

// export const AuthenticationGuard = ({ component }) => {
//   const Component = withAuthenticationRequired(component, {
//     onRedirecting: () => (
//       <div className="page-layout">
//         <p>Loading...</p>
//       </div>
//     ),
//   });

//   return <Component />;
// };

import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export const AuthenticationGuard = ({ component }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? component : <Navigate to="/login" />;
}