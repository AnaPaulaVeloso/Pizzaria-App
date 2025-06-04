// services/api_db.ts
import { Atendente } from '../model/atendente';
import { PedidoCompleto } from '../model/pedidoCompleto';
import { API_BASE_URL, API_BASE_URL_ML } from './config';

const DEFAULT_TIMEOUT = 10000; // 10 segundos

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
    } catch (error: any) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
            throw new Error('Tempo de requisição excedido. Verifique sua conexão.');
        }
        throw error;
    }
};

export const api = {
    

    async inserirAtendente(atendente: Atendente) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/inserir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nome: atendente.nome,
                    n_cracha: Number(atendente.n_cracha),
                    senha: atendente.senha,
                    foto: atendente.foto
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao cadastrar atendente');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async login(n_cracha: Number, senha: string) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    n_cracha: Number(n_cracha),
                    senha: senha
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Credenciais inválidas');
            }

            const result = await response.json();
            if (!result.atendente) {
                throw new Error('Resposta inválida do servidor');
            }
            return result.atendente;
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async getAtendenteByCracha(n_cracha: number): Promise<Atendente> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/${n_cracha}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Atendente não encontrado');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async atualizarAtendente(n_cracha: number, atendente: Partial<Atendente>) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/atualizar/${n_cracha}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atendente),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.detail && typeof errorData.detail === 'string' && errorData.detail.includes('já está em uso')) {
                    throw new Error('Novo número de crachá já está em uso.');
                }
                throw new Error(errorData.detail || 'Erro ao atualizar atendente');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async deletarAtendente(n_cracha: number) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/deletar/${n_cracha}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                console.log(`Atendente ${n_cracha} deletado com sucesso.`);
                return { message: "Atendente deletado com sucesso" };
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao deletar atendente');
            }

            return response.json();
        } catch (error: any) {
            console.error('Erro ao deletar atendente da API:', error);
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },
    // --- Métodos para Pedidos (Refatorados para usar as classes) ---

    async iniciarPedido(pedidoData: any): Promise<PedidoCompleto> {
        try {
            console.log('Dados sendo enviados para iniciar pedido:', JSON.stringify(pedidoData, null, 2));
            
            const response = await fetchWithTimeout(`${API_BASE_URL}/pedidos/iniciar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(pedidoData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erro detalhado da API ao criar pedido:', errorData);
                throw new Error(errorData.detail || 'Erro ao criar pedido');
            }

            const data = await response.json();
            console.log(`Pedido ${data.id} salvo na API.`);

            return PedidoCompleto.fromJSON(data);
        } catch (error: any) {
            console.error('Erro ao criar pedido:', error);
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw new Error(error.message || 'Falha ao criar o pedido. Tente novamente.');
        }
    },

    async listarPedidos(statusQuery?: string): Promise<PedidoCompleto[]> {
        try {
            console.log('Iniciando busca de pedidos...');
            // Mapeia o status para o valor correto no banco
            let statusFilter = statusQuery;
            if (statusQuery === 'concluido') {
                statusFilter = 'Finalizado';
            }
            
            const url = statusFilter
                ? `${API_BASE_URL}/pedidos/listar?status_filter=${statusFilter}`
                : `${API_BASE_URL}/pedidos/listar`;

            const response = await fetchWithTimeout(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            console.log('Resposta da API:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao buscar pedidos');
            }

            const pedidosRaw = await response.json();
            console.log('Resposta da API:', pedidosRaw);

            const pedidosFormatados = pedidosRaw.map((pedidoData: any) => PedidoCompleto.fromJSON(pedidoData));

            console.log('Pedidos carregados:', pedidosFormatados);
            return pedidosFormatados;
        } catch (error: any) {
            console.error('Erro ao buscar pedidos:', error);
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async buscarPedidoPorId(pedidoId: number): Promise<PedidoCompleto> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/pedidos/${pedidoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Pedido não encontrado');
            }

            const pedidoRaw = await response.json();
            return PedidoCompleto.fromJSON(pedidoRaw);
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async atualizarPedido(id: number, pedidoData: any): Promise<PedidoCompleto> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/pedidos/atualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao atualizar pedido');
            }

            const data = await response.json();
            return PedidoCompleto.fromJSON(data);
        } catch (error: any) {
            console.error('Erro ao atualizar pedido:', error);
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async finalizarPedido(
        pedidoId: number,
        atendenteFinalizadorCracha: number,
        atendenteFinalizadorNome: string
    ): Promise<PedidoCompleto> {
        try {
            console.log('Enviando finalização de pedido:', {
                pedidoId,
                atendenteFinalizadorCracha,
                atendenteFinalizadorNome
            });

            const response = await fetchWithTimeout(
                `${API_BASE_URL}/pedidos/finalizar/${pedidoId}?atendente_finalizador_cracha=${atendenteFinalizadorCracha}&atendente_finalizador_nome=${encodeURIComponent(atendenteFinalizadorNome)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erro detalhado da API ao finalizar pedido:', errorData);
                throw new Error(errorData.detail || 'Erro ao finalizar pedido');
            }

            const resultado = await response.json();
            console.log('Pedido finalizado na API:', resultado);

            return PedidoCompleto.fromJSON(resultado);
        } catch (error: any) {
            console.error('Erro ao finalizar pedido:', error);
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    async cancelarPedido(pedidoId: number): Promise<boolean> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/pedidos/cancelar/${pedidoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                console.log(`Pedido ${pedidoId} deletado da API.`);
                return true;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao cancelar pedido');
            }

            return false;
        } catch (error: any) {
            console.error('Erro ao cancelar pedido da API:', error);
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw new Error('Falha ao cancelar o pedido. Tente novamente.');
        }
    },

    async obterSugestao(quantidadePessoas: number) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL_ML}${quantidadePessoas}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao obter sugestão de pizza');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    }
};