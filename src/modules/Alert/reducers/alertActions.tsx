import { createStandardAction, createAction } from 'typesafe-actions';
import { AxiosResponse } from 'axios';

export enum AlertAction {
  HIDE_ALERT = 'alert/HIDE_ALERT',
  ALERT_BACKEND_RUNTIME_ERROR = 'alert/ALERT_BACKEND_RUNTIME_ERROR',
  ALERT_CONNECTION_LOST = 'alert/ALERT_CONNECTION_LOST',
  ALERT_CONNECTION_RESTORED = 'alert/CONNECTION_RESTORED',
}

export const alertBackendRuntimeErrorAction = createStandardAction(
  AlertAction.ALERT_BACKEND_RUNTIME_ERROR,
)<AxiosResponse<any>>();

export const hideAlert = createAction(AlertAction.HIDE_ALERT);

export const alertConnectionLost = createAction(AlertAction.ALERT_CONNECTION_LOST);

export const alertConnectionRestored = createAction(AlertAction.ALERT_CONNECTION_RESTORED);
