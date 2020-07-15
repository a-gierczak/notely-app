import { createAsyncAction, ActionType, action } from 'typesafe-actions';
import { Post } from 'src/types/common';
import { ThunkDispatch } from 'redux-thunk';
import { api } from 'src/api';

export enum PostCategoryAction {
  FETCH_POSTS_BY_TAG = 'postCategory/FETCH_POSTS_BY_TAG',
  FETCH_POSTS_BY_TAG_SUCCESS = 'postCategory/FETCH_POSTS_BY_TAG_SUCCESS',
  FETCH_POSTS_BY_TAG_FAILURE = 'postCategory/FETCH_POSTS_BY_TAG_FAILURE',
  FETCH_RECENT_POSTS = 'postCategory/FETCH_RECENT_POSTS',
  FETCH_RECENT_POSTS_SUCCESS = 'postCategory/FETCH_RECENT_POSTS_SUCCESS',
  FETCH_RECENT_POSTS_FAILURE = 'postCategory/FETCH_RECENT_POSTS_FAILURE',
  DESTROY = 'postCategory/DESTROY',
}

export const fetchPostsByTagAction = createAsyncAction(
  PostCategoryAction.FETCH_POSTS_BY_TAG,
  PostCategoryAction.FETCH_POSTS_BY_TAG_SUCCESS,
  PostCategoryAction.FETCH_POSTS_BY_TAG_FAILURE,
)<undefined, Post[], void>();

export const fetchPostsByTag = (tagId: string) => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof fetchPostsByTagAction>>,
) => {
  dispatch(fetchPostsByTagAction.request());

  try {
    const { data } = await api.get<Post[]>(`post/tag/${tagId}`);
    dispatch(fetchPostsByTagAction.success(data));
  } catch (error) {
    dispatch(fetchPostsByTagAction.failure());
  }
};

export const destroy = () => action(PostCategoryAction.DESTROY);

export const fetchRecentPostsAction = createAsyncAction(
  PostCategoryAction.FETCH_RECENT_POSTS,
  PostCategoryAction.FETCH_RECENT_POSTS_SUCCESS,
  PostCategoryAction.FETCH_RECENT_POSTS_FAILURE,
)<undefined, Post[], void>();

export const fetchRecentPosts = () => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof fetchRecentPostsAction>>,
) => {
  dispatch(fetchRecentPostsAction.request());

  try {
    const { data } = await api.get<Post[]>('post/recent');
    dispatch(fetchRecentPostsAction.success(data));
  } catch (error) {
    dispatch(fetchRecentPostsAction.failure());
  }
};
