// components/ItemDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, TextInput, Alert, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Bebida } from '../model/bebida';
import { Esfiha } from '../model/esfiha';
import { Pizza } from '../model/pizza';
import { usePedidoInfo } from '../context/pedidoInfoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PedidoCompleto } from '../model/pedidoCompleto';
import { ItemPedido } from '../model/itemPedido';
import { useCarrinho } from '../context/CarrinhoContext';
import styles  from '../styles/itemModelStyles';
import { API_IMAGENS_URL } from '../service/config';

// Interfaces de tipo para o modal e item do carrinho
export type ItemModalData = Bebida | Esfiha | Pizza;

export interface CarrinhoItem {
    id: number;
    nome: string;
    precoUnitario: number;
    quantidade: number;
    tipo: 'pizza' | 'esfiha' | 'bebida';
    imagem: string;
    bordaRecheada?: 'Catupiry' | 'Chocolate' | null;
    adicionaisSelecionados?: string[] | null;
    observacao?: string;
}

interface ItemDetailModalProps {
    visible: boolean;
    item: ItemModalData | null;
    onClose: () => void;
    onAddItem: (item: CarrinhoItem) => void;
}

const BORDA_ACRESCIMO = 10.00;
const BEBIDA_ADICIONAIS_OPCOES = ['Gelo', 'Limão Cortado', 'Limão Espremido'];

const { width } = Dimensions.get('window');

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ visible, item, onClose, onAddItem }) => {
    const [quantidade, setQuantidade] = useState(1);
    const [bordaRecheada, setBordaRecheada] = useState<'Catupiry' | 'Chocolate' | null>(null);
    const [adicionaisBebidaSelecionados, setAdicionaisBebidaSelecionados] = useState<string[]>([]);
    const [observacao, setObservacao] = useState('');
    const [precoTotalItem, setPrecoTotalItem] = useState(0);
    const { pedidoAtual } = usePedidoInfo();
    const { adicionarAoCarrinho } = useCarrinho();

    useEffect(() => {
        if (item) {
            setQuantidade(1);
            setBordaRecheada(null);
            setAdicionaisBebidaSelecionados([]);
            setObservacao('');
            calcularPrecoTotal();
        }
    }, [item, visible]);

    useEffect(() => {
        if (item) {
            calcularPrecoTotal();
        }
    }, [quantidade, bordaRecheada, adicionaisBebidaSelecionados, item]);

    const calcularPrecoTotal = () => {
        if (!item) return 0;
        let precoBase = parseFloat(item.preco.replace(',', '.'));
        let precoCalculado = precoBase;

        if ((item as Pizza).tipo === 'pizza' && bordaRecheada) {
            precoCalculado += BORDA_ACRESCIMO;
        }

        setPrecoTotalItem(precoCalculado * quantidade);
        return precoCalculado * quantidade;
    };

    const toggleAdicionalBebida = (adicional: string) => {
        setAdicionaisBebidaSelecionados(prev => {
            if (prev.includes(adicional)) {
                return prev.filter(a => a !== adicional);
            } else {
                if (prev.length >= 3) {
                    Alert.alert('Limite atingido', 'Você pode selecionar no máximo 3 adicionais.');
                    return prev;
                }
                return [...prev, adicional];
            }
        });
    };

    const handleAddItem = async () => {
        if (!pedidoAtual || !item) {
            Alert.alert('Erro', 'Por favor, inicie um novo pedido primeiro');
            return;
        }

        if (!quantidade || quantidade <= 0) {
            Alert.alert('Erro', 'Por favor, insira uma quantidade válida');
            return;
        }

        try {
            const itemType = (item as any).tipo || 'bebida';
            const precoUnitario = typeof item.preco === 'string' ? 
                parseFloat(item.preco.replace(',', '.')) : 
                item.preco;

            let observacoesCompletas = '';
            let adicionaisBebida = '';
            
            if (itemType === 'pizza' && bordaRecheada) {
                observacoesCompletas += `Borda: ${bordaRecheada},`;
            }

            if (itemType === 'bebida' && adicionaisBebidaSelecionados.length > 0) {
                adicionaisBebida = `Adicionais: ${adicionaisBebidaSelecionados.join(', ')}`;
            }

            if (observacao) {
                observacoesCompletas += ` ${observacao}`;
            }

            if (itemType === 'bebida') {
                if (adicionaisBebida && observacoesCompletas) {
                    observacoesCompletas = `${adicionaisBebida}, ${observacoesCompletas}`;
                } else if (adicionaisBebida) {
                    observacoesCompletas = adicionaisBebida;
                }
            }

            let precoTotal = precoUnitario;
            if (itemType === 'pizza' && bordaRecheada) {
                precoTotal += BORDA_ACRESCIMO;
            }

            const novoItem = new ItemPedido(
                Date.now(),
                pedidoAtual.id,
                item.id,
                item.nome,
                quantidade,
                precoTotal,
                precoTotal * quantidade,
                itemType,
                observacoesCompletas.trim() || undefined
            );

            pedidoAtual.adicionarItem(novoItem);
            await pedidoAtual.salvar();
            adicionarAoCarrinho(novoItem);

            Alert.alert('Sucesso', 'Item adicionado ao carrinho!');
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            Alert.alert('Erro', 'Não foi possível adicionar o item ao carrinho');
        }
    };

    if (!item) return null;

    const itemDescription = 'ingredientes' in item ? item.ingredientes :
                            'descricao' in item ? item.descricao : '';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView}>
                    <Image 
                        source={{ uri: `${API_IMAGENS_URL}${item.imagem}` }} 
                        style={styles.detalhesImagem} 
                    />
                    <View style={styles.detalhesContainer}>
                        <Text style={styles.detalhesTitulo}>{item.nome}</Text>
                        <Text style={styles.detalhesIngredientes}>{itemDescription}</Text>
                        <Text style={styles.detalhesPreco}>
                            R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
                        </Text>

                        <View style={styles.quantidadeContainer}>
                            <Text style={styles.label}>Quantidade</Text>
                            <View style={styles.quantidadeBotoes}>
                                <TouchableOpacity 
                                    style={styles.quantidadeBotao}
                                    onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                                >
                                    <Text style={styles.quantidadeBotaoTexto}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantidadeTexto}>{quantidade}</Text>
                                <TouchableOpacity 
                                    style={styles.quantidadeBotao}
                                    onPress={() => setQuantidade(quantidade + 1)}
                                >
                                    <Text style={styles.quantidadeBotaoTexto}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {(item as Pizza).tipo === 'pizza' && (
                            <View style={styles.bordaContainer}>
                                <Text style={styles.label}>Borda Recheada</Text>
                                <View style={styles.bordaBotoes}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.bordaBotao,
                                            bordaRecheada === 'Catupiry' && styles.bordaBotaoSelecionado
                                        ]}
                                        onPress={() => setBordaRecheada(bordaRecheada === 'Catupiry' ? null : 'Catupiry')}
                                    >
                                        <Text style={[
                                            styles.bordaBotaoTexto,
                                            bordaRecheada === 'Catupiry' && { color: '#fff' }
                                        ]}>Catupiry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[
                                            styles.bordaBotao,
                                            bordaRecheada === 'Chocolate' && styles.bordaBotaoSelecionado
                                        ]}
                                        onPress={() => setBordaRecheada(bordaRecheada === 'Chocolate' ? null : 'Chocolate')}
                                    >
                                        <Text style={[
                                            styles.bordaBotaoTexto,
                                            bordaRecheada === 'Chocolate' && { color: '#fff' }
                                        ]}>Chocolate</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <View style={styles.observacaoContainer}>
                            <Text style={styles.label}>Observações</Text>
                            <TextInput
                                style={styles.observacaoInput}
                                multiline
                                numberOfLines={4}
                                placeholder="Adicione observações sobre o item..."
                                value={observacao}
                                onChangeText={setObservacao}
                            />
                        </View>

                        <View style={styles.botoesContainer}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoCancelar]}
                                onPress={onClose}
                            >
                                <Text style={[styles.botaoTexto, { color: '#8C030E' }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoAdicionar]}
                                onPress={handleAddItem}
                            >
                                <Text style={[styles.botaoTexto, { color: '#fff' }]}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};


export default ItemDetailModal;