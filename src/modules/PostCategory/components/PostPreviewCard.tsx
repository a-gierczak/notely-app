import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image, Text } from 'react-native-elements';
import { format } from 'date-fns';
import { Color } from 'src/modules/UI/styles';

interface OwnProps {
  thumbnailUrl: string;
  title: string;
  date: Date;
  onPress: () => void;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  title: {
    color: Color.Text,
    fontSize: 16,
    fontFamily: 'heebo-regular',
    fontWeight: '400',
  },
  date: {
    color: Color.TextMuted,
    fontSize: 12,
    fontFamily: 'heebo-regular',
    fontWeight: '300',
  },
  thumbnail: {
    width: '100%',
    height: 60,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});

export const PostPreviewCard: React.SFC<OwnProps> = ({
  thumbnailUrl,
  title,
  date,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      <Image style={styles.thumbnail} source={{ uri: thumbnailUrl }} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{format(date, 'DD MMMM')}</Text>
    </View>
  </TouchableOpacity>
);
