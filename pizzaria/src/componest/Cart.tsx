import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CarrinhoItem } from './itemModel';
import appStyles from '../styles/appStyles';

interface CartProps {
    items: CarrinhoItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
    onFinalizar: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemove, onFinalizar }: CartProps) {
    const calcularTotal = () => {
        return items.reduce((total, item) => {
            return total + (item.precoUnitario * item.quantidade);
        }, 0);
    };

    return (
        <View style={appStyles.container}>
            <ScrollView>
                {items.map((item) => (
                    <View key={item.id} style={appStyles.card}>
                        <View style={appStyles.cardHeader}>
                            <Text style={appStyles.cardTitle}>{item.nome}</Text>
                            <TouchableOpacity
                                onPress={() => onRemove(item.id)}
                                style={appStyles.removeButton}
                            >
                                <Text style={appStyles.removeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={appStyles.quantityContainer}>
                            <TouchableOpacity
                                onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantidade - 1))}
                                style={appStyles.quantityButton}
                            >
                                <Text style={appStyles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={appStyles.quantityText}>{item.quantidade}</Text>
                            <TouchableOpacity
                                onPress={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                                style={appStyles.quantityButton}
                            >
                                <Text style={appStyles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {item.bordaRecheada && (
                            <Text style={appStyles.itemDetail}>
                                Borda: {item.bordaRecheada}
                            </Text>
                        )}

                        {item.observacao && (
                            <Text style={appStyles.itemDetail}>
                                Obs: {item.observacao}
                            </Text>
                        )}

                        <Text style={appStyles.itemPrice}>
                            R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={appStyles.footer}>
                <Text style={appStyles.totalText}>
                    Total: R$ {calcularTotal().toFixed(2).replace('.', ',')}
                </Text>
                <TouchableOpacity
                    style={[appStyles.button, appStyles.buttonDisabled]}
                    onPress={onFinalizar}
                    disabled={items.length === 0}
                >
                    <Text style={appStyles.buttonText}>Finalizar Pedido</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
} 