import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCarrinho } from '../../context/CarrinhoContext';
import { usePedidoInfo } from '../../context/pedidoInfoContext';
import DetalhesPedidoModal from '../../componest/detalhesPedidoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PedidoCompleto } from '../../model/pedidoCompleto';
import { api } from '../../service/api_db';

interface PedidosAgrupados {
    mesa: number;
    atendente: string;
    pedidos: PedidoCompleto[];
    totalItens: number;
    valorTotal: number;
    quantidadepessoas: number;
    datahora: string;
}

export default function PendentesScreen() {
    const [pedidosAgrupados, setPedidosAgrupados] = useState<PedidosAgrupados[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<PedidoCompleto | null>(null);
    const { atendenteLogado } = usePedidoInfo();
    const router = useRouter();
    const { carregarPedidosPendentes, limparCarrinho, adicionarAoCarrinho } = useCarrinho();
    const { salvarPedidoAtual } = usePedidoInfo();

    const carregarPedidos = async () => {
        try {
            setLoading(true);
            // Busca os pedidos pendentes diretamente da API
            const pedidosPendentes = await api.listarPedidos('pendente');
            console.log('Pedidos pendentes carregados da API:', pedidosPendentes);

            // Agrupa os pedidos por mesa
            const grupos: { [key: string]: PedidosAgrupados } = {};
            
            pedidosPendentes.forEach((pedido: PedidoCompleto) => {
                if (!grupos[pedido.mesa]) {
                    grupos[pedido.mesa] = {
                        mesa: pedido.mesa,
                        atendente: pedido.nomeatendente,
                        pedidos: [],
                        totalItens: 0,
                        valorTotal: 0,
                        quantidadepessoas: pedido.quantidadepessoas || 1,
                        datahora: pedido.datahora || new Date().toISOString()
                    };
                }
                
                grupos[pedido.mesa].pedidos.push(pedido);
                grupos[pedido.mesa].totalItens += pedido.itens.length;
                grupos[pedido.mesa].valorTotal += pedido.valortotal;
            });

            // Converte o objeto de grupos em array e ordena por mesa
            const pedidosAgrupadosArray = Object.values(grupos).sort((a, b) => 
                a.mesa - b.mesa
            );

            setPedidosAgrupados(pedidosAgrupadosArray);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os pedidos pendentes.');
            setPedidosAgrupados([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarPedidos();
        }, [])
    );

    const handlePedidoPress = (pedido: PedidoCompleto) => {
        setSelectedPedido(pedido);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedPedido(null);
        // Recarrega os pedidos ao fechar o modal
        carregarPedidos();
    };

    const handleFinalizar = async () => {
        if (!selectedPedido || !atendenteLogado) {
            Alert.alert('Erro', 'Dados do pedido ou atendente não encontrados.');
            return;
        }

        try {
            // Chama a API para finalizar o pedido
            await api.finalizarPedido(
                selectedPedido.id,
                atendenteLogado.n_cracha,
                atendenteLogado.nome
            );
            
            // Fecha o modal
            handleModalClose();
            
            // Navega para a página de concluídos
            router.push('/(drawer)/concluidos');
            
            Alert.alert('Sucesso', 'Pedido finalizado com sucesso!');
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            Alert.alert('Erro', 'Não foi possível finalizar o pedido.');
        }
    };

    const handleAdicionarItens = async () => {
        if (!selectedPedido) {
            Alert.alert('Erro', 'Dados do pedido não encontrados.');
            return;
        }

        try {
            // Busca o pedido atualizado do banco
            const pedidoAtualizado = await api.buscarPedidoPorId(selectedPedido.id);
            
            // Salva o pedido no contexto
            await salvarPedidoAtual(pedidoAtualizado);

            // Limpa o carrinho para começar do zero
            await limparCarrinho();

            // Adiciona os itens existentes ao carrinho
            if (pedidoAtualizado.itens && pedidoAtualizado.itens.length > 0) {
                for (const item of pedidoAtualizado.itens) {
                    await adicionarAoCarrinho(item);
                }
            }

            handleModalClose();
            router.push('/(tabs)');
        } catch (error: any) {
            console.error('Erro ao preparar para adicionar itens:', error);
            Alert.alert('Erro', 'Não foi possível preparar o carrinho para novos itens.');
        }
    };

    const renderPedido = ({ item }: { item: PedidosAgrupados }) => (
        <TouchableOpacity
            style={styles.pedidoCard}
            onPress={() => handlePedidoPress(item.pedidos[0])}
        >
            <View style={styles.pedidoHeader}>
                <Text style={styles.mesaText}>Mesa {item.mesa}</Text>
                <Text style={styles.statusText}>Pendente</Text>
            </View>
            <View style={styles.pedidoInfo}>
                <Text style={styles.infoText}>Atendente: {item.atendente || '-'}</Text>
                <Text style={styles.infoText}>
                    Pessoas: {item.quantidadepessoas || 0}
                </Text>
                <Text style={styles.infoText}>
                    Total de Itens: {item.totalItens || 0}
                </Text>
                <Text style={styles.valorText}>
                    Total: R$ {(item.valorTotal || 0).toFixed(2).replace('.', ',')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#8c030e" />
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Pedidos Pendentes</Text>
            </View>

            {pedidosAgrupados.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Nenhum pedido pendente no momento.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pedidosAgrupados}
                    renderItem={renderPedido}
                    keyExtractor={(item) => item.mesa.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={carregarPedidos}
                        />
                    }
                />
            )}

            {selectedPedido && atendenteLogado && (
                <DetalhesPedidoModal
                    visible={modalVisible}
                    onClose={handleModalClose}
                    pedido={selectedPedido}
                    onFinalizar={handleFinalizar}
                    onAdicionarItens={handleAdicionarItens}
                    modo="pendente"
                    atendenteLogado={{
                        n_cracha: atendenteLogado.n_cracha,
                        nome: atendenteLogado.nome
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButtonText: {
        marginLeft: 8,
        color: '#8c030e',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        padding: 16,
    },
    pedidoCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    mesaText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statusText: {
        fontSize: 16,
        color: '#28a745',
        fontWeight: 'bold',
    },
    pedidoInfo: {
        marginTop: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    valorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});