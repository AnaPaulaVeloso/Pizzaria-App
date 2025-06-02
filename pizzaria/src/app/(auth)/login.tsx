import { View, Text, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { api } from "../../service/api_db"; // Assumindo que api_db lida com suas chamadas de backend
import { Atendente } from "../../model/atendente";
import { authStyles } from "../../styles/authStyles";
import { Input } from "../../componest/input";
import { usePedidoInfo } from '../../context/pedidoInfoContext'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
    const router = useRouter();
    const [n_cracha, setN_cracha] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { salvarAtendenteLogado } = usePedidoInfo(); // Desestrutura para obter a função do contexto

    /**
     * Função responsável por realizar o processo de login do usuário.
     * Inclui validação de campos, chamada à API, salvamento de dados
     * no contexto e no AsyncStorage, e tratamento de erros.
     */
    const fazerLogin = async () => {
    try {
        setLoading(true); // Ativa o estado de carregamento
        setError(false); // Reseta o estado de erro

        // Validação básica dos campos de entrada
        if (!n_cracha || !senha) {
            setError(true);
            Alert.alert("Erro de Login", "Por favor, preencha todos os campos!");
            return; // Interrompe a execução se os campos estiverem vazios
        }

        // Chama a API de login com o número do crachá e a senha.
        // A API (api_db.ts) agora deve retornar o objeto JSON do atendente.
        const responseData = await api.login(parseInt(n_cracha), senha); // Garante que n_cracha é number

        console.log('Dados recebidos do login:', responseData);

        // Verifica se a resposta da API contém dados válidos para criar um Atendente
        if (responseData && responseData.n_cracha) {
            // Cria uma instância da classe Atendente a partir dos dados recebidos
            const atendenteLogado = Atendente.fromJSON(responseData);

            console.log('Instância Atendente criada:', atendenteLogado);

            // Salva as informações do atendente no contexto global do aplicativo
            // ou onde quer que 'salvarAtendenteLogado' espere um objeto Atendente
            // Certifique-se que salvarAtendenteLogado consegue lidar com uma instância da classe Atendente
            await salvarAtendenteLogado(atendenteLogado);
            console.log('Atendente logado no contexto:', atendenteLogado);

            // Salva as informações do atendente no AsyncStorage para persistência.
            // Para salvar uma instância da classe no AsyncStorage, você deve convertê-la para JSON.
            await AsyncStorage.setItem('atendente', JSON.stringify(atendenteLogado.toJSON()));
            console.log('Dados do atendente salvos no AsyncStorage (como JSON).');

            // Redireciona o atendente para a tela principal após o login
            router.push("/(drawer)/(tabs)/pedido");
        } else {
            // Caso a resposta da API não contenha dados válidos (ex: credenciais incorretas)
            Alert.alert('Erro de Login', 'Crachá ou senha incorretos.');
            setSenha(''); // Limpa o campo da senha para nova tentativa
        }
    } catch (error: any) {
        // Captura e trata quaisquer erros que ocorram durante o processo de login
        console.error('Erro no login:', error);
        setError(true); // Define o estado de erro

        // Mensagens de erro mais específicas para o atendente
        if (error.message.includes('Credenciais inválidas')) {
            Alert.alert("Erro de Login", "Crachá ou senha incorretos.");
        } else if (error.message.includes('Tempo de requisição excedido') || error.message.includes('conexão')) {
            Alert.alert("Erro de Login", "Erro de conexão. Verifique sua internet e tente novamente.");
        } else {
            Alert.alert("Erro de Login", "Erro ao fazer login. Por favor, tente novamente.");
        }
    } finally {
        setLoading(false); // Desativa o estado de carregamento, independentemente do sucesso ou falha
    }
};

    return (
        <KeyboardAvoidingView 
            style={authStyles.background}
            behavior="padding" // Ajusta o layout para evitar que o teclado cubra os inputs
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} // Permite que o ScrollView ocupe todo o espaço disponível
                keyboardShouldPersistTaps="handled" // Garante que os toques fora dos inputs não fechem o teclado
            >
                <View style={authStyles.containerLogo}>
                    <Image 
                        source={require("../../assets/B1.png")} // Caminho da imagem do logo
                        style={authStyles.logo} 
                    />
                </View>

                <View style={authStyles.container}>
                    {/* Input para o número do crachá */}
                    <Input
                        placeholder="N° do crachá"
                        autoCorrect={false}
                        keyboardType="numeric" // Define o teclado numérico
                        onChangeText={setN_cracha}
                        error={error && !n_cracha} // Exibe erro se o campo estiver vazio e houver erro
                        editable={!loading} // Desabilita o input durante o carregamento
                    />

                    {/* Input para a senha */}
                    <Input
                        placeholder="Senha"
                        secureTextEntry // Oculta os caracteres da senha
                        autoCorrect={false}
                        onChangeText={setSenha}
                        error={error && !senha} // Exibe erro se o campo estiver vazio e houver erro
                        editable={!loading} // Desabilita o input durante o carregamento
                    />

                    {/* Botão de Login */}
                    <TouchableOpacity 
                        style={[
                            authStyles.button,
                            loading && { opacity: 0.7 } // Reduz a opacidade do botão durante o carregamento
                        ]} 
                        onPress={fazerLogin}
                        disabled={loading} // Desabilita o botão durante o carregamento
                    >
                        <Text style={authStyles.buttonText}>
                            {loading ? "Entrando..." : "Entrar"} {/* Texto dinâmico do botão */}
                        </Text>
                    </TouchableOpacity>

                    {/* Link para a tela de cadastro */}
                    <TouchableOpacity 
                        onPress={() => router.push("/(auth)/cadastro")}
                        disabled={loading} // Desabilita o link durante o carregamento
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
