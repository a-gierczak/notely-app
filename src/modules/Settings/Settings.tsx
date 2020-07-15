import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';
import { ListItem, Text, ListItemProps } from 'react-native-elements';
import { Dispatch, bindActionCreators } from 'redux';
import { logout } from 'User/reducers/userActions';
import { connect } from 'react-redux';
import { Color } from 'src/modules/UI/styles';
import { commonStyles } from 'UI/styles';

type OwnProps = {
  navigation: NavigationScreenProp<void>;
};

type DispatchProps = {
  logoutAction: typeof logout;
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Color.Background,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
  listContainer: {
    marginVertical: 25,
  },
  title: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
  },
  listItemTitle: {
    fontFamily: 'heebo-regular',
    color: Color.Text,
    fontSize: 14,
  },
  listItemContainer: {
    borderColor: '#B2C1D1',
  },
  footerText: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 3,
  },
  link: {
    textAlign: 'center',
  },
});

const SettingsListItem: React.SFC<ListItemProps> = props => (
  <TouchableOpacity>
    <ListItem
      {...props}
      containerStyle={styles.listItemContainer}
      titleStyle={styles.listItemTitle}
      rightIcon={{ name: 'chevron-right', color: Color.LightGrey }}
    />
  </TouchableOpacity>
);

class SettingsBase extends React.Component<OwnProps & DispatchProps> {
  static navigationOptions: NavigationScreenConfig<
    NavigationScreenOptions
  > = () => ({
    header: null,
  })

  render() {
    const { logoutAction } = this.props;

    return (
      <View style={styles.screen}>
        <Text h4 style={styles.title}>
          Settings
        </Text>
        <View style={styles.listContainer}>
          <SettingsListItem title="Your account" bottomDivider />
          <SettingsListItem title="Billing" bottomDivider />
          <SettingsListItem title="Privacy policy" bottomDivider />
          <SettingsListItem title="Logout" onPress={logoutAction} />
        </View>
        <Text style={styles.footerText}>
          You are using 54 out of 100 notes (54%) of your free plan.
        </Text>
        <Text style={[commonStyles.link, styles.link]}>
          Select a subscription plan for more space.
        </Text>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      logoutAction: logout,
    },
    dispatch,
  );

export const Settings = connect(
  null,
  mapDispatchToProps,
)(SettingsBase);
