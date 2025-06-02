// comp/FinalizarAtendimentoModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface FinalizarAtendimentoModalProps {
    visible: boolean;
    mesa: string;
    pedido: any;
    onClose: () => void;
}

const FinalizarAtendimentoModal: React.FC<FinalizarAtendimentoModalProps> = ({ 
    visible, 
    mesa, 
    pedido,
    onClose 
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Informações Gerais</Text>
                            <Text style={styles.infoText}>Mesa: {mesa}</Text>
                            <Text style={styles.infoText}>
                                Pessoas: {pedido?.quantidadePessoas || 0}
                            </Text>
                            <Text style={styles.infoText}>
                                Total: R$ {(pedido?.valorTotal || 0).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Informações do Atendimento</Text>
                            <Text style={styles.infoText}>
                                Iniciado por: {pedido?.atendente || 'Não informado'}
                            </Text>
                            <Text style={styles.infoText}>
                                Finalizado por: {pedido?.pedidos[0]?.nomeatendentefinalizador || 'Não informado'}
                            </Text>
                            <Text style={styles.infoText}>
                                Data/Hora: {pedido?.dataHoraFinalizacao ? 
                                    new Date(pedido.dataHoraFinalizacao).toLocaleString('pt-BR') : 
                                    'Não informado'}
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Itens do Pedido</Text>
                            {pedido?.pedidos.map((p: any, index: number) => {
                                // Faz o parse dos itens que estão como string JSON
                                const itens = typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens;
                                
                                return (
                                    <View key={index} style={styles.pedidoGroup}>
                                        <Text style={styles.pedidoTime}>
                                            {new Date(p.datahorafinalizacao).toLocaleTimeString('pt-BR')}
                                        </Text>
                                        {itens.map((item: any, itemIndex: number) => (
                                            <View key={itemIndex} style={styles.itemContainer}>
                                                <View style={styles.itemHeader}>
                                                    <Text style={styles.itemQuantidade}>
                                                        {item.quantidade}x
                                                    </Text>
                                                    <View style={styles.itemDetails}>
                                                        <Text style={styles.itemText}>
                                                            {item.tipo} - {item.nomeproduto}
                                                        </Text>
                                                        {item.observacoes && (
                                                            <Text style={styles.observacaoText}>
                                                                Obs: {item.observacoes}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                                <Text style={styles.itemValor}>
                                                    R$ {item.subtotal.toFixed(2).replace('.', ',')}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })}
                        </View>

                        {pedido?.pedidos[0]?.observacoes && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Observações Gerais</Text>
                                <Text style={styles.infoText}>{pedido.pedidos[0].observacoes}</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    scrollView: {
        maxHeight: '100%',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    pedidoGroup: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    pedidoTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    itemContainer: {
        marginBottom: 12,
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    itemQuantidade: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        marginRight: 8,
        minWidth: 30,
    },
    itemDetails: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    itemValor: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 4,
    },
    observacaoText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default FinalizarAtendimentoModal;