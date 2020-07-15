import { Middleware } from 'redux';
import { UserAction } from './userActions';
import { AppState } from 'src/types/state';
import { navigateAction } from 'src/modules/Navigation/reducers/navigationActions';

const changeRouteOnLogout: Middleware<
  {},
  AppState
> = store => next => (action) => {
  if (
    [UserAction.LOGOUT_SUCCESS, UserAction.RESTORE_SESSION_FAILURE].includes(
      action.type,
    )
  ) {
    store.dispatch(navigateAction('Welcome'));
  }

  next(action);
};

const changeRouteOnAuth: Middleware<{}, AppState> = store => next => (action) => {
  if (
    [
      UserAction.LOGIN_SUCCESS,
      UserAction.RESTORE_SESSION_SUCCESS,
      UserAction.REGISTER_SUCCESS,
    ].includes(action.type)
  ) {
    store.dispatch(navigateAction('Home'));
  }

  next(action);
};

export const userMiddleware = [changeRouteOnAuth, changeRouteOnLogout];
