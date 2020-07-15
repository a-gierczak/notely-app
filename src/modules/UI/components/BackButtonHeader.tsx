import * as React from 'react';
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { Header, Icon } from 'react-native-elements';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Color } from 'src/modules/UI/styles';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>>;
  title?: string;
  backgroundColor: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const styles = StyleSheet.create({
  iconContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});

export const BackButtonHeader: React.SFC<Props> = ({
  navigation,
  title,
  backgroundColor,
  rightIcon,
  onRightIconPress,
}) => {
  const centerComponent = title
    ? { text: title, style: { color: '#fff' } }
    : undefined;
  const leftComponent = (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
    >
      <Icon
        containerStyle={styles.iconContainerStyle}
        color={Color.LightGrey}
        size={40}
        name="chevron-left"
        type="feather"
      />
    </TouchableOpacity>
  );
  const rightComponent = rightIcon ? (
    <TouchableOpacity
      onPress={onRightIconPress}
    >
      <Icon
        containerStyle={styles.iconContainerStyle}
        color={Color.LightGrey}
        size={40}
        name={rightIcon}
        type="feather"
      />
    </TouchableOpacity>
  ) : (
    undefined
  );

  return (
    <Header
      backgroundColor={backgroundColor}
      leftComponent={leftComponent}
      centerComponent={centerComponent}
      rightComponent={rightComponent}
    />
  );
};
