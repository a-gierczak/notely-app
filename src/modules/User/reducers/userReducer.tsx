import { ValidationError, Token } from 'src/types/common';
import { Reducer } from 'redux';
import * as userActions from './userActions';
import { ActionType } from 'typesafe-actions';

export interface UserState {
  token: Token | null;
  errors?: ValidationError[];
}

const initialState: UserState = {
  token: null,
};

const reducer: Reducer<UserState> = (
  state = initialState,
  action: ActionType<typeof userActions>,
) => {
  switch (action.type) {
    case userActions.UserAction.REGISTER:
    case userActions.UserAction.LOGIN:
      return { ...state, errors: undefined };

    case userActions.UserAction.RESTORE_SESSION_SUCCESS:
    case userActions.UserAction.LOGIN_SUCCESS:
    case userActions.UserAction.REGISTER_SUCCESS:
      return { ...state, token: action.payload, errors: undefined };

    case userActions.UserAction.LOGOUT_SUCCESS:
      return { ...state, token: null, errors: undefined };

    case userActions.UserAction.LOGIN_FAILURE:
    case userActions.UserAction.REGISTER_FAILURE:
      return { ...state, errors: action.payload };

    default:
      return state;
  }
};

export { reducer as userReducer };
