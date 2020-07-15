import { Reducer } from 'redux';
import * as postActions from './postActions';
import { Post, ValidationError } from 'src/types/common';
import { navigateAction } from 'src/modules/Navigation/reducers/navigationActions';
import { NavigationActions } from 'react-navigation';
import { ActionType } from 'typesafe-actions';
import { CapturedImage } from 'src/modules/CreatePost/components/Camera';

const {
  GET_POSTS_BY_TAG,
  GET_POSTS_BY_TAG_SUCCESS,
  GET_POST,
  GET_POST_SUCCESS,
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  CAPTURE_IMAGE,
  UPLOAD_IMAGE_SUCCESS,
} = postActions.PostAction;

export interface PostState {
  creatingPost: boolean;
  posts?: Post[];
  selectedPost?: Post;
  imageDraft?: CapturedImage;
  errors?: ValidationError[];
  fileName?: string;
}

const initialState: PostState = {
  creatingPost: false,
};

const reducer: Reducer<PostState> = (
  state = initialState,
  action: ActionType<typeof postActions | typeof navigateAction>,
) => {
  switch (action.type) {
    case CREATE_POST:
      return { ...state, creatingPost: true };
    case CREATE_POST_SUCCESS:
      return { ...state, creatingPost: false };
    case CREATE_POST_FAILURE:
      return { ...state, creatingPost: false, errors: action.payload };
    case GET_POSTS_BY_TAG:
      return { ...state, posts: undefined };
    case GET_POSTS_BY_TAG_SUCCESS:
      return { ...state, posts: action.payload };
    case GET_POST:
      return { ...state, selectedPost: undefined };
    case GET_POST_SUCCESS:
      return { ...state, selectedPost: action.payload };
    case NavigationActions.NAVIGATE:
      if (action.routeName !== 'CreatePost') {
        return initialState;
      }
      return state;
    case CAPTURE_IMAGE:
      return { ...state, imageDraft: action.payload };
    case UPLOAD_IMAGE_SUCCESS:
      return { ...state, fileName: action.payload };
    default:
      return state;
  }
};

export { reducer as postReducer };
