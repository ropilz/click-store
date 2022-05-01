import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider, FirebaseAppProvider, useFirebaseApp } from 'reactfire';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBFZvPLdnHIyagpxbplUQw5Onzyk4mFws8",
  authDomain: "tiendas-click.firebaseapp.com",
  projectId: "tiendas-click",
  storageBucket: "tiendas-click.appspot.com",
  messagingSenderId: "463347093510",
  appId: "1:463347093510:web:13b763be3d7a59db7f7387",
  measurementId: "G-BHB1KLK44K"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
        <App />
      </AuthProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
