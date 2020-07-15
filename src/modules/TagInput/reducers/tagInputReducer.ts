import { Tag } from 'src/types/common';
import { Reducer } from 'redux';
import * as tagInputActions from './tagInputActions';
import { ActionType } from 'typesafe-actions';

export interface TagInputState {
  tags: Tag[] | null;
}

const initialState: TagInputState = {
  tags: null,
};

const reducer: Reducer<TagInputState> = (
  state = initialState,
  action: ActionType<typeof tagInputActions>,
) => {
  switch (action.type) {
    case tagInputActions.TagInputAction.FIND_TAGS_SUCCESS:
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export { reducer as tagInputReducer };
