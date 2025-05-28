import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces para as informações
export interface AtendenteLogado {
    id: number;
    nome: string;
    n_cracha: string;
}

export interface PedidoInfo {
    mesa: string;
    n_cracha_atendente: string;
    nome_atendente: string;
    quantidadePessoas: number;
    dataInicio: string;
    itens: any[];
    valorTotal: number;
}

interface PedidoInfoContextType {
    pedidoAtualInfo: PedidoInfo | null;
    atendenteLogado: AtendenteLogado | null;
    salvarPedidoInfo: (info: PedidoInfo) => Promise<void>;
    limparPedidoInfo: () => Promise<void>;
    carregarAtendenteLogado: () => Promise<void>;
    salvarAtendenteLogado: (atendente: AtendenteLogado) => Promise<void>;
    limparAtendenteLogado: () => Promise<void>;
    iniciarNovoPedidoComAtendente: (mesa: string, quantidadePessoas: number) => Promise<void>;
    finalizarPedido: (itens: any[], valorTotal: number) => Promise<void>;
}

const PedidoInfoContext = createContext<PedidoInfoContextType | undefined>(undefined);

export const PedidoInfoProvider = ({ children }: { children: ReactNode }) => {
    const [pedidoAtualInfo, setPedidoAtualInfo] = useState<PedidoInfo | null>(null);
    const [atendenteLogado, setAtendenteLogado] = useState<AtendenteLogado | null>(null);
    
    const PEDIDO_INFO_KEY = 'pedidoAtualInfo';
    const ATENDENTE_LOGADO_KEY = 'atendente';

    // Carregar informações do pedido atual
    const carregarPedidoInfo = useCallback(async () => {
        try {
            const storedInfo = await AsyncStorage.getItem(PEDIDO_INFO_KEY);
            if (storedInfo) {
                const parsedInfo: PedidoInfo = JSON.parse(storedInfo);
                setPedidoAtualInfo(parsedInfo);
                console.log('Informações do Pedido carregadas do Storage:', parsedInfo);
            } else {
                setPedidoAtualInfo(null);
                console.log('Nenhuma informação de pedido encontrada no Storage.');
            }
        } catch (error) {
            console.error('Erro ao carregar informações do pedido do Storage:', error);
            setPedidoAtualInfo(null);
        }
    }, []);

    // Carregar informações do atendente logado
    const carregarAtendenteLogado = useCallback(async () => {
        try {
            const storedAtendente = await AsyncStorage.getItem(ATENDENTE_LOGADO_KEY);
            if (storedAtendente) {
                const parsedAtendente: AtendenteLogado = JSON.parse(storedAtendente);
                setAtendenteLogado(parsedAtendente);
                console.log('Atendente logado carregado do Storage:', parsedAtendente);
            } else {
                setAtendenteLogado(null);
                console.log('Nenhum atendente logado encontrado no Storage.');
            }
        } catch (error) {
            console.error('Erro ao carregar atendente logado do Storage:', error);
            setAtendenteLogado(null);
        }
    }, []);

    // Salvar informações do atendente logado
    const salvarAtendenteLogado = useCallback(async (atendente: AtendenteLogado) => {
        try {
            await AsyncStorage.setItem(ATENDENTE_LOGADO_KEY, JSON.stringify(atendente));
            setAtendenteLogado(atendente);
            console.log('Atendente logado SALVO no Storage:', atendente);
        } catch (error) {
            console.error('Erro ao salvar atendente logado no Storage:', error);
            Alert.alert('Erro', 'Não foi possível salvar as informações do atendente.');
        }
    }, []);

    // Limpar informações do atendente logado
    const limparAtendenteLogado = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(ATENDENTE_LOGADO_KEY);
            setAtendenteLogado(null);
            console.log('Informações do atendente logado REMOVIDAS do Storage.');
        } catch (error) {
            console.error('Erro ao remover atendente logado do Storage:', error);
            Alert.alert('Erro', 'Não foi possível limpar as informações do atendente.');
        }
    }, []);

    // Salvar informações do pedido
    const salvarPedidoInfo = useCallback(async (info: PedidoInfo) => {
        try {
            await AsyncStorage.setItem(PEDIDO_INFO_KEY, JSON.stringify(info));
            setPedidoAtualInfo(info);
            console.log('Informações do Pedido SALVAS no Storage:', info);
        } catch (error) {
            console.error('Erro ao salvar informações do pedido no Storage:', error);
            Alert.alert('Erro', 'Não foi possível salvar as informações do pedido.');
        }
    }, []);

    // Limpar informações do pedido
    const limparPedidoInfo = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(PEDIDO_INFO_KEY);
            setPedidoAtualInfo(null);
            console.log('Informações do Pedido REMOVIDAS do Storage.');
        } catch (error) {
            console.error('Erro ao remover informações do pedido do Storage:', error);
            Alert.alert('Erro', 'Não foi possível limpar as informações do pedido.');
        }
    }, []);

    // Nova função para finalizar o pedido
    const finalizarPedido = useCallback(async (itens: any[], valorTotal: number) => {
        if (!pedidoAtualInfo) {
            Alert.alert("Erro", "Não há pedido em andamento para finalizar.");
            return;
        }

        try {
            const pedidoFinalizado = {
                ...pedidoAtualInfo,
                itens,
                valorTotal
            };
            
            await AsyncStorage.setItem(PEDIDO_INFO_KEY, JSON.stringify(pedidoFinalizado));
            setPedidoAtualInfo(pedidoFinalizado);
            console.log('Pedido finalizado e salvo:', pedidoFinalizado);
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            Alert.alert('Erro', 'Não foi possível finalizar o pedido.');
        }
    }, [pedidoAtualInfo]);

    // Atualizar a função iniciarNovoPedidoComAtendente para incluir dataInicio
    const iniciarNovoPedidoComAtendente = useCallback(async (mesa: string, quantidadePessoas: number) => {
        if (!atendenteLogado) {
            Alert.alert("Erro", "Nenhum atendente logado. Faça o login primeiro.");
            return;
        }

        const dataAtual = new Date().toISOString();
        const novaPedidoInfo: PedidoInfo = {
            mesa: mesa,
            quantidadePessoas: quantidadePessoas,
            n_cracha_atendente: atendenteLogado.n_cracha,
            nome_atendente: atendenteLogado.nome,
            dataInicio: dataAtual,
            itens: [],
            valorTotal: 0
        };
        await salvarPedidoInfo(novaPedidoInfo);
        console.log("Novo pedido iniciado e informações salvas:", novaPedidoInfo);
    }, [atendenteLogado, salvarPedidoInfo]);

    // Carrega atendente e pedido ao montar o Provider
    useEffect(() => {
        carregarAtendenteLogado();
        carregarPedidoInfo();
    }, [carregarAtendenteLogado, carregarPedidoInfo]);

    return (
        <PedidoInfoContext.Provider value={{
            pedidoAtualInfo,
            atendenteLogado,
            salvarPedidoInfo,
            limparPedidoInfo,
            carregarAtendenteLogado,
            salvarAtendenteLogado,
            limparAtendenteLogado,
            iniciarNovoPedidoComAtendente,
            finalizarPedido
        }}>
            {children}
        </PedidoInfoContext.Provider>
    );
};

export const usePedidoInfo = () => {
    const context = useContext(PedidoInfoContext);
    if (context === undefined) {
        throw new Error('usePedidoInfo deve ser usado dentro de um PedidoInfoProvider');
    }
    return context;
};