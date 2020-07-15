import * as React from 'react';
import R from 'ramda';
import {
  NavigationScreenProp,
  NavigationParams,
  NavigationRoute,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';
import { ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Post, Tag } from 'src/types/common';
import { format } from 'date-fns';
import AutoHeightImage from 'react-native-auto-height-image';
import { BackButtonHeader } from 'src/modules/UI/components/BackButtonHeader';
import { Color } from 'UI/styles';

const styles = StyleSheet.create({
  post: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingBottom: 25,
  },
  title: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
  },
  tags: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
    fontWeight: '500',
    fontSize: 14,
  },
  image: {
    marginBottom: 15,
  },
  bottomTextContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  date: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
    fontSize: 14,
    fontWeight: '300',
  },
  description: {},
});

interface NavigationProps {
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    { post: Post }
  >;
}

export class PostView extends React.Component<NavigationProps, void> {
  static navigationOptions: NavigationScreenConfig<NavigationScreenOptions> = ({
    navigation,
  }) => ({
    header: <BackButtonHeader backgroundColor="#fff" navigation={navigation} />,
  })

  render() {
    const { navigation } = this.props;
    const post = navigation.getParam('post');

    return (
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.post}>
        <View style={styles.titleContainer}>
          <Text h3 style={styles.title}>
            {post.name}
          </Text>
          <Text style={styles.tags}>
            {R.pipe(
              R.map<Tag, string>(tag => `#${tag.name}`),
              R.join(' '),
            )(post.tags)}
          </Text>
        </View>
        <AutoHeightImage
          width={Dimensions.get('window').width}
          style={styles.image}
          source={{ uri: post.fileUrl }}
        />
        <View style={styles.bottomTextContainer}>
          <Text style={styles.date}>{format(post.createdAt, 'DD MMMM')}</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>
      </ScrollView>
    );
  }
}
