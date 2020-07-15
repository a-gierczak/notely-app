import { action, createAsyncAction } from 'typesafe-actions';
import { Tag } from 'src/types/common';
import { ThunkDispatch } from 'redux-thunk';
import { api } from 'src/api';
import { ActionType } from 'typesafe-actions';

export enum HomeAction {
  FETCH_TAGS = 'home/FETCH_TAGS',
  FETCH_TAGS_SUCCESS = 'home/FETCH_TAGS_SUCCESS',
  FETCH_TAGS_FAILURE = 'home/FETCH_TAGS_ERROR',
}

export const fetchTagsAction = createAsyncAction(
  HomeAction.FETCH_TAGS,
  HomeAction.FETCH_TAGS_SUCCESS,
  HomeAction.FETCH_TAGS_FAILURE,
)<void, Tag[], void>();

export const fetchTags = () => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof fetchTagsAction>>,
) => {
  dispatch(fetchTagsAction.request());

  try {
    const { data } = await api.get<Tag[]>('post/tag');
    dispatch(fetchTagsAction.success(data));
  } catch (error) {
    dispatch(fetchTagsAction.failure());
  }
};

export const fetchTagsSuccess = (tags: Tag[]) =>
  action(HomeAction.FETCH_TAGS_SUCCESS, tags);
