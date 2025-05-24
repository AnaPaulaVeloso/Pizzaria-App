// services/api_db.ts
import { Atendente } from '../model/atendente';

const API_BASE_URL = 'http://192.168.1.9:8001';

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
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atendente),
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

    async login(n_cracha: string, senha: string) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ n_cracha, senha }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Credenciais inválidas');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },

    // --- NOVO MÉTODO PARA BUSCAR PERFIL ---
    async getAtendenteByCracha(n_cracha: string): Promise<Atendente> {
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

    // --- Métodos de atualização e deleção (já discutidos) ---
    async atualizarAtendente(n_cracha: string, atendente: Partial<Atendente>) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/${n_cracha}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atendente),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
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

    async deletarAtendente(n_cracha: string) {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/atendentes/${n_cracha}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erro ao deletar atendente');
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes('Network request failed')) {
                throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
            }
            throw error;
        }
    },
};