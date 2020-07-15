import React from 'react';
import R from 'ramda';
import { Input, InputProps } from 'react-native-elements';
import { ValidationError } from 'src/types/common';
import { StyleSheet, TextInputFocusEventData, NativeSyntheticEvent } from 'react-native';
import { Color } from 'src/modules/UI/styles';

interface ValidatedInputProps extends InputProps {
  validationMessages?: ValidationError[];
  validationName: string;
  focusedBorderColor?: string;
}

interface ValidatedInputState {
  focused: boolean;
}

const styles = StyleSheet.create({
  errorMessage: {
    color: Color.Error,
    position: 'absolute',
    bottom: -25,
    left: 5,
  },
  inputContainerError: {
    borderColor: Color.Error,
  },
});

export class ValidatedInput extends React.Component<
  ValidatedInputProps,
  ValidatedInputState
> {
  state: ValidatedInputState = {
    focused: false,
  };

  handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  getErrorMessage() {
    const { validationMessages, validationName } = this.props;

    if (!validationMessages) {
      return;
    }

    const validationError = R.find<ValidationError>(
      R.propEq('property', validationName),
      validationMessages,
    );

    if (!validationError) {
      return;
    }

    return R.pipe(
      R.prop('constraints'),
      R.values,
      R.head,
    )(validationError);
  }

  render() {
    const {
      validationName,
      validationMessages,
      inputContainerStyle,
      focusedBorderColor = Color.Action,
      ...inputProps
    } = this.props;
    const { focused } = this.state;
    const errorMessage = this.getErrorMessage();

    return (
      <Input
        {...inputProps}
        errorMessage={errorMessage}
        errorStyle={styles.errorMessage}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        inputContainerStyle={[
          inputContainerStyle,
          focused && { borderColor: focusedBorderColor },
          !!errorMessage && styles.inputContainerError,
        ]}
      />
    );
  }
}
