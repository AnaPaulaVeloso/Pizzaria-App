// comp/CarrinhoItemCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CarrinhoItem } from './itemModel'; // Importe a interface CarrinhoItem
import { useCarrinho } from '../context/CarrinhoContext';

// Adicione uma interface para as props do CarrinhoItemCard
interface CarrinhoItemCardProps {
    item: CarrinhoItem;
    // Opcional: Adicione funções para interações futuras, como editar quantidade ou remover
    onPress?: () => void;
    // onRemove?: (id: number, type: 'pizza' | 'esfiha' | 'bebida') => void;
    // onUpdateQuantity?: (id: number, type: 'pizza' | 'esfiha' | 'bebida', newQuantity: number) => void;
}

const Item: React.FC<CarrinhoItemCardProps> = ({ item }) => {
    const { atualizarQuantidade, removerDoCarrinho } = useCarrinho();

    const handleDecreaseQuantity = () => {
        if (item.quantidade > 1) {
            atualizarQuantidade(item.id, item.quantidade - 1);
        } else {
            removerDoCarrinho(item.id);
        }
    };

    const handleIncreaseQuantity = () => {
        atualizarQuantidade(item.id, item.quantidade + 1);
    };

    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.itemName}>{item.nome}</Text>
                
                {/* Mostra o tipo do item */}
                <Text style={styles.itemDetails}>
                    Tipo: {
                        item.tipo === 'pizza' ? 'Pizza' :
                        item.tipo === 'esfiha' ? 'Esfiha' :
                        item.tipo === 'bebida' ? 'Bebida' : ''
                    }
                </Text>

                {/* Mostra a borda para pizzas */}
                {item.tipo === 'pizza' && item.bordaRecheada && (
                    <Text style={styles.itemDetails}>
                        Borda: {item.bordaRecheada} (+R$ 10,00)
                    </Text>
                )}

                {/* Mostra adicionais para bebidas */}
                {item.tipo === 'bebida' && item.adicionaisSelecionados && item.adicionaisSelecionados.length > 0 && (
                    <Text style={styles.itemDetails}>
                        Adicionais: {item.adicionaisSelecionados.join(', ')}
                    </Text>
                )}

                {/* Mostra observações se houver */}
                {item.observacao && !item.observacao.includes('Adicionais:') && (
                    <Text style={styles.itemDetails}>Obs: {item.observacao}</Text>
                )}

                {/* Mostra o preço unitário e total */}
                <View style={styles.priceContainer}>
                    <Text style={styles.itemPrice}>
                        R$ {item.precoUnitario.toFixed(2).replace('.', ',')} cada
                    </Text>
                    <Text style={styles.totalPrice}>
                        Total: R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>

            <View style={styles.quantityContainer}>
                <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={handleDecreaseQuantity}
                >
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantidade}</Text>
                
                <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={handleIncreaseQuantity}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    infoContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    quantityButton: {
        backgroundColor: '#007AFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12,
        minWidth: 30,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'right',
    },
    priceContainer: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: 'bold',
        marginTop: 4,
    },
});

export default Item;