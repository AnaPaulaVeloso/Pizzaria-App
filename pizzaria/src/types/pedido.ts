import { CarrinhoItem } from '../componest/itemModel';

export type StatusPedido = 'pendente' | 'em preparo' | 'entregue' | 'cancelado';

export interface PedidoBase {
    id: string;
    mesa: string;
    n_cracha_atendente: string;
    nome_atendente: string;
    quantidadePessoas: number;
    itens: CarrinhoItem[];
    valorTotal: number;
    dataHora: string;
    dataInicio: string;
    dataHoraFinalizacao: string | null;
    status: StatusPedido;
}

export interface PedidoCompleto extends PedidoBase {
    // Campos adicionais específicos do pedido completo
    observacoes?: string;
    tempoPreparo?: number;
}

export interface PedidosAgrupados {
    data: string;
    pedidos: PedidoCompleto[];
}

// Interface para itens do pedido
export interface ItemPedido {
    id: number;
    tipo: 'pizza' | 'esfiha' | 'bebida';
    quantidade: number;
    precoUnitario: number;
    observacao?: string;
    bordaRecheada?: boolean; // Opcional, usado apenas para pizzas
    adicionaisSelecionados?: string[]; // Opcional, usado para bebidas
} 