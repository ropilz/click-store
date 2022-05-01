import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useSigninCheck } from 'reactfire';
const LoginPage = lazy(() => import ('./page/Login/Login'));
const LogoutPage = lazy(() => import ('./page/Logout/Logout'));
const NotFoundPage = lazy(() => import ('./page/NotFound/NotFound'));
const MainPage = lazy(() => import ('./page/Main/Main'));

function WithAuth({children}: React.PropsWithChildren<{}>) {
  const { status, data:signInCheckResult } = useSigninCheck();
  if (status === 'loading') { return <div>LOADING</div>; }
  if (!signInCheckResult.signedIn) { return <LoginPage />; }
  return <>{children}</>;
}



export function AppRoutes () {
  return (
    <Suspense fallback={<span>loading page</span>}>
      <Routes>
      <Route path='/' element={<WithAuth><MainPage /></WithAuth> } />
        <Route path='/login' element={<LoginPage /> } />
        <Route path='/logout' element={<LogoutPage /> } />
        <Route path='*' element={<NotFoundPage /> } />
      </Routes>
    </Suspense>
  );
}
