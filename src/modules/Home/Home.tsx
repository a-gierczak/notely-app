import React from 'react';
import R from 'ramda';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';
import { HeaderWithSearch } from '../UI/components/HeaderWithSearch';
import { TagCard } from './components/TagCard';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchTags } from './reducers/homeActions';
import { AppState } from 'src/types/state';
import { connect } from 'react-redux';
import { Tag, Post } from 'src/types/common';
import { differenceInHours, compareDesc } from 'date-fns';
import { Color } from 'src/modules/UI/styles';
import { Text } from 'react-native-elements';

const styles = StyleSheet.create({
  home: {
    backgroundColor: Color.Background,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostsTitle: {
    textAlign: 'center',
    color: Color.LightGrey,
    marginBottom: 10,
  },
  noPostsMessage: {
    textAlign: 'center',
    color: Color.LightGrey,
    fontSize: 16,
  },
});

interface ConnectedProps {
  tags: Tag[];
}

interface DispatchProps {
  fetchTagsAction: typeof fetchTags;
}
interface NavigationProps {
  navigation: NavigationScreenProp<void>;
}

class HomeBase extends React.Component<
  NavigationProps & ConnectedProps & DispatchProps
> {
  static navigationOptions: NavigationScreenConfig<NavigationScreenOptions> = ({
    navigation,
  }) => ({
    header: <HeaderWithSearch navigation={navigation} showBackButton={false} />,
  })

  componentDidMount = () => {
    this.props.fetchTagsAction();
  }

  handleTagPress = (tag: Tag) => () =>
    this.props.navigation.push('PostCategory', { tag })

  handleRecentlyAddedPress = () => this.props.navigation.push('PostCategory');

  renderRecentlyAdded = () => {
    const { tags } = this.props;

    if (!(tags && tags.length > 0)) {
      return null;
    }

    const posts = R.pipe(
      R.chain<Tag, Post>(tag => tag.posts),
      R.uniqBy(R.prop('id')),
      R.sort((first, second) => compareDesc(first.createdAt, second.createdAt)),
    )(tags);

    const recentlyAdded = R.filter<Post>(
      post => differenceInHours(new Date(), post.createdAt) <= 24,
      posts,
    );

    return recentlyAdded.length === 0 ? null : (
      <TagCard
        onPress={this.handleRecentlyAddedPress}
        posts={recentlyAdded}
        title="Recently added"
      />
    );
  }

  renderNoPosts = () => (
    <View style={styles.noPostsContainer}>
      <Text h3 style={styles.noPostsTitle}>
        Looks empty there
      </Text>
      <Text style={styles.noPostsMessage}>
        To create a new post tap the camera button below.
      </Text>
    </View>
  )

  render() {
    const { tags } = this.props;

    if (R.length(tags) === 0) {
      return this.renderNoPosts();
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.home}>
        {this.renderRecentlyAdded()}

        {R.map<Tag, React.ReactNode>(
          tag => (
            <TagCard
              key={tag.id}
              onPress={this.handleTagPress(tag)}
              title={`#${tag.name}`}
              posts={tag.posts}
            />
          ),
          tags || [],
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  tags: state.home.tags,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators(
    {
      fetchTagsAction: fetchTags,
    },
    dispatch,
  ),
});

export const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeBase);
