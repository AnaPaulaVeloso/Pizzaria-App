// components/ItemDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, TextInput, Alert, ScrollView } from 'react-native';
import { Bebida } from '../model/bebida';
import { Esfiha } from '../model/esfiha';
import { Pizza } from '../model/pizza';
import { usePedidoInfo } from '../context/pedidoInfoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PedidoCompleto } from '../model/pedidoCompleto';
import { ItemPedido } from '../model/itemPedido';
import { useCarrinho } from '../context/CarrinhoContext';

// Interfaces de tipo para o modal e item do carrinho
export type ItemModalData = Bebida | Esfiha | Pizza;

export interface CarrinhoItem {
    id: number;
    nome: string;
    precoUnitario: number;
    quantidade: number;
    tipo: 'pizza' | 'esfiha' | 'bebida';
    imagem: string;
    bordaRecheada?: 'Catupiry' | 'Doce de Leite' | null;
    adicionaisSelecionados?: string[] | null;
    observacao?: string;
}

interface ItemDetailModalProps {
    visible: boolean;
    item: ItemModalData | null;
    onClose: () => void;
    onAddItem: (item: CarrinhoItem) => void; // Esta prop é que receberá a função do CarrinhoContext
}

const BORDA_ACRESCIMO = 10.00;
const BEBIDA_ADICIONAIS_OPCOES = ['Gelo', 'Limão Cortado', 'Limão Espremido'];

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ visible, item, onClose, onAddItem }) => {
    const [quantidade, setQuantidade] = useState(1);
    const [bordaSelecionada, setBordaSelecionada] = useState<'Catupiry' | 'Doce de Leite' | null>(null);
    const [adicionaisBebidaSelecionados, setAdicionaisBebidaSelecionados] = useState<string[]>([]);
    const [observacao, setObservacao] = useState('');
    const [precoTotalItem, setPrecoTotalItem] = useState(0);
    const { pedidoAtual } = usePedidoInfo();
    const { adicionarAoCarrinho } = useCarrinho();

    useEffect(() => {
        if (item) {
            setQuantidade(1);
            setBordaSelecionada(null);
            setAdicionaisBebidaSelecionados([]);
            setObservacao('');
            calcularPrecoTotal();
        }
    }, [item, visible]);

    useEffect(() => {
        if (item) {
            calcularPrecoTotal();
        }
    }, [quantidade, bordaSelecionada, adicionaisBebidaSelecionados, item]);

    const calcularPrecoTotal = () => {
        if (!item) return 0;
        let precoBase = parseFloat(item.preco.replace(',', '.'));
        let precoCalculado = precoBase;

        if ((item as Pizza).tipo === 'pizza' && bordaSelecionada) {
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
                // Limita a 3 adicionais
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
            // Usar o tipo diretamente do item
            const itemType = (item as any).tipo || 'bebida';

            const precoUnitario = typeof item.preco === 'string' ? 
                parseFloat(item.preco.replace(',', '.')) : 
                item.preco;

            // Preparar observações com adicionais
            let observacoesCompletas = '';
            let adicionaisBebida = '';
            
            // Adicionar borda para pizzas
            if (itemType === 'pizza' && bordaSelecionada) {
                observacoesCompletas += `Borda: ${bordaSelecionada},`;
            }

            // Adicionar adicionais para bebidas
            if (itemType === 'bebida' && adicionaisBebidaSelecionados.length > 0) {
                adicionaisBebida = `Adicionais: ${adicionaisBebidaSelecionados.join(', ')}`;
            }

            // Adicionar observações gerais se houver
            if (observacao) {
                observacoesCompletas += ` ${observacao}`;
            }

            // Combinar adicionais e observações para bebidas
            if (itemType === 'bebida') {
                if (adicionaisBebida && observacoesCompletas) {
                    observacoesCompletas = `${adicionaisBebida}, ${observacoesCompletas}`;
                } else if (adicionaisBebida) {
                    observacoesCompletas = adicionaisBebida;
                }
            }

            // Calcular preço total incluindo borda se houver
            let precoTotal = precoUnitario;
            if (itemType === 'pizza' && bordaSelecionada) {
                precoTotal += BORDA_ACRESCIMO;
            }

            const novoItem = new ItemPedido(
                Date.now(),
                pedidoAtual.id,
                item.id,
                item.nome,
                quantidade,
                precoTotal, // Preço unitário já incluindo borda
                precoTotal * quantidade,
                itemType,
                observacoesCompletas.trim() || undefined
            );

            // Adicionar ao pedido atual
            pedidoAtual.adicionarItem(novoItem);
            await pedidoAtual.salvar();

            // Adicionar ao carrinho
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
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
                        <Text style={modalStyles.textStyle}>X</Text>
                    </TouchableOpacity>
                    <ScrollView contentContainerStyle={{ alignItems: 'center', width: '100%' }}>
                        <Text style={modalStyles.modalTitle}>{item.nome}</Text>
                        <Image
                            source={{ uri: `http://192.168.1.8:8000${item.imagem}` }}
                            style={modalStyles.itemImage}
                        />
                        
                        {/* Mostra o tipo do item */}
                        <Text style={modalStyles.itemType}>
                            {item.tipo === 'pizza' ? 'Pizza' :
                             item.tipo === 'bebida' ? 'Bebida' :
                             item.tipo === 'esfiha' ? 'Esfiha' : ''}
                        </Text>

                        {/* Mostra descrição/ingredientes */}
                        {itemDescription && (
                            <View style={modalStyles.descriptionContainer}>
                                <Text style={modalStyles.sectionTitle}>
                                    {('tipo' in item && item.tipo === 'pizza') ? 'Ingredientes:' :
                                     ('itemType' in item && item.itemType === 'esfiha') ? 'Ingredientes:' :
                                     'Descrição:'}
                                </Text>
                                <Text style={modalStyles.modalText}>{itemDescription}</Text>
                            </View>
                        )}

                        <Text style={modalStyles.modalPrice}>Preço Base: R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</Text>

                        {/* Opções específicas para PIZZA */}
                        {(item as Pizza).tipo === 'pizza' && (
                            <>
                                <Text style={modalStyles.sectionTitle}>Borda Recheada (+R$ {BORDA_ACRESCIMO.toFixed(2).replace('.', ',')})</Text>
                                <View style={modalStyles.optionsContainer}>
                                    <TouchableOpacity
                                        style={[modalStyles.optionButton, bordaSelecionada === 'Catupiry' && modalStyles.optionSelected]}
                                        onPress={() => setBordaSelecionada('Catupiry')}
                                    >
                                        <Text style={modalStyles.optionButtonText}>Catupiry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[modalStyles.optionButton, bordaSelecionada === 'Doce de Leite' && modalStyles.optionSelected]}
                                        onPress={() => setBordaSelecionada('Doce de Leite')}
                                    >
                                        <Text style={modalStyles.optionButtonText}>Doce de Leite</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[modalStyles.optionButton, !bordaSelecionada && modalStyles.optionSelected]}
                                        onPress={() => setBordaSelecionada(null)}
                                    >
                                        <Text style={modalStyles.optionButtonText}>Nenhuma</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Opções específicas para BEBIDA */}
                        {(item as Bebida).tipo === 'bebida' && (
                            <>
                                <Text style={modalStyles.sectionTitle}>Adicionais (Máximo 3)</Text>
                                <View style={modalStyles.optionsContainer}>
                                    {BEBIDA_ADICIONAIS_OPCOES.map(adicional => (
                                        <TouchableOpacity
                                            key={adicional}
                                            style={[
                                                modalStyles.optionButton,
                                                adicionaisBebidaSelecionados.includes(adicional) && modalStyles.optionSelected,
                                            ]}
                                            onPress={() => toggleAdicionalBebida(adicional)}
                                        >
                                            <Text style={[
                                                modalStyles.optionButtonText,
                                                adicionaisBebidaSelecionados.includes(adicional) && { color: '#fff' }
                                            ]}>
                                                {adicional}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {adicionaisBebidaSelecionados.length > 0 && (
                                    <Text style={modalStyles.selectedAdditives}>
                                        Adicionais selecionados: {adicionaisBebidaSelecionados.join(', ')}
                                    </Text>
                                )}
                            </>
                        )}

                        {/* Quantidade (comum a todos os itens) */}
                        <Text style={modalStyles.sectionTitle}>Quantidade</Text>
                        <View style={modalStyles.quantityControl}>
                            <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))} style={modalStyles.quantityButton}>
                                <Text style={modalStyles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={modalStyles.quantityInput}
                                keyboardType="numeric"
                                value={String(quantidade)}
                                onChangeText={(text) => {
                                    const num = parseInt(text, 10);
                                    setQuantidade(isNaN(num) || num < 1 ? 1 : num);
                                }}
                            />
                            <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)} style={modalStyles.quantityButton}>
                                <Text style={modalStyles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Campo de Observação (comum a todos os itens) */}
                        <Text style={modalStyles.sectionTitle}>Observações</Text>
                        <TextInput
                            style={modalStyles.observationInput}
                            placeholder="Ex: Sem cebola, com mais orégano..."
                            multiline
                            numberOfLines={3}
                            value={observacao}
                            onChangeText={setObservacao}
                        />

                        <Text style={modalStyles.finalPrice}>Preço Total: R$ {precoTotalItem.toFixed(2).replace('.', ',')}</Text>

                        <TouchableOpacity
                            style={modalStyles.addToCartButton}
                            onPress={handleAddItem}
                        >
                            <Text style={modalStyles.addToCartButtonText}>Adicionar ao Pedido</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        zIndex: 1,
    },
    textStyle: {
        color: 'grey',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
    modalTitle: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    itemImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'green',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        width: '100%',
        textAlign: 'left',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 20,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        margin: 5,
    },
    optionSelected: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    optionButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    quantityButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: 50,
        textAlign: 'center',
    },
    observationInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    finalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'blue',
        marginTop: 10,
    },
    addToCartButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemType: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    selectedAdditives: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default ItemDetailModal;