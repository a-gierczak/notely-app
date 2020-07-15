import { Tag } from 'src/types/common';
import { Reducer } from 'redux';
import * as homeActions from './homeActions';
import { ActionType } from 'typesafe-actions';

export interface HomeState {
  tags: Tag[] | null;
}

const initialState: HomeState = {
  tags: null,
};

const reducer: Reducer<HomeState> = (
  state = initialState,
  action: ActionType<typeof homeActions>,
) => {
  switch (action.type) {
    case homeActions.HomeAction.FETCH_TAGS_SUCCESS:
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export { reducer as homeReducer };
