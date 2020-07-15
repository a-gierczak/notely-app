import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import { LoginScreen } from 'modules/User/LoginScreen';
import { Home } from 'modules/Home/Home';
import { Settings } from 'modules/Settings/Settings';
import { CreatePost } from 'modules/CreatePost/CreatePost';
import { TagInput } from 'modules/TagInput/TagInput';
import { PostView } from 'PostView/PostView';
import { Icon, IconProps } from 'react-native-elements';
import { Color } from 'UI/styles';
import { FullScreenLoader } from 'UI/components/FullScreenLoader';
import { PostCategoryContainer } from 'src/modules/PostCategory/PostCategoryContainer';
import { WelcomeScreen } from 'src/modules/User/components/WelcomeScreen';
import { RegisterScreen } from 'src/modules/User/components/RegisterScreen';
import { Camera } from 'src/modules/CreatePost/components/Camera';

const HomeStackNavigator = createStackNavigator(
  {
    Home,
    PostView,
    TagInput,
    CreatePost,
    PostCategory: PostCategoryContainer,
  },
  {
    initialRouteName: 'Home',
  },
);

const AuthStackNavigator = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
  },
  {
    initialRouteName: 'Welcome',
  },
);

const SettingsStackNavigator = createStackNavigator(
  {
    Settings,
  },
  {
    initialRouteName: 'Settings',
  },
);

const CameraNavigator = createStackNavigator(
  {
    Camera,
  },
  {
    initialRouteName: 'Camera',
  },
);

CameraNavigator.navigationOptions = {
  tabBarVisible: false,
};

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStackNavigator,
    Camera: CameraNavigator,
    Settings: SettingsStackNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
      tabBarIcon: ({ tintColor }) => {
        const getIconProps = (routeName: string): IconProps => {
          switch (routeName) {
            case 'Home':
              return { name: 'home' };
            case 'Settings':
              return { name: 'settings' };
            case 'Camera':
              return {
                name: 'camera',
                type: 'feather',
                color: '#FFFFFF',
                containerStyle: {
                  backgroundColor: Color.Primary,
                  width: 45,
                  height: 45,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              };
            default:
              return { name: '' };
          }
        };

        const { routeName } = navigation.state;
        const defaultTintColor = Color.LightGrey;
        return (
          <Icon
            color={tintColor || defaultTintColor}
            {...getIconProps(routeName)}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: Color.MediumGrey,
      inactiveTintColor: Color.LightGrey,
      showLabel: false,
      style: {
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderTopWidth: 0,
      },
    },
  },
);

export enum RouteIndex {
  APP,
  AUTH,
  LOADING,
}

export const AppNavigator = createSwitchNavigator(
  {
    App: TabNavigator,
    Auth: AuthStackNavigator,
    Loading: FullScreenLoader,
  },
  {
    initialRouteName: 'Loading',
  },
);
