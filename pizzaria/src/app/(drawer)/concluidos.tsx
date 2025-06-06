import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, RefreshControl, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCarrinho } from '../../context/CarrinhoContext';
import FinalizarAtendimentoModal from '../../componest/finalizarAtendimentoModal';
import { api } from '../../service/api_db';
import { PedidoCompleto } from '../../model/pedidoCompleto';

interface PedidosAgrupados {
    mesa: string;
    atendente: string;
    pedidos: PedidoCompleto[];
    totalItens: number;
    valorTotal: number;
    quantidadePessoas: number;
    dataHoraFinalizacao: string;
}

export default function PedidosConcluidosScreen() {
    const router = useRouter();
    const { carregarPedidosPendentes } = useCarrinho();
    const [pedidosAgrupados, setPedidosAgrupados] = useState<PedidosAgrupados[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidosAgrupados | null>(null);
    const [loading, setLoading] = useState(false);

    const carregarPedidos = async () => {
        try {
            setLoading(true);
            const pedidosConcluidos = await api.listarPedidos('Finalizado');
            console.log('Pedidos concluídos carregados:', pedidosConcluidos);

            // Primeiro, ordena os pedidos por mesa e data de finalização
            const pedidosOrdenados = [...pedidosConcluidos].filter(pedido => pedido.id > 0).sort((a, b) => {
                if (a.mesa.toString() !== b.mesa.toString()) {
                    return a.mesa.toString().localeCompare(b.mesa.toString());
                }
                return new Date(a.datahorafinalizacao ?? '').getTime() - new Date(b.datahorafinalizacao ?? '').getTime();
            });

            // Agrupa os pedidos
            const grupos: PedidosAgrupados[] = [];
            let grupoAtual: PedidosAgrupados | null = null;

            pedidosOrdenados.forEach(pedido => {
                if (!pedido.id) {
                    console.warn('Pedido sem ID encontrado:', pedido);
                    return;
                }

                const dataPedido = new Date(pedido.datahorafinalizacao ?? '').getTime();

                // Se não há grupo atual ou se é uma mesa diferente, cria um novo grupo
                if (!grupoAtual || grupoAtual.mesa !== pedido.mesa.toString()) {
                    if (grupoAtual) {
                        grupos.push(grupoAtual);
                    }
                    grupoAtual = {
                        mesa: pedido.mesa.toString(),
                        atendente: pedido.nomeatendente,
                        pedidos: [pedido],
                        totalItens: pedido.itens.length,
                        valorTotal: pedido.valortotal,
                        quantidadePessoas: pedido.quantidadepessoas,
                        dataHoraFinalizacao: pedido.datahorafinalizacao ?? ''
                    };
                } else {
                    // Verifica se o pedido atual está dentro da tolerância de tempo (1 minuto)
                    const dataGrupoAtual = new Date(grupoAtual.dataHoraFinalizacao).getTime();
                    const diferencaTempo = Math.abs(dataPedido - dataGrupoAtual);
                    const umMinutoEmMs = 60 * 1000;

                    if (diferencaTempo <= umMinutoEmMs) {
                        // Adiciona ao grupo atual
                        grupoAtual.pedidos.push(pedido);
                        grupoAtual.totalItens += pedido.itens.length;
                        grupoAtual.valorTotal += pedido.valortotal;
                        // Mantém a data de finalização mais recente
                        if (dataPedido > dataGrupoAtual) {
                            grupoAtual.dataHoraFinalizacao = pedido.datahorafinalizacao ?? '';
                        }
                    } else {
                        // Finaliza o grupo atual e cria um novo
                        grupos.push(grupoAtual);
                        grupoAtual = {
                            mesa: pedido.mesa.toString(),
                            atendente: pedido.nomeatendente,
                            pedidos: [pedido],
                            totalItens: pedido.itens.length,
                            valorTotal: pedido.valortotal,
                            quantidadePessoas: pedido.quantidadepessoas,
                            dataHoraFinalizacao: pedido.datahorafinalizacao ?? ''
                        };
                    }
                }
            });

            // Adiciona o último grupo se existir
            if (grupoAtual) {
                grupos.push(grupoAtual);
            }

            // Ordena os grupos por data de finalização (mais recente primeiro)
            const ordenados = grupos.sort((a, b) => 
                new Date(b.dataHoraFinalizacao).getTime() - new Date(a.dataHoraFinalizacao).getTime()
            );

            setPedidosAgrupados(ordenados);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os pedidos concluídos.');
            setPedidosAgrupados([]);
        } finally {
            setLoading(false);
        }
    };

    // Usa useFocusEffect para recarregar os pedidos quando a tela recebe foco
    useFocusEffect(
        useCallback(() => {
            carregarPedidos();
        }, [])
    );

    const handlePedidoPress = (pedido: PedidosAgrupados) => {
        if (!pedido.pedidos[0] || !pedido.pedidos[0].id) {
            Alert.alert('Erro', 'Pedido inválido');
            return;
        }
        setPedidoSelecionado(pedido);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setPedidoSelecionado(null);
    };

    const handleConfirmarFinalizacao = () => {
        handleModalClose();
    };

    const renderPedido = ({ item }: { item: PedidosAgrupados }) => {
        if (!item.pedidos[0] || !item.pedidos[0].id) {
            return null;
        }
        
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => handlePedidoPress(item)}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.mesaText}>Mesa {item.mesa || '-'}</Text>
                    <Text style={styles.horaText}>
                        {item.dataHoraFinalizacao ? new Date(item.dataHoraFinalizacao).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '-'}
                    </Text>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.infoText}>
                        {item.totalItens || 0} {item.totalItens === 1 ? 'item' : 'itens'}
                    </Text>
                    <Text style={styles.valorText}>
                        R$ {(item.valorTotal || 0).toFixed(2).replace('.', ',')}
                    </Text>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.atendenteText}>
                        Iniciado por: {item.atendente || 'Não informado'}
                    </Text>
                    <Text style={styles.atendenteText}>
                        Finalizado por: {item.pedidos[0]?.nomeatendentefinalizador || 'Não informado'}
                    </Text>
                    <Text style={styles.statusText}>
                        Finalizado em: {item.dataHoraFinalizacao ? new Date(item.dataHoraFinalizacao).toLocaleString('pt-BR') : 'Não informado'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.push('/(tabs)')}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#8c030e" />
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Pedidos Concluídos</Text>
            </View>

            {pedidosAgrupados.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Nenhum pedido concluído no momento.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pedidosAgrupados}
                    renderItem={renderPedido}
                    keyExtractor={(item) => `${item.mesa}-${item.dataHoraFinalizacao}`}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={carregarPedidos}
                        />
                    }
                />
            )}

            {pedidoSelecionado && (
                <FinalizarAtendimentoModal
                    visible={modalVisible}
                    mesa={pedidoSelecionado.mesa}
                    pedido={pedidoSelecionado}
                    onClose={handleModalClose}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        padding: 16,
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    mesaText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8c030e',
    },
    horaText: {
        fontSize: 16,
        color: '#666',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    valorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    atendenteText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statusText: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: '500',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 8,
        color: '#8c030e',
        fontSize: 16,
    },
}); 