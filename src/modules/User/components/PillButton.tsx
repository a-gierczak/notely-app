import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';
import { Color } from 'src/modules/UI/styles';

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 40,
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 30,
  },
  buttonTitle: {
    letterSpacing: 2.5,
    color: '#fff',
    fontWeight: '500',
  },
  buttonPrimary: {
    backgroundColor: Color.Action,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
  },
});

interface PillButtonProps extends ButtonProps {
  title: string;
  outline?: boolean;
}

export const PillButton: React.SFC<PillButtonProps> = props => (
  <Button
    {...props}
    title={props.title}
    containerStyle={styles.buttonContainer}
    buttonStyle={[styles.button, props.outline ? styles.buttonOutline : styles.buttonPrimary]}
    titleStyle={styles.buttonTitle}
  />
);
