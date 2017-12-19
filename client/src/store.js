import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createLogger} from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from './reducers';

const middleware = applyMiddleware(promiseMiddleware(), createLogger({
  predicate: (getState, action) => action.type !== 'PAGE_SCROLLED'
}));

export default createStore(rootReducer, composeWithDevTools(middleware));
