import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Image } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { API_BASE_URL_ML } from '../../../service/config';
import { styles } from '../../../styles/pedidoStyles';

export default function PedidoScreen() {
  const [mesa, setMesa] = useState('');
  const [quantidadePessoas, setQuantidadePessoas] = useState('');

  const handleBuscarPredicao = async () => {
    if (!mesa || !quantidadePessoas) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL_ML}${quantidadePessoas}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar previsão');
      }

      const data = await response.json();
      
      // Navega para a tela de resultado com os dados
      router.push({
        pathname: '/resultado',
        params: { predicao: JSON.stringify(data) }
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require("../../../assets/B1.png")} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Número da Mesa"
            value={mesa}
            onChangeText={setMesa}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Quantidade de Pessoas"
            value={quantidadePessoas}
            onChangeText={setQuantidadePessoas}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleBuscarPredicao}>
            <Text style={styles.buttonText}>Buscar Previsão</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

