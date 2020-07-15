import { createAsyncAction } from 'typesafe-actions';
import { Tag } from 'src/types/common';
import { ThunkDispatch } from 'redux-thunk';
import { api } from 'src/api';
import { ActionType } from 'typesafe-actions';

export enum TagInputAction {
  FIND_TAGS = 'createPost/FIND_TAGS',
  FIND_TAGS_SUCCESS = 'createPost/FIND_TAGS_SUCCESS',
  FIND_TAGS_FAILURE = 'createPost/FIND_TAGS_FAILURE',
  SELECT_TAGS = 'createPost/SELECT_TAGS',
}

export const findTagsAction = createAsyncAction(
  TagInputAction.FIND_TAGS,
  TagInputAction.FIND_TAGS_SUCCESS,
  TagInputAction.FIND_TAGS_FAILURE,
)<undefined, Tag[], void>();

export const findTags = (query: string) =>
  async (dispatch: ThunkDispatch<{}, {}, ActionType<typeof findTagsAction>>) => {
    dispatch(findTagsAction.request());

    if (query === '') {
      dispatch(findTagsAction.success([]));
      return;
    }

    try {
      const { data } = await api.get(`tag/search/${query}`);
      dispatch(findTagsAction.success(data));
    } catch (error) {
      dispatch(findTagsAction.failure());
    }
  };
