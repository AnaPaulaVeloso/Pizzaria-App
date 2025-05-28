import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { api } from "../../service/api_db";
import { authStyles } from "../../styles/authStyles";
import { Input } from "../../componest/input";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
    const router = useRouter();
    const [n_cracha, setN_cracha] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fazerLogin = async () => {
        try {
            setLoading(true);
            setError(false);

            if (!n_cracha || !senha) {
                setError(true);
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const response = await api.login(n_cracha, senha);
            console.log('Login bem sucedido:', response);
            
            // Salva os dados do usuário no AsyncStorage
            await AsyncStorage.setItem('user_n_cracha', n_cracha);
            await AsyncStorage.setItem('user_data', JSON.stringify(response));
            router.push("/pedido");
            
            // router.push("/(drawer)/(tabs)");
        } catch (error: any) {
            console.error('Erro no login:', error);
            setError(true);
            
            if (error.message === 'Usuário não encontrado') {
                alert("Usuário não encontrado. Verifique o número do crachá.");
            } else if (error.message === 'Senha incorreta') {
                alert("Senha incorreta. Por favor, tente novamente.");
            } else if (error.message.includes('conexão')) {
                alert("Erro de conexão. Verifique sua internet e tente novamente.");
            } else {
                alert("Erro ao fazer login. Por favor, tente novamente.");
            }
        } finally {
            setLoading(false);
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
                        editable={!loading}
                    />

                    <Input
                        placeholder="Senha"
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={setSenha}
                        error={error && !senha}
                        editable={!loading}
                    />

                    <TouchableOpacity 
                        style={[
                            authStyles.button,
                            loading && { opacity: 0.7 }
                        ]} 
                        onPress={fazerLogin}
                        disabled={loading}
                    >
                        <Text style={authStyles.buttonText}>
                            {loading ? "Entrando..." : "Entrar"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/(auth)/cadastro")}
                        disabled={loading}
                    >
                        <Text style={authStyles.linkText}>
                            Não tem uma conta? Cadastre-se
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


