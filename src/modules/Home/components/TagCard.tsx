import * as React from 'react';
import R from 'ramda';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { Post } from 'src/types/common';
import { Grid, Col } from 'react-native-easy-grid';
import { Color } from 'src/modules/UI/styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  title: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
  },
  titleAddon: {
    color: Color.Text,
    fontWeight: '400',
  },
  postContainer: {
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  morePosts: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: Color.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePostsText: {
    color: '#fff',
    fontSize: 16,
  },
});

interface TagCardProps {
  title: string;
  posts?: Post[];
  onPress: () => void;
}

const TILE_COUNT = 5;

export const TagCard: React.SFC<TagCardProps> = (props) => {
  const {
    onPress,
    posts = [],
    title,
  } = props;

  const visiblePostsCount = posts.length > TILE_COUNT ? TILE_COUNT - 1 : TILE_COUNT;
  const postsLeft = posts.length - visiblePostsCount;
  const postPreviews = R.pipe(
    R.take<Post>(visiblePostsCount),
    R.map<Post, React.ReactNode>(post => (
      <Col size={20} key={post.id}>
        <Image
          source={{ uri: post.fileUrl }}
          style={styles.postImage}
          containerStyle={styles.postContainer}
        />
      </Col>
    )),
  )(posts);
  const morePostsTile = (
    <Col size={20} key="more-posts">
      <View style={styles.morePosts}>
        <Text style={styles.morePostsText}>+{postsLeft}</Text>
      </View>
    </Col>
  );
  const columns = postsLeft > 0
    ? R.append(morePostsTile, postPreviews)
    : postPreviews;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text h4 style={styles.title}>{title}</Text>
          <Text style={styles.titleAddon}>See all</Text>
        </View>

        <Grid>
          {columns}
          {columns.length < 5 && (
            <Col size={20 * (5 - columns.length)} />
          )}
        </Grid>
      </View>
    </TouchableOpacity>
  );
};
