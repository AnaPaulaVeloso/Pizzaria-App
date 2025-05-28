import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useCarrinho } from '../../context/CarrinhoContext';
import DetalhesPedidoModal from '../../componest/detalhesPedidoModal';
import { PedidoCompleto, PedidosAgrupados } from '../../types/pedido';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ConcluidosScreen() {
    const { pedidosPendentes } = useCarrinho();
    const [pedidosAgrupados, setPedidosAgrupados] = useState<PedidosAgrupados[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null);

    useEffect(() => {
        const concluidos = pedidosPendentes.filter(pedido => pedido.status === 'entregue');

        // Ordena os pedidos por data de finalização
        const pedidosOrdenados = [...concluidos].sort((a, b) => {
            // Verifica se ambos têm dataHoraFinalizacao
            if (a.dataHoraFinalizacao && b.dataHoraFinalizacao) {
                return new Date(a.dataHoraFinalizacao).getTime() - new Date(b.dataHoraFinalizacao).getTime();
            }
            // Se um deles não tem data, coloca no final
            if (!a.dataHoraFinalizacao) return 1;
            if (!b.dataHoraFinalizacao) return -1;
            return 0;
        });

        // Agrupa os pedidos por data
        const grupos: PedidosAgrupados[] = [];
        let grupoAtual: PedidosAgrupados | null = null;

        pedidosOrdenados.forEach(pedido => {
            // Verifica se tem data de finalização antes de usar
            if (!pedido.dataHoraFinalizacao) return;

            const dataFormatada = new Date(pedido.dataHoraFinalizacao).toLocaleDateString('pt-BR');

            if (!grupoAtual || grupoAtual.data !== dataFormatada) {
                if (grupoAtual) {
                    grupos.push(grupoAtual);
                }
                grupoAtual = {
                    data: dataFormatada,
                    pedidos: [pedido]
                };
            } else {
                grupoAtual.pedidos.push(pedido);
            }
        });

        // Adiciona o último grupo se existir
        if (grupoAtual) {
            grupos.push(grupoAtual);
        }

        setPedidosAgrupados(grupos);
    }, [pedidosPendentes]);

    const handlePedidoPress = (pedido: PedidosAgrupados) => {
        setPedidoSelecionado(pedido);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: PedidosAgrupados }) => (
        <View style={styles.grupoContainer}>
            <Text style={styles.dataHeader}>{item.data}</Text>
            {item.pedidos.map((pedido, index) => (
                <View key={pedido.id} style={styles.pedidoContainer}>
                    <Text style={styles.mesaText}>Mesa: {pedido.mesa}</Text>
                    <Text style={styles.atendenteText}>Atendente: {pedido.nome_atendente}</Text>
                    <Text style={styles.valorText}>Valor Total: R$ {pedido.valorTotal.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
             <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    marginBottom: 16
                }}
            >
                <Ionicons name="arrow-back" size={24} color="#8c030e" />
                <Text style={{ marginLeft: 8, color: '#8c030e', fontSize: 16 }}>Voltar</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Histórico de Pedidos Concluídos</Text>
            
            {pedidosAgrupados.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Nenhum pedido concluído encontrado
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pedidosAgrupados}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.data}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <DetalhesPedidoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                pedido={pedidoSelecionado ? {
                    mesa: pedidoSelecionado.mesa,
                    nome_atendente: pedidoSelecionado.nome_atendente,
                    quantidadePessoas: pedidoSelecionado.quantidadePessoas,
                    itens: pedidoSelecionado.pedidos.flatMap((p: any) => p.itens),
                    valorTotal: pedidoSelecionado.valorTotal,
                    dataHora: pedidoSelecionado.dataHoraFinalizacao
                } : null}
                modo="concluido"
            />
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
    grupoContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dataHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    pedidoContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
        marginTop: 12,
    },
    mesaText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    atendenteText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    valorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2ecc71',
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
}); 