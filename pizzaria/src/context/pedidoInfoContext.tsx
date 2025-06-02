// context/PedidoInfoContext.tsx (ou o nome do seu arquivo de contexto)
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importe as CLASSES que você criou
import { Atendente } from '../model/atendente';
import { PedidoCompleto } from '../model/pedidoCompleto';
import { ItemPedido } from '../model/itemPedido'; // Importe também ItemPedido, pois PedidoCompleto o utiliza

// Importe a sua API para interagir com o backend, se necessário para verificações ou envio futuro
import { api } from '../service/api_db';

// --- Interfaces para o Contexto (AGORA USANDO AS CLASSES) ---
interface PedidoInfoContextType {
    // Agora armazena instâncias das classes
    pedidoAtual: PedidoCompleto | null;
    atendenteLogado: Atendente | null;

    // Métodos para o pedido
    salvarPedidoAtual: (pedido: PedidoCompleto) => Promise<void>;
    limparPedidoAtual: () => Promise<void>;
    carregarPedidoAtual: () => Promise<void>;
    salvarPedidoInfo: (info: { mesa: number; nCrachaAtendente: number; nomeAtendente: string; quantidadePessoas: number; idPedido: number }) => Promise<void>;
    limparPedidoInfo: () => Promise<void>;

    // Métodos para o atendente
    carregarAtendenteLogado: () => Promise<void>;
    salvarAtendenteLogado: (atendente: Atendente) => Promise<void>;
    limparAtendenteLogado: () => Promise<void>;

    // Métodos de fluxo
    iniciarNovoPedido: (mesa: string, quantidadePessoas: number) => Promise<void>;
    verificarPedidoAtivoNoStorage: () => Promise<boolean>;
}

const PedidoInfoContext = createContext<PedidoInfoContextType | undefined>(undefined);

export const PedidoInfoProvider = ({ children }: { children: ReactNode }) => {
    // Estados que armazenarão instâncias das suas classes
    const [pedidoAtual, setPedidoAtual] = useState<PedidoCompleto | null>(null);
    const [atendenteLogado, setAtendenteLogado] = useState<Atendente | null>(null);

    const PEDIDO_STORAGE_KEY = 'pedidoAtualJson'; // Chave para o JSON do PedidoCompleto
    const ATENDENTE_STORAGE_KEY = 'atendenteJson'; // Chave para o JSON do Atendente

    // --- Funções de Carregamento ---

    const carregarAtendenteLogado = useCallback(async () => {
        try {
            console.log('Iniciando carregamento do atendente...');
            const storedAtendenteJson = await AsyncStorage.getItem(ATENDENTE_STORAGE_KEY);
            
            if (storedAtendenteJson) {
                const parsedAtendente = JSON.parse(storedAtendenteJson);
                // Converte o JSON para uma instância da classe Atendente
                const atendenteInstance = Atendente.fromJSON(parsedAtendente);
                setAtendenteLogado(atendenteInstance);
                console.log('Atendente logado carregado do Storage:', atendenteInstance.toJSON());
            } else {
                setAtendenteLogado(null);
                console.log('Nenhum atendente logado encontrado no Storage.');
            }
        } catch (error) {
            console.error('Erro ao carregar atendente logado do Storage:', error);
            setAtendenteLogado(null);
            Alert.alert('Erro', 'Não foi possível carregar as informações do atendente.');
        }
    }, []);

    const carregarPedidoAtual = useCallback(async () => {
        try {
            const storedPedidoJson = await AsyncStorage.getItem(PEDIDO_STORAGE_KEY);
            if (storedPedidoJson) {
                const parsedPedido = JSON.parse(storedPedidoJson);
                console.log('Pedido carregado do storage - quantidade de pessoas:', parsedPedido.quantidadepessoas);
                // Converte o JSON para uma instância da classe PedidoCompleto
                const pedidoInstance = PedidoCompleto.fromJSON(parsedPedido);
                setPedidoAtual(pedidoInstance);
                console.log('Pedido atual carregado do Storage:', pedidoInstance.toJSON());
            } else {
                setPedidoAtual(null);
                console.log('Nenhuma informação de pedido atual encontrada no Storage.');
            }
        } catch (error) {
            console.error('Erro ao carregar pedido atual do Storage:', error);
            setPedidoAtual(null);
            Alert.alert('Erro', 'Não foi possível carregar as informações do pedido atual.');
        }
    }, []);

    // --- Funções de Salvar ---

    const salvarAtendenteLogado = useCallback(async (atendente: Atendente) => {
        try {
            // Salva o objeto Atendente como JSON no AsyncStorage
            await AsyncStorage.setItem(ATENDENTE_STORAGE_KEY, JSON.stringify(atendente.toJSON()));
            setAtendenteLogado(atendente); // Atualiza o estado do contexto
            console.log('Atendente logado SALVO no Storage:', atendente.toJSON());
        } catch (error) {
            console.error('Erro ao salvar atendente logado no Storage:', error);
            Alert.alert('Erro', 'Não foi possível salvar as informações do atendente.');
        }
    }, []);

    const salvarPedidoAtual = useCallback(async (pedido: PedidoCompleto) => {
        try {
            const pedidoJson = pedido.toJSON();
            console.log('Salvando pedido no storage - quantidade de pessoas:', pedidoJson.quantidadepessoas);
            // Salva o objeto PedidoCompleto como JSON no AsyncStorage
            await AsyncStorage.setItem(PEDIDO_STORAGE_KEY, JSON.stringify(pedidoJson));
            setPedidoAtual(pedido); // Atualiza o estado do contexto
            console.log('Pedido atual SALVO no Storage:', pedidoJson);
        } catch (error) {
            console.error('Erro ao salvar pedido atual no Storage:', error);
            Alert.alert('Erro', 'Não foi possível salvar as informações do pedido.');
            throw error; // Propaga o erro para quem chamou
        }
    }, []);

    const salvarPedidoInfo = useCallback(async (info: { mesa: number; nCrachaAtendente: number; nomeAtendente: string; quantidadePessoas: number; idPedido: number }) => {
        try {
            const novoPedido = new PedidoCompleto(
                info.idPedido,
                info.mesa,
                info.nCrachaAtendente,
                info.nomeAtendente,
                info.quantidadePessoas,
                'pendente',
                0,
                new Date().toISOString(),
                [],
                null,
                null,
                null,
                null
            );
            await salvarPedidoAtual(novoPedido);
        } catch (error) {
            console.error('Erro ao salvar informações do pedido:', error);
            Alert.alert('Erro', 'Não foi possível salvar as informações do pedido.');
        }
    }, [salvarPedidoAtual]);

    // --- Funções de Limpar ---

    const limparAtendenteLogado = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(ATENDENTE_STORAGE_KEY);
            setAtendenteLogado(null);
            console.log('Informações do atendente logado REMOVIDAS do Storage.');
        } catch (error) {
            console.error('Erro ao remover atendente logado do Storage:', error);
            Alert.alert('Erro', 'Não foi possível limpar as informações do atendente.');
        }
    }, []);

    const limparPedidoAtual = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(PEDIDO_STORAGE_KEY);
            setPedidoAtual(null);
            console.log('Informações do Pedido atual REMOVIDAS do Storage.');
        } catch (error) {
            console.error('Erro ao remover informações do pedido atual do Storage:', error);
            Alert.alert('Erro', 'Não foi possível limpar as informações do pedido.');
        }
    }, []);

    const limparPedidoInfo = useCallback(async () => {
        await limparPedidoAtual();
    }, [limparPedidoAtual]);

    // --- Funções de Fluxo (Adaptação do `handleIniciarPedido`) ---

    const verificarPedidoAtivoNoStorage = useCallback(async (): Promise<boolean> => {
        try {
            const storedInfo = await AsyncStorage.getItem(PEDIDO_STORAGE_KEY);
            return !!storedInfo; // Retorna true se houver algo no storage, false caso contrário
        } catch (error) {
            console.error('Erro ao verificar pedido ativo no Storage:', error);
            return false;
        }
    }, []);

    const iniciarNovoPedido = useCallback(async (mesa: string, quantidadePessoas: number) => {
        if (!atendenteLogado) {
            Alert.alert("Erro", "Nenhum atendente logado. Faça o login primeiro.");
            return;
        }

        // Validação da quantidade de pessoas
        if (isNaN(quantidadePessoas) || quantidadePessoas <= 0) {
            Alert.alert('Erro', 'Quantidade de pessoas inválida.');
            return;
        }

        try {
            // 1. Verificar se já existe um pedido ativo no banco de dados para esta mesa
            const pedidosAtivosNoDB = await api.listarPedidos('pendente');
            const mesaOcupadaNoDB = pedidosAtivosNoDB.some((pedido: PedidoCompleto) =>
                pedido.mesa === parseInt(mesa) && (pedido.status === 'pendente' || pedido.status === 'em_preparo')
            );

            if (mesaOcupadaNoDB) {
                Alert.alert(
                    'Mesa Ocupada',
                    'Já existe um pedido em andamento para esta mesa. Por favor, finalize o atendimento atual antes de iniciar um novo.',
                    [
                        {
                            text: 'OK',
                            style: 'cancel'
                        }
                    ]
                );
                return;
            }

            // 2. Limpar qualquer pedido anterior do Storage local
            await limparPedidoAtual();

            // 3. Criar uma nova instância da CLASSE PedidoCompleto
            const novoPedido = new PedidoCompleto(
                0, // id (será gerado pelo backend quando for enviado)
                parseInt(mesa),
                atendenteLogado.n_cracha,
                atendenteLogado.nome,
                quantidadePessoas,
                'pendente',
                0,
                new Date().toISOString(),
                [],
                null,
                null,
                null,
                null
            );

            // 4. Salvar a nova instância de PedidoCompleto no AsyncStorage
            await salvarPedidoAtual(novoPedido);

            console.log("Novo pedido iniciado com quantidade de pessoas:", quantidadePessoas);
            console.log("Pedido salvo no storage:", novoPedido.toJSON());

        } catch (error) {
            console.error("Erro ao iniciar novo pedido:", error);
            Alert.alert("Erro", "Não foi possível iniciar o novo pedido. Tente novamente.");
        }
    }, [atendenteLogado, salvarPedidoAtual, limparPedidoAtual]);

    // Efeito para carregar dados iniciais ao montar o provedor
    useEffect(() => {
        carregarAtendenteLogado();
        carregarPedidoAtual();
    }, [carregarAtendenteLogado, carregarPedidoAtual]); // Carrega ambos na montagem

    return (
        <PedidoInfoContext.Provider value={{
            pedidoAtual,
            atendenteLogado,
            salvarPedidoAtual,
            limparPedidoAtual,
            carregarPedidoAtual,
            salvarPedidoInfo,
            limparPedidoInfo,
            carregarAtendenteLogado,
            salvarAtendenteLogado,
            limparAtendenteLogado,
            iniciarNovoPedido,
            verificarPedidoAtivoNoStorage
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