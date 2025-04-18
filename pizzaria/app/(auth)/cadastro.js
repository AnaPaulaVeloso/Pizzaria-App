import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Atendente } from "../../model/atendente";
import { API_BASE_URL_DB } from "../../service/config";
import { useState } from "react";
import { api } from "../../service/api_db";
import styles from "../../style/Style_login&cadastro";

export default function CadastroScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [n_cracha, setN_cracha] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrarAtendente = async () => {
    try {
      if (!nome || !n_cracha || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const atendente = new Atendente(nome, n_cracha, senha);
      console.log('Dados do atendente antes do cadastro:', atendente);
      
      await api.inserirAtendente(atendente);
      alert("Atendente cadastrado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error('Erro completo:', error);
      alert("Erro ao cadastrar atendente. Por favor, tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require("../../assets/B1.png")} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          autoCorrect={false}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="N° do crachá"
          autoCorrect={false}
          keyboardType="numeric"
          onChangeText={setN_cracha}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          autoCorrect={false}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={cadastrarAtendente}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

