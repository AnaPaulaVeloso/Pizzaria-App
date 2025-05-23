import { Atendente } from '../model/atendente';

const API_BASE_URL = 'http://192.168.159.193:8001'; // Correto

export const api = {
    async inserirAtendente(atendente: Atendente) {
        const response = await fetch(`${API_BASE_URL}/atendentes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(atendente),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar atendente');
        }

        return response.json();
    },

    async login(n_cracha: string, senha: string) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ n_cracha, senha }),
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }

        return response.json();
    }
}; 