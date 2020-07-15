import R from 'ramda';
import React, { useState, useEffect } from 'react';
import { Tag } from 'src/types/common';
import { api } from 'src/api';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { Color } from 'src/modules/UI/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  search?: string;
  onSelect: (tag: Tag) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    minHeight: 30,
  },
  textContainer: {
    borderRadius: 12,
    backgroundColor: Color.Primary,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

const removeSelected = (tags: Tag[], search: string = ''): Tag[] => {
  const selectedTagNames = R.pipe(
    R.trim,
    R.split(' '),
    R.filter<string>(R.complement(R.isEmpty)),
    R.map(R.toLower),
  )(search);
  const tagMap = R.indexBy(tag => R.toLower(tag.name), tags);

  return R.pipe(
    R.omit(selectedTagNames),
    R.values,
  )(tagMap);
};

export const TagSuggestions: React.SFC<Props> = ({ search, onSelect }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  // TODO: debounce
  useEffect(() => {
    if (!search) {
      setTags([]);
      return;
    }

    const query = R.pipe(R.split(' '), R.last)(search);
    if (!query) {
      return;
    }

    api
      .get<Tag[]>(`tag/search/${query}`)
      .then(({ data }) => setTags(removeSelected(data, query)));
  },        [search]);

  return (
    <View style={styles.container}>
      {tags.map(tag => (
        <TouchableOpacity
          onPress={() => onSelect(tag)}
          style={styles.textContainer}
          key={tag.id}
        >
          <Text style={styles.text}>#{tag.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
