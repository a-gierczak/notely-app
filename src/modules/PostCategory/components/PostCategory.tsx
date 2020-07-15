import React from 'react';
import R from 'ramda';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Color } from 'src/modules/UI/styles';
import { Text } from 'react-native-elements';
import { Post } from 'src/types/common';
import { compareDesc } from 'date-fns';
import { PostPreviewCard } from 'src/modules/PostCategory/components/PostPreviewCard';
import { NavigationParams, NavigationRoute, NavigationScreenProp } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, {}>;
  posts?: Post[];
  title: string;
}

const styles = StyleSheet.create({
  postCategory: {
    backgroundColor: Color.Background,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 30,
  },
  postContainer: {
    flexBasis: '31%',
    marginRight: '2.3%',
    marginBottom: 15,
  },
});

export const PostCategory: React.SFC<Props> = (props) => {
  const { navigation, posts, title } = props;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.postCategory}
    >
      <Text h3 style={styles.title}>{title}</Text>

      <View style={styles.grid}>
        {R.pipe(
          R.sort<Post>((first, second) => compareDesc(first.createdAt, second.createdAt)),
          R.map<Post, React.ReactNode>(post => (
            <View style={styles.postContainer} key={post.id}>
              <PostPreviewCard
                date={post.createdAt}
                title={post.name}
                thumbnailUrl={post.fileUrl}
                onPress={() => navigation.navigate('PostView', { post })}
              />
            </View>
          )),
        )(posts || [])}
      </View>
    </ScrollView>
  );
};
