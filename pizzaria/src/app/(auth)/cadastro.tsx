import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Atendente } from "../../model/atendente";
import { useState } from "react";
import { api } from "../../service/api_db";
import { authStyles } from "../../styles/authStyles";
import { Input } from "../../componest/input";

export default function CadastroScreen() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [n_cracha, setN_cracha] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(false);

    const cadastrarAtendente = async () => {
        try {
            if (!nome || !n_cracha || !senha) {
                setError(true);
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const atendente = new Atendente(nome, n_cracha, senha);
            console.log('Dados do atendente antes do cadastro:', atendente);
            
            await api.inserirAtendente(atendente);
            alert("Atendente cadastrado com sucesso!");
            router.push("/(auth)/login");
        } catch (error) {
            console.error('Erro completo:', error);
            alert("Erro ao cadastrar atendente. Por favor, tente novamente.");
        }
    };

    return (
        <KeyboardAvoidingView 
            style={authStyles.background}
            behavior="padding"
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={authStyles.containerLogo}>
                    <Image 
                        source={require("../../assets/B1.png")} 
                        style={authStyles.logo} 
                    />
                </View>

                <View style={authStyles.container}>
                    <Input
                        placeholder="Nome"
                        autoCorrect={false}
                        onChangeText={setNome}
                        error={error && !nome}
                    />

                    <Input
                        placeholder="N° do crachá"
                        autoCorrect={false}
                        keyboardType="numeric"
                        onChangeText={setN_cracha}
                        error={error && !n_cracha}
                    />

                    <Input
                        placeholder="Senha"
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={setSenha}
                        error={error && !senha}
                    />

                    <TouchableOpacity 
                        style={authStyles.button} 
                        onPress={cadastrarAtendente}
                    >
                        <Text style={authStyles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text style={authStyles.linkText}>Já tem uma conta? Faça login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
} 