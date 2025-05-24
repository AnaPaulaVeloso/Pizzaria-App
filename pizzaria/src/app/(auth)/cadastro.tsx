import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
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
    const [foto, setFoto] = useState('');
    const [error, setError] = useState(false);

    const pickImage = async () => {
        try {
            // Solicitar permissões
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos de permissão para acessar suas fotos!');
                return;
            }

            // Abrir seletor de imagem
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!result.canceled) {
                setFoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            alert('Erro ao selecionar imagem. Tente novamente.');
        }
    };

    const cadastrarAtendente = async () => {
        try {
            if (!nome || !n_cracha || !senha || !foto) {
                setError(true);
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const atendente = new Atendente(nome, n_cracha, senha, foto);
            console.log('Dados do atendente antes do cadastro:', atendente);
            
            await api.inserirAtendente(atendente);
            alert("Atendente cadastrado com sucesso!");
            router.push("./login");
        } catch (error) {
            console.error('Erro completo:', error);
            alert("Erro ao cadastrar atendente. Por favor, tente novamente.");
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