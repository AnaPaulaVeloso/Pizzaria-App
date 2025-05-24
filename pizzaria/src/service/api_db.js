import { API_BASE_URL } from "./config";

export const api = {
    login: async (n_cracha, senha) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ n_cracha, senha })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Login realizado com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },
    
    getAtendenteByCracha: async (n_cracha) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${n_cracha}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar atendente:', error);
            throw error;
        }
    },
    
    inserirAtendente: async (atendente) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    n_cracha: parseInt(atendente.n_cracha),
                    nome: atendente.nome,
                    senha: atendente.senha,
                    foto: atendente.foto
                })
            }); 
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Atendente cadastrado com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao cadastrar atendente:', error);
            throw error;
        }
    },
    
    listarAtendentes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/atendente/`);
            const data = await response.json();
            console.log('Lista de atendentes:', data);
            return data;
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            return [];
        }
    },
    
    atualizarAtendente: async (n_cracha, dados) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${n_cracha}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Atendente atualizado:', data);
            return data;
        } catch (error) {
            console.error('Erro ao atualizar atendente:', error);
            throw error;
        }
    },
    
    deletarAtendente: async (n_cracha) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${n_cracha}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log('Atendente deletado:', response.ok);
            return response.ok;
        } catch (error) {
            console.error('Erro ao deletar atendente:', error);
            throw error;
        }
    }
};
