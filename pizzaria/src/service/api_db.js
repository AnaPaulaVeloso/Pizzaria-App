import { API_BASE_URL } from "./config";

export const api = {
    login: async (n_cracha, senha) => {
        try {
            const response = await fetch(`${API_BASE_URL}/atendente/${n_cracha}/`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Verifica se a senha está correta
            if (data.senha === senha) {
                console.log('Login realizado com sucesso:', data);
                return data;
            } else {
                throw new Error('Senha incorreta');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },
    
    inserirAtendente: async (atendente) => {
        try{
            const url = `${API_BASE_URL}/atendente/`;
            console.log('Tentando cadastrar atendente:', atendente);
            console.log('URL completa da requisição:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    n_cracha: parseInt(atendente.n_cracha),
                    nome: atendente.nome,
                    senha: atendente.senha
                })
            }); 
            
            console.log('Status da resposta:', response.status);
            
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
            const response = await fetch(`${API_BASE_URL}/atendente/${n_cracha}/`, {
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
            const response = await fetch(`${API_BASE_URL}/atendente/${n_cracha}/`, {
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
