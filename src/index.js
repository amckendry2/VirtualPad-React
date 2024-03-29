import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import { socketMiddleware } from './websockets/middleware'

import './index.css';
import App from './App';
import inputReducer from './store/reducers/input';
import connectionReducer from './store/reducers/connection';
import * as serviceWorker from './serviceWorker';

const rootReducer = combineReducers({
  input: inputReducer,
  connection: connectionReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk, socketMiddleware)
));

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
