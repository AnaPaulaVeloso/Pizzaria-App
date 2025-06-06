// app/carrinho.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCarrinho } from '../../../context/CarrinhoContext';
import { usePedidoInfo } from '../../../context/pedidoInfoContext';
import CarrinhoItemCard from '../../../componest/item';
import appStyles from '../../../styles/appStyles';
import { CarrinhoItem } from '../../../componest/itemModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PedidoCompleto } from '../../../model/pedidoCompleto';
import { api } from '../../../service/api_db';
import { ItemPedido } from '../../../model/itemPedido';

const CarrinhoPage = () => {
    const router = useRouter();
    const { pedidoAtual, limparPedidoInfo } = usePedidoInfo();
    const { carrinho, getTotalItens, getPrecoTotal, limparCarrinho, finalizarPedido } = useCarrinho();
    const [isLoading, setIsLoading] = useState(false);

    const handleFinalizarPedido = async () => {
        if (carrinho.length === 0) {
            Alert.alert("Carrinho Vazio", "Adicione itens ao pedido antes de finalizar.");
            return;
        }
    
        if (!pedidoAtual) {
            Alert.alert("Erro", "Informações da mesa não encontradas. Inicie um novo atendimento.");
            return;
        }
    
        setIsLoading(true);
        try {
            let pedidoAtualizado;
            let todosItens: ItemPedido[] = [];

            // Se tiver ID, tenta buscar o pedido existente
            if (pedidoAtual.id) {
                try {
                    pedidoAtualizado = await api.buscarPedidoPorId(pedidoAtual.id);
                    todosItens = [...pedidoAtualizado.itens];
                } catch (error) {
                    console.log('Pedido não encontrado, criando novo...');
                    todosItens = [];
                }
            }
            
            // Converter os itens do carrinho para instâncias de ItemPedido
            const novosItens = carrinho.map(item => new ItemPedido(
                item.id,
                pedidoAtual.id || 0,
                item.idproduto,
                item.nomeproduto,
                item.quantidade,
                item.precounitario,
                item.subtotal,
                item.tipo,
                item.observacoes
            ));

            // Combinar os itens existentes com os novos
            todosItens = [...todosItens, ...novosItens];

            // Calcular o valor total considerando todos os itens
            const valorTotal = todosItens.reduce((total, item) => total + item.subtotal, 0);

            // Criar objeto com informações do pedido
            const pedidoCompleto = new PedidoCompleto(
                pedidoAtual.id || 0,
                pedidoAtual.mesa,
                pedidoAtual.ncrachaatendente,
                pedidoAtual.nomeatendente,
                pedidoAtual.quantidadepessoas,
                'pendente',
                valorTotal,
                pedidoAtual.datahora || new Date().toISOString(),
                todosItens,
                null,
                null,
                null,
                null
            );

            // Preparar dados para a API
            const dadosParaAPI = {
                mesa: pedidoCompleto.mesa,
                n_cracha: pedidoCompleto.ncrachaatendente,
                nomeatendente: pedidoCompleto.nomeatendente,
                quantidadepessoas: pedidoCompleto.quantidadepessoas,
                status: pedidoCompleto.status,
                valortotal: pedidoCompleto.valortotal,
                itens: JSON.stringify(pedidoCompleto.itens.map(item => ({
                    id: item.id,
                    idpedido: item.idpedido,
                    idproduto: item.idproduto,
                    nomeproduto: item.nomeproduto,
                    quantidade: item.quantidade,
                    precounitario: item.precounitario,
                    subtotal: item.subtotal,
                    tipo: item.tipo,
                    observacoes: item.observacoes || null
                }))),
                observacoes: pedidoCompleto.observacoes
            };

            // Se tiver ID, tenta atualizar, senão cria um novo
            if (pedidoAtual.id) {
                await api.atualizarPedido(pedidoAtual.id, dadosParaAPI);
            } else {
                await api.iniciarPedido(dadosParaAPI);
            }

            Alert.alert(
                "Pedido Concluído!",
                `Pedido para Mesa ${pedidoAtual.mesa} adicionado ao histórico de pendentes.\n\nValor: R$ ${valorTotal.toFixed(2).replace('.', ',')}`,
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            await limparPedidoInfo();
                            await limparCarrinho();
                            router.replace('/pendentes');
                        }
                    }
                ]
            );
            
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            Alert.alert("Erro", "Não foi possível finalizar o pedido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.pageTitle}>Seu Pedido</Text>
                {pedidoAtual ? (
                    <View style={styles.pedidoInfoContainer}>
                        <Text style={styles.pedidoInfoText}>
                            Mesa: {pedidoAtual.mesa}
                        </Text>
                        <Text style={styles.pedidoInfoText}>
                            Atendente: {pedidoAtual.nomeatendente}
                        </Text>
                        <Text style={styles.pedidoInfoText}>
                            Pessoas: {pedidoAtual.quantidadepessoas}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.pedidoInfoText}>
                        Informações do pedido não disponíveis. Inicie um novo atendimento.
                    </Text>
                )}
            </View>

            {carrinho.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>
                        Seu carrinho está vazio. Adicione alguns itens!
                    </Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={carrinho}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({ item }) => {
                            const carrinhoItem: CarrinhoItem = {
                                id: item.id,
                                nome: item.nomeproduto,
                                precoUnitario: item.precounitario,
                                quantidade: item.quantidade,
                                tipo: item.tipo,
                                imagem: '',
                                observacao: undefined,
                                ...(item.tipo === 'pizza' && {
                                    bordaRecheada: item.observacoes?.includes('Borda:') 
                                        ? ((() => {
                                            const borda = item.observacoes.split('Borda:')[1].split(',')[0].trim();
                                            if (borda === 'Doce de Leite') return 'Chocolate';
                                            if (borda === 'Catupiry' || borda === 'Chocolate') return borda;
                                            return null;
                                        })() as 'Catupiry' | 'Chocolate' | null)
                                        : null
                                }),
                                ...(item.tipo === 'bebida' && {
                                    adicionaisSelecionados: item.observacoes?.includes('Adicionais:')
                                        ? item.observacoes.split('Adicionais:')[1].split(',')[0].trim().split(', ')
                                        : []
                                })
                            };

                            // Separar observações gerais dos adicionais
                            if (item.observacoes) {
                                const partes = item.observacoes.split(',');
                                const observacoesGerais = partes
                                    .filter(obs => !obs.includes('Borda:') && !obs.includes('Adicionais:'))
                                    .join(',')
                                    .trim();
                                
                                if (observacoesGerais) {
                                    carrinhoItem.observacao = observacoesGerais;
                                }
                            }

                            return <CarrinhoItemCard item={carrinhoItem} />;
                        }}
                        contentContainerStyle={styles.listContent}
                    />
                    
                    <View style={styles.footerContainer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>
                                Total: R$ {getPrecoTotal().toFixed(2).replace('.', ',')}
                            </Text>
                            <Text style={styles.itemsCount}>
                                {getTotalItens()} {getTotalItens() === 1 ? 'item' : 'itens'}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.botaoFinalizar, isLoading && styles.botaoFinalizarDisabled]}
                            onPress={handleFinalizarPedido}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.botaoFinalizarTexto}>Finalizar Pedido</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    pedidoInfoContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    pedidoInfoText: {
        fontSize: 14,
        color: '#8c030e',
        marginBottom: 4,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyCartText: {
        fontSize: 16,
        color: '#8c030e',
        textAlign: 'center',
    },
    listContent: {
        padding: 12,
    },
    footerContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalContainer: {
        marginBottom: 16,
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8c030e',
    },
    itemsCount: {
        fontSize: 14,
        color: '#8c030e',
        marginTop: 4,
    },
    botaoFinalizar: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#8c030e',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    botaoFinalizarDisabled: {
        opacity: 0.7,
    },
    botaoFinalizarTexto: {
        color: '#8c030e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 16,
        color: '#8c030e',
    },
});

export default CarrinhoPage;