import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { PatientProvider } from './context/PatientContext.jsx';
import { CaregiverProvider } from './context/CaregiverContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PatientProvider>
        <CaregiverProvider>
          <App />
        </CaregiverProvider>
      </PatientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
