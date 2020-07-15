import { StyleSheet } from 'react-native';

export enum Color {
  Text = '#47525E',
  TextMuted = '#657586',
  LightGrey = '#C0CCDA',
  MediumGrey = '#818A95',
  Primary = '#30566E',
  Link = '#3195D4',
  Background = '#F8F8F8',
  Error = '#B00020',
  Action = '#33FF63',
}

export const commonStyles = StyleSheet.create({
  link: {
    color: Color.Link,
    fontFamily: 'heebo-regular',
    fontWeight: '500',
  },
});
