import React from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  Camera as ExpoCamera,
} from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Text, Icon } from 'react-native-elements';
import {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
  NavigationActions,
} from 'react-navigation';
import { connect } from 'react-redux';
import { AppState } from 'src/types/state';
import { getActiveRoute } from 'utils/navigationUtils';
import { CapturedPicture } from 'expo-camera/build/Camera.types';

export type CapturedImage = CapturedPicture | ImageManipulator.ImageResult;

interface ConnectedProps {
  routeIsFocused: boolean;
}

interface NavigationProps {
  navigation: NavigationScreenProp<NavigationState>;
}

interface State {
  hasPermission?: boolean;
  type: string;
  isTakingImage: boolean;
  image?: CapturedImage | void;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingLeft: 10,
  },
  captureIconTouchable: {
    padding: 5,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    flexGrow: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
});

type CameraProps = ConnectedProps & NavigationProps;

export class CameraBase extends React.Component<CameraProps, State> {
  state: State = {
    type: ExpoCamera.Constants.Type.back,
    isTakingImage: false,
  };

  cameraRef: React.RefObject<ExpoCamera> = React.createRef();

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  static navigationOptions: NavigationScreenConfig<void> = () => ({
    header: null,
  })

  static getDerivedStateFromProps(props: CameraProps) {
    if (!props.routeIsFocused) {
      return { image: undefined };
    }

    return null;
  }

  handleCapture = async () => {
    const { type } = this.state;

    if (!this.cameraRef.current) {
      return;
    }

    setTimeout(() => this.setState({ isTakingImage: true }), 1);
    const image = await this.cameraRef.current
      .takePictureAsync()
      .then(capturedImage =>
        type === ExpoCamera.Constants.Type.front
          ? ImageManipulator.manipulateAsync(capturedImage.uri, [
              { flip: ImageManipulator.FlipType.Horizontal },
          ])
          : Promise.resolve(capturedImage),
      )
      .catch(() => {
        // TODO: error reporting
      });

    this.setState({ image, isTakingImage: false });
  }

  handleChangeType = () => {
    this.setState(state => ({
      type:
        state.type === ExpoCamera.Constants.Type.back
          ? ExpoCamera.Constants.Type.front
          : ExpoCamera.Constants.Type.back,
    }));
  }

  handleGoBack = () => {
    this.props.navigation.navigate({
      routeName: 'Home',
      params: {},
      action: NavigationActions.navigate({ routeName: 'Home' }),
    });
  }

  handleDiscardImage = () => this.setState({ image: undefined });

  handleApproveImage = () => {
    const { image } = this.state;
    this.props.navigation.navigate('CreatePost', { image });
  }

  render() {
    const { hasPermission, image } = this.state;
    const { routeIsFocused } = this.props;

    if (hasPermission === null) {
      return <View />;
    }

    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    if (image) {
      return (
        <View style={styles.flex}>
          <StatusBar hidden={routeIsFocused} />

          <View style={styles.container}>
            <ImageBackground
              source={{ uri: image.uri }}
              style={styles.imageBackground}
            >
              <View style={styles.topContainer}>
                <TouchableOpacity onPress={this.handleDiscardImage}>
                  <Icon color="#ffffff" name="x" type="feather" size={40} />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={styles.captureIconTouchable}
                  onPress={this.handleApproveImage}
                >
                  <Icon color="#ffffff" name="check" type="feather" size={80} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.flex}>
        <StatusBar hidden={routeIsFocused} />

        <ExpoCamera
          style={styles.flex}
          type={this.state.type}
          ref={this.cameraRef}
        >
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <TouchableOpacity onPress={this.handleGoBack}>
                <Icon
                  color="#ffffff"
                  name="chevron-left"
                  type="feather"
                  size={40}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleChangeType}>
                <Icon
                  color="#ffffff"
                  name="rotate-cw"
                  type="feather"
                  size={30}
                  containerStyle={{ padding: 5 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.captureIconTouchable}
                onPress={this.handleCapture}
              >
                <Icon color="#ffffff" name="circle" type="feather" size={80} />
              </TouchableOpacity>
            </View>
          </View>
        </ExpoCamera>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState): ConnectedProps => ({
  routeIsFocused: getActiveRoute(state.navigation).routeName === 'Camera',
});

export const Camera = connect(mapStateToProps)(CameraBase);
