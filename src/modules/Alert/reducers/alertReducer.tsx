import * as alertActions from './alertActions';
import { ActionType } from 'typesafe-actions';
import { Reducer } from 'redux';

export interface AlertState {
  message?: string;
  originAction?: alertActions.AlertAction;
}

export const reducer: Reducer<AlertState> = (
  state = {},
  action: ActionType<typeof alertActions>,
) => {
  switch (action.type) {
    case alertActions.AlertAction.ALERT_BACKEND_RUNTIME_ERROR:
      return {
        ...state,
        message: 'Something went wrong with your request. Try again later.',
        originAction: action.type,
      };
    case alertActions.AlertAction.HIDE_ALERT:
      return { ...state, message: undefined, originAction: action.type };
    case alertActions.AlertAction.ALERT_CONNECTION_LOST:
      return {
        ...state,
        message: 'You are in offline mode.',
        originAction: action.type,
      };
    case alertActions.AlertAction.ALERT_CONNECTION_RESTORED:
      return state.originAction ===
        alertActions.AlertAction.ALERT_CONNECTION_LOST
        ? { ...state, message: undefined, originAction: action.type }
        : state;
    default:
      return state;
  }
};

export { reducer as alertReducer };
