import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { api } from "../../service/api_db";
import { authStyles } from "../../styles/authStyles";
import { Input } from "../../componest/input";

export default function LoginScreen() {
    const router = useRouter();
    const [n_cracha, setN_cracha] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(false);

    const fazerLogin = async () => {
        try {
            if (!n_cracha || !senha) {
                setError(true);
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const response = await api.login(n_cracha, senha);
            console.log('Login bem sucedido:', response);
            
            // Aqui você pode salvar o token ou informações do usuário
            // e navegar para a tela principal  
            router.push("/(tabs)");
        } catch (error) {
            console.error('Erro no login:', error);
            alert("Credenciais inválidas. Por favor, tente novamente.");
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
                        onPress={fazerLogin}
                       // onPress={() => {router.push("/(drawer)/(tabs)")}}
                    >
                        <Text style={authStyles.buttonText}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/(auth)/cadastro")}
                    >
                        <Text style={authStyles.linkText}>Não tem uma conta? Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


