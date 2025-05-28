import React from 'react';
import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCarrinho } from '../../../context/CarrinhoContext';
import appStyles from '../../../styles/appStyles';
import Botao from '../../../componest/botao';

export default function CarrinhoScreen() {
    const router = useRouter();
    const { carrinho, atualizarQuantidade, removerDoCarrinho, finalizarPedido, pedidosPendentes } = useCarrinho();

    const calcularTotal = () => {
        return carrinho.reduce((total, item) => {
            return total + (item.precoUnitario * item.quantidade);
        }, 0);
    };

    const handleFinalizarPedido = async () => {
        const pedidoAtual = pedidosPendentes[0];
        if (!pedidoAtual) {
            router.push('/(auth)/pedido');
            return;
        }

        const sucesso = await finalizarPedido({
            mesa: pedidoAtual.mesa,
            n_cracha_atendente: pedidoAtual.n_cracha_atendente,
            nome_atendente: pedidoAtual.nome_atendente,
            quantidadePessoas: pedidoAtual.quantidadePessoas,
            dataInicio: pedidoAtual.dataInicio,
            dataHoraFinalizacao: null
        });

        if (sucesso) {
            router.push('/(auth)/pedido');
        }
    };

    if (carrinho.length === 0) {
        return (
            <SafeAreaView style={[appStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
                <Botao
                    texto="Voltar ao Cardápio"
                    onPress={() => router.back()}
                    style={StyleSheet.flatten([appStyles.botao, { marginTop: 20 }])}
                    textoStyle={appStyles.botaoTexto}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={appStyles.container}>
            <ScrollView style={styles.scrollView}>
                
                
                {carrinho.map((item) => (
                    <View key={item.id} style={styles.itemContainer}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemName}>{item.nome}</Text>
                            <TouchableOpacity 
                                onPress={() => removerDoCarrinho(item.id, item.tipo)}
                                style={styles.removeButton}
                            >
                                <Text style={styles.removeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.itemDetails}>
                            <Text style={styles.itemPrice}>
                                R$ {item.precoUnitario.toFixed(2).replace('.', ',')}
                            </Text>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity 
                                    style={styles.quantityButton}
                                    onPress={() => atualizarQuantidade(item.id, item.tipo, Math.max(1, item.quantidade - 1))}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>
                                
                                <Text style={styles.quantityText}>{item.quantidade}</Text>
                                
                                <TouchableOpacity 
                                    style={styles.quantityButton}
                                    onPress={() => atualizarQuantidade(item.id, item.tipo, item.quantidade + 1)}
                                >
                                    <Text style={styles.quantityButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {item.observacao && (
                            <Text style={styles.observacao}>Obs: {item.observacao}</Text>
                        )}
                        
                        {item.bordaRecheada && (
                            <Text style={styles.observacao}>Borda: {item.bordaRecheada}</Text>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>
                        R$ {calcularTotal().toFixed(2).replace('.', ',')}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Botao
                        texto="Pedido Pendente"
                        onPress={() => {
                            const pedidoAtual = pedidosPendentes[0];
                            if (pedidoAtual) {
                                finalizarPedido({
                                    mesa: pedidoAtual.mesa,
                                    n_cracha_atendente: pedidoAtual.n_cracha_atendente,
                                    nome_atendente: pedidoAtual.nome_atendente,
                                    quantidadePessoas: pedidoAtual.quantidadePessoas,
                                    dataInicio: pedidoAtual.dataInicio,
                                    dataHoraFinalizacao: null
                                });
                            }
                        }}
                        style={StyleSheet.flatten([
                            appStyles.botao,
                            styles.pendingButton,
                            { width: '48%' }
                        ])}
                        textoStyle={[appStyles.botaoTexto, { color: '#fff' }]}
                    />
                    <Botao
                        texto="Finalizar Pedido"
                        onPress={handleFinalizarPedido}
                        style={StyleSheet.flatten([
                            appStyles.botao,
                            styles.finishButton,
                            { width: '48%' }
                        ])}
                        textoStyle={[appStyles.botaoTexto, { color: '#fff' }]}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    removeButton: {
        padding: 4,
    },
    removeButtonText: {
        fontSize: 24,
        color: '#8C030E',
        fontWeight: 'bold',
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 16,
        color: '#8C030E',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        color: '#333',
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12,
        color: '#333',
    },
    observacao: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        fontStyle: 'italic',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 24,
        color: '#8C030E',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        paddingHorizontal: 16,
    },
    pendingButton: {
        backgroundColor: '#666',
        padding: 10,
    },
    finishButton: {
        backgroundColor: '#8C030E',
        padding: 10,
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});