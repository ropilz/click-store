import './App.css';
import {BrowserRouter} from 'react-router-dom';
import { AppRoutes } from './App.routes';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <div id="recaptcha"></div>
    </div>
  );
}

export default App;
