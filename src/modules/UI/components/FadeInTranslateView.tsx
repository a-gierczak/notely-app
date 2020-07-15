import React from 'react';
import { Animated, Easing } from 'react-native';

interface FadeInTranslateViewProps {
  opacity: number;
  translateY: number;
  duration: number;
  style?: any;
  active?: boolean;
}

interface FadeInTranslateViewState {
  opacityTiming: Animated.Value;
  translateTiming: Animated.Value;
}

export class FadeInTranslateView extends React.Component<
  FadeInTranslateViewProps,
  FadeInTranslateViewState
> {
  animation?: Animated.CompositeAnimation;

  state: FadeInTranslateViewState = {
    opacityTiming: new Animated.Value(0),
    translateTiming: new Animated.Value(0),
  };

  static defaultProps = {
    active: true,
    style: {},
  };

  componentDidUpdate(prevProps: FadeInTranslateViewProps) {
    if (this.animation && !prevProps.active && this.props.active) {
      this.animation.start();
    }
  }

  componentDidMount() {
    const { opacity, duration, translateY, active } = this.props;

    this.animation = Animated.parallel([
      Animated.timing(this.state.opacityTiming, {
        duration,
        toValue: opacity,
        easing: Easing.ease,
      }),
      Animated.timing(this.state.translateTiming, {
        duration,
        toValue: translateY,
        easing: Easing.ease,
      }),
    ]);

    if (active) {
      this.animation.start();
    }
  }

  render() {
    const { opacityTiming, translateTiming } = this.state;

    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: opacityTiming,
          transform: [{ perspective: 1000 }, { translateY: translateTiming }],
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
