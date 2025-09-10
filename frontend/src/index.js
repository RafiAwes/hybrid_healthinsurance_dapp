import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3Provider } from './context/Web3Context';
import './index.css'; // optional, if using Tailwind

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Web3Provider>
    <App />
  </Web3Provider>
);



