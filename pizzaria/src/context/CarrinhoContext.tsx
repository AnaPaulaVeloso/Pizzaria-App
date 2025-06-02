import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { Atendente } from '../model/atendente';
import { PedidoCompleto } from '../model/pedidoCompleto';
import { ItemPedido } from '../model/itemPedido';
import { api } from '../service/api_db';
import { usePedidoInfo } from './pedidoInfoContext';

interface CarrinhoContextType {
    carrinho: ItemPedido[];
    pedidosPendentes: PedidoCompleto[];
    adicionarAoCarrinho: (item: ItemPedido) => void;
    removerDoCarrinho: (itemId: number) => void;
    atualizarQuantidade: (itemId: number, novaQuantidade: number) => void;
    limparCarrinho: () => Promise<void>;
    getTotalItens: () => number;
    getPrecoTotal: () => number;
    finalizarPedido: () => Promise<boolean>;
    marcarPedidoComoEntregue: (pedidoId: number) => Promise<void>;
    carregarPedidosPendentes: () => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

const CARRINHO_STORAGE_KEY = '@appPedido:carrinhoJson';

interface CarrinhoProviderProps {
    children: ReactNode;
}

export const CarrinhoProvider: React.FC<CarrinhoProviderProps> = ({ children }) => {
    const [carrinho, setCarrinho] = useState<ItemPedido[]>([]);
    const [pedidosPendentes, setPedidosPendentes] = useState<PedidoCompleto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { pedidoAtual, salvarPedidoAtual, limparPedidoAtual } = usePedidoInfo();

    const carregarPedidosPendentesDoDB = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const pedidos = await api.listarPedidos('pendente');
            setPedidosPendentes(pedidos);
        } catch (error) {
            console.error("Erro ao carregar pedidos pendentes do DB:", error);
            Alert.alert("Erro", "Não foi possível carregar os pedidos pendentes.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const carregarCarrinhoDoStorage = async () => {
            try {
                const carrinhoString = await AsyncStorage.getItem(CARRINHO_STORAGE_KEY);
                if (carrinhoString) {
                    const parsedCarrinho: any[] = JSON.parse(carrinhoString);
                    const itensInstanciados = parsedCarrinho.map(itemJson => ItemPedido.fromJSON(itemJson));
                    setCarrinho(itensInstanciados);
                }
            } catch (e) {
                console.error("Erro ao carregar carrinho do Storage:", e);
                Alert.alert("Erro", "Não foi possível carregar o carrinho salvo.");
            }
        };
        carregarCarrinhoDoStorage();
    }, []);

    useEffect(() => {
        carregarPedidosPendentesDoDB();
    }, []);

    useEffect(() => {
        const salvarCarrinhoNoStorage = async () => {
            try {
                const carrinhoJson = carrinho.map(item => item.toJSON());
                await AsyncStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(carrinhoJson));
            } catch (e) {
                console.error("Erro ao salvar carrinho no Storage:", e);
                Alert.alert("Erro", "Não foi possível salvar o carrinho.");
            }
        };
        salvarCarrinhoNoStorage();
    }, [carrinho]);

    const adicionarAoCarrinho = useCallback((item: ItemPedido) => {
        if (!pedidoAtual) {
            Alert.alert(
                "Erro",
                "Nenhum pedido em andamento. Por favor, inicie um novo pedido primeiro."
            );
            return;
        }

        setCarrinho(prevCarrinho => {
            const carrinhoItemId = Date.now();
            const novoItem = new ItemPedido(
                carrinhoItemId,
                item.idpedido,
                item.idproduto,
                item.nomeproduto,
                item.quantidade,
                item.precounitario,
                item.subtotal,
                item.tipo,
                item.observacoes
            );
            
            return [...prevCarrinho, novoItem];
        });
    }, [pedidoAtual]);

    const removerDoCarrinho = useCallback((itemId: number) => {
        setCarrinho(prevCarrinho => prevCarrinho.filter(
            (item) => item.id !== itemId
        ));
    }, []);

    const atualizarQuantidade = useCallback((itemId: number, novaQuantidade: number) => {
        if (novaQuantidade < 1) return;

        setCarrinho(prevCarrinho =>
            prevCarrinho.map(item => {
                if (item.id === itemId) {
                    return new ItemPedido(
                        item.id,
                        item.idpedido,
                        item.idproduto,
                        item.nomeproduto,
                        novaQuantidade,
                        item.precounitario,
                        novaQuantidade * item.precounitario,
                        item.tipo,
                        item.observacoes
                    );
                }
                return item;
            })
        );
    }, []);

    const limparCarrinho = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(CARRINHO_STORAGE_KEY);
            setCarrinho([]);
            console.log("Carrinho REMOVIDO do Storage.");
        } catch (error) {
            console.error("Erro ao limpar carrinho:", error);
            Alert.alert("Erro", "Não foi possível limpar o carrinho.");
        }
    }, []);

    const getTotalItens = useCallback(() => {
        return carrinho.reduce((total, item) => total + item.quantidade, 0);
    }, [carrinho]);

    const getPrecoTotal = useCallback(() => {
        return carrinho.reduce((total, item) => total + item.subtotal, 0);
    }, [carrinho]);

    const marcarPedidoComoEntregue = useCallback(async (pedidoId: number) => {
        if (!pedidoAtual) {
            Alert.alert("Erro", "Não há um pedido em andamento.");
            return;
        }

        try {
            const pedidoAtualizado = await api.finalizarPedido(
                pedidoId,
                pedidoAtual.ncrachaatendente,
                pedidoAtual.nomeatendente
            );

            if (pedidoAtualizado) {
                Alert.alert("Sucesso", "Pedido marcado como entregue com sucesso!");
                await carregarPedidosPendentesDoDB();
            }
        } catch (error) {
            console.error('Erro ao marcar pedido como entregue:', error);
            Alert.alert("Erro", "Não foi possível marcar o pedido como entregue. Tente novamente.");
        }
    }, [pedidoAtual, carregarPedidosPendentesDoDB]);

    const finalizarPedido = async (): Promise<boolean> => {
        if (!pedidoAtual) return false;

        try {
            // Criar objeto com informações do pedido
            const pedidoCompleto = new PedidoCompleto(
                pedidoAtual.id || 0,
                pedidoAtual.mesa,
                pedidoAtual.ncrachaatendente,
                pedidoAtual.nomeatendente,
                pedidoAtual.quantidadepessoas,
                'pendente',
                pedidoAtual.valortotal,
                pedidoAtual.datahora || new Date().toISOString(),
                carrinho,
                null,
                null,
                null,
                null
            );

            const dadosParaAPI = pedidoCompleto.toJSON();
            console.log('DADOS ENVIADOS PARA API:', dadosParaAPI, JSON.stringify(dadosParaAPI));

            // Usar a função da API para iniciar o pedido
            const pedidoSalvo = await api.iniciarPedido(dadosParaAPI);

            // Atualizar a lista de pedidos pendentes
            await carregarPedidosPendentesDoDB();

            // Limpar o carrinho e o pedido atual
            await limparCarrinho();
            await limparPedidoAtual();

            return true;
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            Alert.alert("Erro", "Não foi possível finalizar o pedido. Tente novamente.");
            return false;
        }
    };

    const value = {
        carrinho,
        pedidosPendentes,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        getTotalItens,
        getPrecoTotal,
        finalizarPedido,
        marcarPedidoComoEntregue,
        carregarPedidosPendentes: carregarPedidosPendentesDoDB
    };

    return (
        <CarrinhoContext.Provider value={value}>
            {children}
        </CarrinhoContext.Provider>
    );
};

export const useCarrinho = () => {
    const context = useContext(CarrinhoContext);
    if (context === undefined) {
        throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
    }
    return context;
};