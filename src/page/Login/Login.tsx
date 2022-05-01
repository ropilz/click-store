import { GoogleAuthProvider, Auth, signInWithPopup } from "firebase/auth";
import { useAuth, useSigninCheck } from "reactfire";
import {useNavigate} from 'react-router-dom';
import { getAuth, PhoneAuthProvider, updatePhoneNumber, RecaptchaVerifier } from "firebase/auth";



const signIn = async function (auth: Auth) {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

const Loading = () => <>
  <div>LOADING</div>
  <div id="recaptcha"></div>
</>;
const Redirect = () => <div>Redirecting ...</div>;

const LoginForm: React.FC<{auth: Auth}> = ({auth}) => 
  <div>
    <h1>Login Page</h1>
    <button onClick={() => signIn(auth)}> Sign in with Google</button>
    <div id="abc">Redirecting ...</div>
  </div>;



function Login() {
  const { status, data:signInCheckResult } = useSigninCheck();
  const navigate = useNavigate();
  const auth = useAuth();
  if (status === 'loading') { return <Loading />; }
  if (signInCheckResult.signedIn && auth.currentUser) {
    if (!auth.currentUser.phoneNumber) {
      updateUserPhone()
        .then(() => setTimeout(() => navigate('/'), 100))
        .catch((err) => console.log(err));
    }
    setTimeout(() => navigate('/'), 100)
    console.log(auth.currentUser);
    return <Redirect />;
  }
  return <LoginForm auth={auth} />;
}

// login user using phone number
async function updateUserPhone () {
  const auth = getAuth();
  const provider = new PhoneAuthProvider(auth);
  const verifier = new RecaptchaVerifier('recaptcha', {'size': 'invisible'}, auth);
  const phoneNumber = window.prompt('Enter your phone number');
  if (!phoneNumber) { return; }
  const verificationId = await provider.verifyPhoneNumber({ phoneNumber }, verifier);
  const verificationCode = window.prompt('Enter the verification');
  const credential = PhoneAuthProvider.credential(verificationId, verificationCode!);
  await updatePhoneNumber(auth.currentUser!, credential);
}

export default Login;
