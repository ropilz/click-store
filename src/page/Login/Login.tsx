import { GoogleAuthProvider, Auth, signInWithPopup } from "firebase/auth";
import { useAuth, useSigninCheck } from "reactfire";
import {useNavigate} from 'react-router-dom';
import { getAuth, PhoneAuthProvider, updatePhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Button, Typography } from "@mui/material";
import { once } from 'lodash';


const signIn = async function (auth: Auth) {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

const Loading = () => <>
  <div>LOADING</div>
</>;
const Redirect = () => <>
  <div>Redirecting ...</div>
</>;

const LoginForm: React.FC<{auth: Auth}> = ({auth}) => 
  <div>
    <Typography variant="h3" component="div" gutterBottom>
      Login Page
    </Typography>
    <Button variant="contained" onClick={() => signIn(auth)}>Sign in with Google</Button>
  </div>;



function Login() {
  const { status, data:signInCheckResult } = useSigninCheck();
  const navigate = useNavigate();
  const auth = useAuth();
  if (status === 'loading') { return <Loading />; }
  if (signInCheckResult.signedIn && auth.currentUser) {
    console.log('Mira esto LeNy.', auth.currentUser.phoneNumber);
    // if (!auth.currentUser.phoneNumber) {
    //   setTimeout(() => updateUserPhone(), 1000);
    // }
    setTimeout(() => navigate('/'), 100)
    console.log(auth.currentUser);
    return <Redirect />;
  }
  return <LoginForm auth={auth} />;
}

// login user using phone number

const updateUserPhone = once(async function () {
  console.log('UPDATE');
  const auth = getAuth();
  const provider = new PhoneAuthProvider(auth);
  const verifier = new RecaptchaVerifier('recaptcha', {'size': 'invisible'}, auth);
  console.log('TEsttt');
  const phoneNumber = window.prompt('Enter your phone number');
  if (!phoneNumber) { return; }
  const verificationId = await provider.verifyPhoneNumber({ phoneNumber }, verifier);
  const verificationCode = window.prompt('Enter the verification');
  const credential = PhoneAuthProvider.credential(verificationId, verificationCode!);
  await updatePhoneNumber(auth.currentUser!, credential);
});

export default Login;
