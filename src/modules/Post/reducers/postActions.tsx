import {
  createAsyncAction,
  ActionType,
  createStandardAction,
} from 'typesafe-actions';
import { Post, ValidationError } from 'src/types/common';
import { ThunkDispatch } from 'redux-thunk';
import { api } from 'src/api';
import { uploadFile } from 'utils/s3';
import {
  fetchTagsAction,
  fetchTags,
} from 'src/modules/Home/reducers/homeActions';
import { navigateAction } from 'src/modules/Navigation/reducers/navigationActions';
import R from 'ramda';
import * as ImageManipulator from 'expo-image-manipulator';
import { CapturedImage } from 'src/modules/CreatePost/components/Camera';

export enum PostAction {
  GET_POSTS_BY_TAG = 'post/GET_POSTS_BY_TAG',
  GET_POSTS_BY_TAG_SUCCESS = 'post/GET_POSTS_BY_TAG_SUCCESS',
  GET_POSTS_BY_TAG_FAILURE = 'post/GET_POSTS_BY_TAG_FAILURE',
  GET_POST = 'post/GET_POST',
  GET_POST_SUCCESS = 'post/GET_POST_SUCCESS',
  GET_POST_FAILURE = 'post/GET_POST_FAILURE',
  CREATE_POST = 'post/CREATE_POST',
  CREATE_POST_SUCCESS = 'post/CREATE_POST_SUCCESS',
  CREATE_POST_FAILURE = 'post/CREATE_POST_FAILURE',
  CAPTURE_IMAGE = 'post/CAPTURE_IMAGE',
  UPLOAD_IMAGE = 'post/UPLOAD_IMAGE',
  UPLOAD_IMAGE_SUCCESS = 'post/UPLOAD_IMAGE_SUCCESS',
  UPLOAD_IMAGE_FAILURE = 'post/UPLOAD_IMAGE_FAILURE',
}

export const getPostsByTagAction = createAsyncAction(
  PostAction.GET_POSTS_BY_TAG,
  PostAction.GET_POSTS_BY_TAG_SUCCESS,
  PostAction.GET_POSTS_BY_TAG_FAILURE,
)<undefined, Post[], void>();

export const getPostsByTag = (tagId: string | null = null) => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof getPostsByTagAction>>,
) => {
  dispatch(getPostsByTagAction.request());

  const endpoint = tagId ? `/post/tag/${tagId}` : 'post/tag';

  try {
    const { data } = await api.get<Post[]>(endpoint);
    dispatch(getPostsByTagAction.success(data));
  } catch (error) {
    dispatch(getPostsByTagAction.failure());
  }
};

export interface CreatePostPayload {
  image: CapturedImage;
  tags?: string;
  description?: string;
  name?: string;
  fileName?: string;
}

export interface SignedUrlDto {
  fileName: string;
  url: string;
}

export const createPostActions = createAsyncAction(
  PostAction.CREATE_POST,
  PostAction.CREATE_POST_SUCCESS,
  PostAction.CREATE_POST_FAILURE,
)<CreatePostPayload, Post, ValidationError[] | undefined>();

export const uploadImageActions = createAsyncAction(
  PostAction.UPLOAD_IMAGE,
  PostAction.UPLOAD_IMAGE_SUCCESS,
  PostAction.UPLOAD_IMAGE_FAILURE,
)<CapturedImage, string, void>();

const uploadImage = async (image: CapturedImage) => {
  const {
    data: { fileName, url },
  } = await api.post<SignedUrlDto>('/storage', { contentType: 'image/jpeg' });

  const scaledImage = await ImageManipulator.manipulateAsync(
    image.uri,
    [{ resize: { width: Math.min(image.width, 1080) } }],
    { compress: 0.35 },
  );

  await uploadFile(url, scaledImage.uri, fileName);
  return fileName;
};

export const createPost = (payload: CreatePostPayload) => async (
  dispatch: ThunkDispatch<
    {},
    {},
    ActionType<
      | typeof createPostActions
      | typeof fetchTagsAction
      | typeof navigateAction
      | typeof uploadImageActions
    >
  >,
) => {
  dispatch(createPostActions.request(payload));

  try {
    const { image, tags = '', description, name } = payload;
    let fileName = payload.fileName;

    if (!fileName) {
      fileName = await uploadImage(image);
      dispatch(uploadImageActions.success(fileName));
    }

    const trimmedTags = R.pipe(
      R.trim,
      R.split(' '),
      R.filter<string>(R.complement(R.isEmpty)),
    )(tags);

    const { data: post } = await api.post<Post>('/post', {
      fileName,
      description,
      name,
      tags: trimmedTags,
    });

    dispatch(createPostActions.success(post));
    await fetchTags()(dispatch);
    dispatch(navigateAction('Home'));
  } catch (error) {
    const validationMessages = R.path<ValidationError[]>(
      ['response', 'data', 'message'],
      error,
    );
    dispatch(createPostActions.failure(validationMessages));
  }
};

export const getPostAction = createAsyncAction(
  PostAction.GET_POST,
  PostAction.GET_POST_SUCCESS,
  PostAction.GET_POST_FAILURE,
)<string, Post, void>();

export const getPost = (id: string) => async (
  dispatch: ThunkDispatch<{}, {}, ActionType<typeof getPostAction>>,
) => {
  dispatch(getPostAction.request(id));

  try {
    const { data } = await api.get<Post>(`/post/${id}`);
    dispatch(getPostAction.success(data));
  } catch (error) {
    dispatch(getPostAction.failure());
  }
};

export const captureImage = createStandardAction(PostAction.CAPTURE_IMAGE)<
  CapturedImage
>();
