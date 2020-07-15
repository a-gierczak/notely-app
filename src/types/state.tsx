import { HomeState } from 'src/modules/Home/reducers/homeReducer';
import { TagInputState } from 'src/modules/TagInput/reducers/tagInputReducer';
import { NavigationState } from 'react-navigation';
import { UserState } from 'src/modules/User/reducers/userReducer';
import { PostState } from 'src/modules/Post/reducers/postReducer';
import { AlertState } from 'src/modules/Alert/reducers/alertReducer';
import { PostCategoryState } from 'src/modules/PostCategory/reducers/postCategoryReducer';

export interface AppState {
  home: HomeState;
  tagInput: TagInputState;
  navigation: NavigationState;
  user: UserState;
  postCategory: PostCategoryState;
  post: PostState;
  alert: AlertState;
}
