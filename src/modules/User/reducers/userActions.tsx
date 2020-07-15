import R from 'ramda';
import { api, getTokenFromStorage, destroyToken, registerToken } from 'src/api';
import {
  createAsyncAction,
  ActionType,
  createStandardAction,
} from 'typesafe-actions';
import { Token, ValidationError, User } from 'src/types/common';
import { ThunkDispatch } from 'redux-thunk';
import { NetInfo } from 'react-native';

export enum UserAction {
  INIT_TOKEN_FROM_STORAGE = 'user/INIT_TOKEN_FROM_STORAGE',
  LOGIN = 'user/LOGIN',
  LOGIN_SUCCESS = 'user/LOGIN_SUCCESS',
  LOGIN_FAILURE = 'user/LOGIN_FAILURE',
  LOGOUT = 'user/LOGOUT',
  LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'user/LOGOUT_FAILURE',
  RESTORE_SESSION = 'user/RESTORE_SESSION',
  RESTORE_SESSION_SUCCESS = 'user/RESTORE_SESSION_SUCCESS',
  RESTORE_SESSION_FAILURE = 'user/RESTORE_SESSION_FAILURE',
  REGISTER = 'user/REGISTER',
  REGISTER_SUCCESS = 'user/REGISTER_SUCCESS',
  REGISTER_FAILURE = 'user/REGISTER_FAILURE',
}

export const initTokenAction = createStandardAction(
  UserAction.INIT_TOKEN_FROM_STORAGE,
)<Token>();

export const restoreSessionAction = createAsyncAction(
  UserAction.RESTORE_SESSION,
  UserAction.RESTORE_SESSION_SUCCESS,
  UserAction.RESTORE_SESSION_FAILURE,
)<undefined, Token, void>();

export const restoreSession = () => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof restoreSessionAction>>,
) => {
  dispatch(restoreSessionAction.request());
  const token = await getTokenFromStorage();

  if (token === null) {
    dispatch(restoreSessionAction.failure());
    return;
  }

  const isConnected = await NetInfo.isConnected.fetch();
  if (!isConnected) {
    dispatch(restoreSessionAction.success(token));
    return;
  }

  try {
    const { data } = await api.get<User>('/user');
    dispatch(restoreSessionAction.success(token));
  } catch (error) {
    dispatch(restoreSessionAction.failure());
  }
};

export const loginAction = createAsyncAction(
  UserAction.LOGIN,
  UserAction.LOGIN_SUCCESS,
  UserAction.LOGIN_FAILURE,
)<undefined, Token, ValidationError[] | undefined>();

export const login = (email: string, password: string) => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof loginAction>>,
) => {
  dispatch(loginAction.request());

  try {
    const { data } = await api.post<Token>('/auth', { email, password });
    await registerToken(data);
    dispatch(loginAction.success(data));
  } catch (error) {
    const validationMessages = R.path<ValidationError[]>(
      ['response', 'data', 'message'],
      error,
    );
    dispatch(loginAction.failure(validationMessages));
  }
};

export const logoutAction = createAsyncAction(
  UserAction.LOGOUT,
  UserAction.LOGOUT_SUCCESS,
  UserAction.LOGOUT_FAILURE,
)<undefined, void, ValidationError>();

export const logout = () => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof logoutAction>>,
) => {
  dispatch(logoutAction.request());

  try {
    await destroyToken();
    await api.post('/auth/logout');
    dispatch(logoutAction.success());
  } catch (error) {
    dispatch(logoutAction.failure(error));
  }
};

interface RegisterActionPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerAction = createAsyncAction(
  UserAction.REGISTER,
  UserAction.REGISTER_SUCCESS,
  UserAction.REGISTER_FAILURE,
)<RegisterActionPayload, Token, ValidationError[] | undefined>();

export const register = (
  email: string,
  password: string,
  confirmPassword: string,
) => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof registerAction>>,
) => {
  const payload = { email, password, confirmPassword };
  dispatch(registerAction.request(payload));

  if (password !== confirmPassword) {
    const validationError: ValidationError = {
      property: 'confirmPassword',
      constraints: {
        confirmPassword: 'Passwords don\'t match',
      },
      children: [],
    };

    dispatch(registerAction.failure([validationError]));
    return;
  }

  try {
    const { data } = await api.post<Token>('/auth/register', {
      email,
      password,
    });
    await registerToken(data);

    dispatch(registerAction.success(data));
  } catch (error) {
    const validationMessages = R.path<ValidationError[]>(
      ['response', 'data', 'message'],
      error,
    );

    dispatch(registerAction.failure(validationMessages));
  }
};
