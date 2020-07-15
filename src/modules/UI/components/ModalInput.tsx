import * as React from 'react';
import noop from 'lodash/noop';
import { View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { FadeInTranslateView } from './FadeInTranslateView';

const INPUT_TRANSLATE_Y = 50;

export interface ModalInputProps {
  onTextChange: (value: string) => void;
  value: string;
  placeholder?: string;
  onModalHide?: () => void;
}

interface ModalInputState {
  modalMode: boolean;
}

const styles = StyleSheet.create({
  screenModal: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    zIndex: 10,
    paddingTop: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputContainerModal: {
    width: '100%',
    marginBottom: 15,
    transform: [
      { perspective: 1000 },
      { translateY: INPUT_TRANSLATE_Y },
    ],
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    backgroundColor: '#fff',
  },
  childrenContainer: {
    paddingHorizontal: 10,
  },
});

export class ModalInput extends React.Component<ModalInputProps, ModalInputState> {
  state: ModalInputState = {
    modalMode: false,
  };

  static defaultProps = {
    placeholder: '',
  };

  handleInputFocus = () => this.setState({ modalMode: true });

  handleInputBlur = () => this.setState(
    { modalMode: false },
    this.props.onModalHide || noop,
  )

  render() {
    const { modalMode } = this.state;
    const { value, onTextChange, placeholder } = this.props;

    if (modalMode) {
      return (
        <>
          <View style={styles.backdrop} />
          <View style={styles.screenModal}>

            <FadeInTranslateView
              opacity={1}
              translateY={-INPUT_TRANSLATE_Y}
              duration={250}
            >
              <Input
                containerStyle={styles.inputContainerModal}
                placeholder={placeholder}
                value={value}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChangeText={onTextChange}
                autoFocus
              />
            </FadeInTranslateView>

            {this.props.children && (
              <View style={styles.childrenContainer}>
                {this.props.children}
              </View>
            )}
          </View>
        </>
      );
    }

    return (
      <Input
        containerStyle={styles.inputContainer}
        placeholder={placeholder}
        value={value}
        onChangeText={onTextChange}
        onFocus={this.handleInputFocus}
        onBlur={this.handleInputBlur}
      />
    );
  }
}
