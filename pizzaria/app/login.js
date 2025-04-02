import { View, Text, Button, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL_DB } from "../service/config";
import Atendente from '../model/atendente';
import { useState } from "react";
import { api } from "../service/api_db";
import styles from "../style/Style_login&cadastro";
import { router } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [n_cracha, setN_cracha] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = async () => {
    try {
      if (!n_cracha || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      await api.login(parseInt(n_cracha), senha);
      router.push("/pedido");
    } catch (error) {
      console.error('Erro no login:', error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require("../assets/B1.png" )} style={styles.logo} /> 
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Numero do cracha"
          autoCorrect={false}
          keyboardType="numeric"
          value={n_cracha}
          onChangeText={setN_cracha}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCorrect={false}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        
        <TouchableOpacity style={styles.button} onPress={() => router.push("/PagGarconete")}> 
          {/* // fazerLogin é a função que faz o login que o leo crio  */}
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        

        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


