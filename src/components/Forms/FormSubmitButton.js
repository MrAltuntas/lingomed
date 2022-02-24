import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import GlobalStyles from '../../style/Global'

const FormSubmitButton = ({ title, submitting, onPress }) => {
  const backgroundColor = submitting
    ? '#075CAB'
    : '#2174c2';

  return (
    <TouchableOpacity
      onPress={!submitting ? onPress : null}
      style={[GlobalStyles.button, { backgroundColor }]}
    >
      <Text style={GlobalStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FormSubmitButton;