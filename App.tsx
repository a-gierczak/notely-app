import 'utils/debug';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { createReduxContainer } from 'react-navigation-redux-helpers';
import { store } from 'src/store';
import { AppNavigator } from 'Navigation/AppNavigator';
import { ApiConnector } from 'Bootstrap/ApiConnector';
import { AppState } from 'src/types/state';
import { BackButtonHandler } from 'Navigation/BackButtonHandler';
import {
  registerLogoutInterceptor,
  registerBackendErrorHandler,
} from 'src/api';
import { UserAction } from 'src/modules/User/reducers/userActions';
import { AlertContainer } from 'src/modules/Alert/AlertContainer';

registerLogoutInterceptor(store, UserAction.LOGOUT_SUCCESS);
registerBackendErrorHandler(store);

const mapStateToProps = (state: AppState) => ({
  state: state.navigation,
});

const Navigator = connect(mapStateToProps)(
  createReduxContainer(AppNavigator),
);

const Root = () => (
  <Provider store={store}>
    <BackButtonHandler>
      <ApiConnector>
        <Navigator />
        <AlertContainer />
      </ApiConnector>
    </BackButtonHandler>
  </Provider>
);

// tslint:disable-next-line: no-default-export
export default Root;
