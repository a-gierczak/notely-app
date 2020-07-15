import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import { AppNavigator } from 'modules/Navigation/AppNavigator';
import { postReducer } from 'modules/Post/reducers/postReducer';
import { userReducer } from 'modules/User/reducers/userReducer';
import { homeReducer } from 'modules/Home/reducers/homeReducer';
import { tagInputReducer } from './modules/TagInput/reducers/tagInputReducer';
import { alertReducer } from 'src/modules/Alert/reducers/alertReducer';
import { postCategoryReducer } from 'src/modules/PostCategory/reducers/postCategoryReducer';

const navigationReducer = createNavigationReducer(AppNavigator);

export const rootReducer = combineReducers({
  navigation: navigationReducer,
  post: postReducer,
  user: userReducer,
  home: homeReducer,
  tagInput: tagInputReducer,
  postCategory: postCategoryReducer,
  alert: alertReducer,
});
