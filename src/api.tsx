import axios, { AxiosError } from 'axios';
import { AsyncStorage } from 'react-native';
import { isAfter } from 'date-fns';
import { Token } from './types/common';
import { Store } from 'redux';
import { alertBackendRuntimeErrorAction } from 'src/modules/Alert/reducers/alertActions';

const STORAGE_KEY = 'token';

const config = {
  baseURL: 'http://127.0.0.1:3000/',
};

export const api = axios.create(config);

export const destroyToken = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

// Request logger
api.interceptors.response.use(
  (response) => {
    console.log('[Axios Response]', { ...response });
    return Promise.resolve(response);
  },
  (error) => {
    console.log('[Axios Error]', { ...error });
    return Promise.reject(error);
  }
);

export const registerBackendErrorHandler = (store: Store) => {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const { response } = error;

      if (response && response.status >= 500) {
        store.dispatch(alertBackendRuntimeErrorAction(response));
      }

      return Promise.reject(error);
    }
  );
};

export const registerLogoutInterceptor = (store: Store, actionType: string) => {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const { response } = error;
      if (response && response.status === 401) {
        await destroyToken();
        store.dispatch({ type: actionType });
      }

      return Promise.reject(error);
    }
  );
};

export const registerToken = async (tokenData: Token, persist = true) => {
  const { accessToken } = tokenData;
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  if (persist) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData));
  }
};

export const getTokenFromStorage = async (): Promise<Token | null> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedData === null) {
      return null;
    }

    const tokenData: Token = JSON.parse(storedData);
    if (tokenData && isAfter(new Date(tokenData.expires), new Date())) {
      await registerToken(tokenData, false);
      return tokenData;
    }

    destroyToken();
  } catch (err) {
    console.error('err', err);
    destroyToken();
  }

  return null;
};
