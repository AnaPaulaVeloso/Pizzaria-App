export interface CarrinhoItem {
    id: number;
    nome: string;
    precoUnitario: number;
    quantidade: number;
    tipo: 'pizza' | 'esfiha' | 'bebida';
    observacao: string;
    bordaRecheada?: 'Catupiry' | 'Doce de Leite' | null;
    adicionaisSelecionados: string[];
    imagem: string;
} 