import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'

import { Provider } from 'react-redux';
import store from './Redux/store.jsx';

const rootElement = document.getElementById('root');
rootElement.className = "w-full h-screen bg-purple-600";

createRoot(rootElement).render(
  <StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </StrictMode>,
)
