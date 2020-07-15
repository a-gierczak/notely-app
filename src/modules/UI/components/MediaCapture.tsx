import React from 'react';
import { Permissions, ImagePicker } from 'expo';
import { View } from 'react-native';

export enum MediaCaptureError {
  PERMISSION_REJECTED = 'PERMISSION_REJECTED',
  CANCELLED = 'CANCELLED',
}

interface Props {
  onCaptureError: (error: MediaCaptureError) => void;
  onCapture: (result: ImagePicker.ImageResult) => void;
}

export class MediaCapture extends React.Component<Props> {
  async componentDidMount() {
    const { onCaptureError, onCapture } = this.props;
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      onCaptureError(MediaCaptureError.PERMISSION_REJECTED);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.cancelled) {
      onCaptureError(MediaCaptureError.CANCELLED);
      return;
    }

    onCapture(result);
  }

  render() {
    return (
      <View />
    );
  }
}
