import * as React from 'react';
import { Post, Tag } from 'src/types/common';
import { fetchPostsByTag, fetchRecentPosts, destroy } from './reducers/postCategoryActions';
import { AppState } from 'src/types/state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  NavigationScreenProp,
  NavigationScreenConfig,
  NavigationScreenOptions,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { HeaderWithSearch } from 'UI/components/HeaderWithSearch';
import { PostCategory } from 'src/modules/PostCategory/components/PostCategory';

interface NavigationProps {
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    { tag?: Tag }
  >;
}

interface DispatchProps {
  fetchPostsByTagAction: typeof fetchPostsByTag;
  fetchRecentPostsAction: typeof fetchRecentPosts;
  destroyAction: typeof destroy;
}

interface StateProps {
  posts?: Post[];
}

class PostCategoryContainerBase extends React.Component<
  NavigationProps & DispatchProps & StateProps,
  never
> {
  static navigationOptions: NavigationScreenConfig<NavigationScreenOptions> = ({
    navigation,
  }) => ({
    header: <HeaderWithSearch navigation={navigation} />,
  })

  componentDidMount() {
    const { navigation, fetchPostsByTagAction, fetchRecentPostsAction } = this.props;
    const tag = navigation.getParam('tag');
    if (tag) {
      fetchPostsByTagAction(tag.id);
    } else {
      fetchRecentPostsAction();
    }
  }

  componentWillUnmount() {
    this.props.destroyAction();
  }

  render() {
    const { navigation, posts } = this.props;
    const tag = navigation.getParam('tag');
    const title = tag ? tag.name : 'Recently added';

    return (
      <PostCategory
        title={title}
        posts={posts}
        navigation={navigation}
      />
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  posts: state.postCategory.posts,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      fetchRecentPostsAction: fetchRecentPosts,
      fetchPostsByTagAction: fetchPostsByTag,
      destroyAction: destroy,
    },
    dispatch,
  );

export const PostCategoryContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCategoryContainerBase);
