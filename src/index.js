import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { socketSend } from './store/middleware'

import './index.css';
import App from './App';
import reducer from './store/reducers/inputData';
import * as serviceWorker from './serviceWorker';

const store = createStore(
  reducer,
  applyMiddleware(socketSend)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


//PREVENT TOUCH SCROLLING / PINCH ZOOM / DOUBLE TAP ZOOM
function preventDefault(e){
  e.preventDefault();
}
document.body.addEventListener('touchmove', preventDefault, {passive: false});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
