import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCarrinho } from '../context/CarrinhoContext';
import { CarrinhoItem } from '../componest/itemModel';
import appStyles from '../styles/appStyles';
import Botao from '../componest/botao';

export default function ItemDetalhes() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { adicionarAoCarrinho } = useCarrinho();

    const [quantidade, setQuantidade] = useState(1);
    const [observacao, setObservacao] = useState('');
    const [bordaRecheada, setBordaRecheada] = useState<'Catupiry' | 'Doce de Leite' | null>(null);

    const handleAdicionar = () => {
        const item: CarrinhoItem = {
            id: parseInt(params.id as string),
            nome: params.nome as string,
            precoUnitario: parseFloat(params.preco as string),
            quantidade,
            tipo: params.tipo as 'pizza' | 'esfiha' | 'bebida',
            observacao,
            bordaRecheada: params.tipo === 'pizza' ? bordaRecheada : undefined,
            adicionaisSelecionados: [],
            imagem: params.imagem as string,
        };

        adicionarAoCarrinho(item);
        router.push('/carrinho');
    };

    const handleCancelar = () => {
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView>
                <Image 
                    source={{ uri: params.imagem as string }} 
                    style={appStyles.detalhesImagem} 
                />
                <View style={appStyles.detalhesContainer}>
                    <Text style={appStyles.detalhesTitulo}>{params.nome}</Text>
                    <Text style={appStyles.detalhesIngredientes}>{params.ingredientes}</Text>
                    <Text style={appStyles.detalhesPreco}>
                        R$ {parseFloat(params.preco as string).toFixed(2).replace('.', ',')}
                    </Text>

                    <View style={appStyles.quantidadeContainer}>
                        <Text style={appStyles.label}>Quantidade</Text>
                        <View style={appStyles.quantidadeBotoes}>
                            <TouchableOpacity 
                                style={appStyles.quantidadeBotao}
                                onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                            >
                                <Text style={appStyles.quantidadeBotaoTexto}>-</Text>
                            </TouchableOpacity>
                            <Text style={appStyles.quantidadeTexto}>{quantidade}</Text>
                            <TouchableOpacity 
                                style={appStyles.quantidadeBotao}
                                onPress={() => setQuantidade(quantidade + 1)}
                            >
                                <Text style={appStyles.quantidadeBotaoTexto}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {params.tipo === 'pizza' && (
                        <View style={appStyles.bordaContainer}>
                            <Text style={appStyles.label}>Borda Recheada</Text>
                            <View style={appStyles.bordaBotoes}>
                                <TouchableOpacity 
                                    style={[
                                        appStyles.bordaBotao,
                                        bordaRecheada === 'Catupiry' && appStyles.bordaBotaoSelecionado
                                    ]}
                                    onPress={() => setBordaRecheada(bordaRecheada === 'Catupiry' ? null : 'Catupiry')}
                                >
                                    <Text style={[
                                        appStyles.bordaBotaoTexto,
                                        bordaRecheada === 'Catupiry' && { color: '#fff' }
                                    ]}>Catupiry</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        appStyles.bordaBotao,
                                        bordaRecheada === 'Doce de Leite' && appStyles.bordaBotaoSelecionado
                                    ]}
                                    onPress={() => setBordaRecheada(bordaRecheada === 'Doce de Leite' ? null : 'Doce de Leite')}
                                >
                                    <Text style={[
                                        appStyles.bordaBotaoTexto,
                                        bordaRecheada === 'Doce de Leite' && { color: '#fff' }
                                    ]}>Doce de Leite</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={appStyles.observacaoContainer}>
                        <Text style={appStyles.label}>Observações</Text>
                        <TextInput
                            style={appStyles.observacaoInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Adicione observações sobre o item..."
                            value={observacao}
                            onChangeText={setObservacao}
                        />
                    </View>

                    <View style={[appStyles.botoesContainer, { gap: 10 }]}>
                        <Botao
                            texto="Cancelar"
                            onPress={handleCancelar}
                            style={StyleSheet.flatten([
                                appStyles.botao, 
                                appStyles.botaoCancelar,
                                { 
                                    flex: 1,
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#8C030E'
                                }
                            ])}
                            textoStyle={[appStyles.botaoTexto, { color: '#8C030E' }]}
                        />
                        <Botao
                            texto="Adicionar "
                            onPress={handleAdicionar}
                            style={StyleSheet.flatten([
                                appStyles.botao, 
                                appStyles.botaoAdicionar,
                                { 
                                    flex: 1,
                                    backgroundColor: '#8C030E'
                                }
                            ])}
                            textoStyle={[appStyles.botaoTexto, { color: '#fff' }]}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 