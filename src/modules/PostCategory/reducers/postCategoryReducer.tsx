import { Post } from 'src/types/common';
import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as postCategoryActions from './postCategoryActions';

const {
  FETCH_POSTS_BY_TAG_SUCCESS,
  FETCH_RECENT_POSTS_SUCCESS,
  DESTROY,
} = postCategoryActions.PostCategoryAction;

export interface PostCategoryState {
  posts?: Post[];
}

const initialState: PostCategoryState = {
  posts: undefined,
};

const reducer: Reducer<PostCategoryState> = (
  state = initialState,
  action: ActionType<typeof postCategoryActions>,
) => {
  switch (action.type) {
    case FETCH_RECENT_POSTS_SUCCESS:
    case FETCH_POSTS_BY_TAG_SUCCESS:
      return { ...state, posts: action.payload };
    case DESTROY:
      return { ...state, posts: undefined };
    default:
      return state;
  }
};

export { reducer as postCategoryReducer };
