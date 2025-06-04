import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Image } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL_ML } from '../../../service/config';
import { ItemPedido } from '../../../model/itemPedido';
import { Atendente } from '../../../model/atendente';
import { PedidoCompleto } from '../../../model/pedidoCompleto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../../styles/pedidoStyles';
import { usePedidoInfo } from '../../../context/pedidoInfoContext';
import { useCarrinho } from '../../../context/CarrinhoContext';
import { api } from '../../../service/api_db';

interface AtendenteJSON {
    n_cracha: number;
    nome: string;
    foto?: string;
}

export default function PedidoScreen() {
    const { salvarPedidoInfo, atendenteLogado, carregarAtendenteLogado, limparPedidoInfo, iniciarNovoPedido } = usePedidoInfo();
    const { pedidosPendentes, carregarPedidosPendentes } = useCarrinho();
    const [mesa, setMesa] = useState('');
    const [quantidadePessoas, setQuantidadePessoas] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Função para limpar os estados
    const limparEstados = () => {
        setMesa('');
        setQuantidadePessoas('');
        setIsLoading(false);
    };

    // Carrega os dados iniciais
    const carregarDadosIniciais = async () => {
        try {
            await carregarAtendenteLogado();
            await carregarPedidosPendentes();
            limparEstados();
        } catch (error) {
            console.error('Erro ao inicializar página:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados iniciais.');
        }
    };

    // Usa useFocusEffect para recarregar os dados quando a tela recebe foco
    useFocusEffect(
        useCallback(() => {
            carregarDadosIniciais();
            return () => {
                // Limpa os estados quando a tela perde o foco
                limparEstados();
            };
        }, [])
    );

    const handleIniciarPedido = async () => {
        if (!mesa || !quantidadePessoas) {
            Alert.alert('Erro', 'Por favor, preencha o número da mesa e a quantidade de pessoas.');
            return;
        }

        const quantidadePessoasNum = parseInt(quantidadePessoas);
        if (isNaN(quantidadePessoasNum) || quantidadePessoasNum <= 0) {
            Alert.alert('Erro', 'A quantidade de pessoas deve ser um número positivo.');
            return;
        }

        try {
            setIsLoading(true);
            await iniciarNovoPedido(mesa, quantidadePessoasNum);
            
            router.push('/(drawer)/(tabs)');
        } catch (error) {
            console.error('Erro ao iniciar pedido:', error);
            Alert.alert('Erro', 'Não foi possível iniciar o pedido. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.content}>
                <Text style={styles.title}>Novo Pedido</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mesa:</Text>
                    <TextInput
                        style={styles.input}
                        value={mesa}
                        onChangeText={setMesa}
                        keyboardType="numeric"
                        placeholder="Digite o número da mesa"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Quantidade de Pessoas:</Text>
                    <TextInput
                        style={styles.input}
                        value={quantidadePessoas}
                        onChangeText={setQuantidadePessoas}
                        keyboardType="numeric"
                        placeholder="Digite a quantidade de pessoas"
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleIniciarPedido}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Iniciando...' : 'Iniciar Pedido'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

