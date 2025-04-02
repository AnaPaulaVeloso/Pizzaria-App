// src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { estilobutao } from '../style/estilobutao';

const Butao = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[estilobutao.button, style]}>
      <Text style={[estilobutao.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};


export default Butao;