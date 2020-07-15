import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { userMiddleware } from 'src/modules/User/reducers/userMiddleware';

import { rootReducer } from './reducer';

const getMiddleware = () => applyMiddleware(
  createLogger(),
  createReactNavigationReduxMiddleware(state => state.nav),
  thunk,

  ...userMiddleware,
);

export const store = createStore(
  rootReducer, composeWithDevTools(getMiddleware()),
);
