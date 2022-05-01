import { GoogleAuthProvider, signOut, Auth } from "firebase/auth";
import { useAuth, useSigninCheck } from "reactfire";
import {useNavigate} from 'react-router-dom';
import { useEffect } from "react";



const signOutUser = async function (auth: Auth) {
  await signOut(auth);
}

const LoggingOut = () => <div>Logging Out ...</div>;

function Logout() {
//   const { status, data:signInCheckResult } = useSigninCheck();
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    signOutUser(auth)
      .then(() => navigate('/login'))
      .catch(error => console.log('Error Logging out', error));
  });

  return <LoggingOut />;
}

export default Logout;
