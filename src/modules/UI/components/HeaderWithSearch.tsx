import * as React from 'react';
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { Header, Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Color } from 'src/modules/UI/styles';

interface Props {
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
  showBackButton?: boolean;
}

const styles = StyleSheet.create({
  iconContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});

export const HeaderWithSearch: React.SFC<Props> = ({
  navigation,
  showBackButton = true,
}) => {
  const backButton = showBackButton ? (
    <TouchableOpacity
      style={styles.iconContainerStyle}
      onPress={() => navigation.goBack()}
    >
      <Icon type="feather" name="chevron-left" color={Color.LightGrey} size={40} />
    </TouchableOpacity>
  ) : undefined;

  const searchIcon = (
    <TouchableOpacity>
      <View>
        <Icon
          name="search"
          color={Color.LightGrey} size={40}
          containerStyle={styles.iconContainerStyle}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Header
      leftComponent={backButton}
      backgroundColor={Color.Background}
      rightComponent={searchIcon}
    />
  );
};
