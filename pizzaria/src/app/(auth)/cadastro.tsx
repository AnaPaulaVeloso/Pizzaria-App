import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
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
    const [foto, setFoto] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Permissão Necessária",
                    "Precisamos de permissão para acessar suas fotos para o cadastro."
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.8,
            });

            if (!result.canceled) {
                setFoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert(
                "Erro",
                "Não foi possível selecionar a imagem. Tente novamente."
            );
        }
    };

    const validarCampos = (): boolean => {
        if (!nome.trim()) {
            Alert.alert("Erro", "Por favor, informe seu nome.");
            return false;
        }

        if (!n_cracha.trim()) {
            Alert.alert("Erro", "Por favor, informe o número do crachá.");
            return false;
        }

        const nCrachaNum = parseInt(n_cracha);
        if (isNaN(nCrachaNum) || nCrachaNum <= 0) {
            Alert.alert("Erro", "O número do crachá deve ser um número positivo.");
            return false;
        }

        if (!senha.trim()) {
            Alert.alert("Erro", "Por favor, informe uma senha.");
            return false;
        }

        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return false;
        }

        if (!foto) {
            Alert.alert("Erro", "Por favor, selecione uma foto para o cadastro.");
            return false;
        }

        return true;
    };

    const cadastrarAtendente = async () => {
        try {
            if (!validarCampos()) {
                return;
            }

            setIsLoading(true);
            const nCrachaNum = parseInt(n_cracha);
            
            const atendente = new Atendente(
                nCrachaNum,
                nome.trim(),
                senha,
                foto
            );

            await api.inserirAtendente(atendente);
            
            Alert.alert(
                "Sucesso",
                "Atendente cadastrado com sucesso!",
                [
                    {
                        text: "OK",
                        onPress: () => router.push("/(auth)/login")
                    }
                ]
            );
        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            Alert.alert(
                "Erro",
                error.message || "Não foi possível cadastrar o atendente. Tente novamente."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={authStyles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={authStyles.containerLogo}>
                    {foto ? (
                        <Image 
                            source={{ uri: foto }} 
                            style={[authStyles.logo, { borderRadius: 75 }]} 
                        />
                    ) : (
                        <Image 
                            source={require("../../assets/B1.png")} 
                            style={authStyles.logo} 
                        />
                    )}
                    <TouchableOpacity 
                        style={authStyles.button}
                        onPress={pickImage}
                        disabled={isLoading}
                    >
                        <Text style={authStyles.buttonText}>
                            {foto ? "Alterar Foto" : "Selecionar Foto"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={authStyles.container}>
                    <Input
                        placeholder="Nome"
                        autoCorrect={false}
                        onChangeText={setNome}
                        value={nome}
                        error={error && !nome.trim()}
                        editable={!isLoading}
                    />

                    <Input
                        placeholder="N° do crachá"
                        autoCorrect={false}
                        keyboardType="numeric"
                        onChangeText={setN_cracha}
                        value={n_cracha}
                        error={error && !n_cracha.trim()}
                        editable={!isLoading}
                    />

                    <Input
                        placeholder="Senha"
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={setSenha}
                        value={senha}
                        error={error && !senha.trim()}
                        editable={!isLoading}
                    />

                    <TouchableOpacity 
                        style={[
                            authStyles.button,
                            isLoading && { opacity: 0.7 }
                        ]} 
                        onPress={cadastrarAtendente}
                        disabled={isLoading}
                    >
                        <Text style={authStyles.buttonText}>
                            {isLoading ? "Cadastrando..." : "Cadastrar"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/(auth)/login")}
                        disabled={isLoading}
                    >
                        <Text style={authStyles.linkText}>Já tem uma conta? Faça login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
} 