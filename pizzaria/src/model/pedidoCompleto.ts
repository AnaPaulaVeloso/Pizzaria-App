import { ItemPedido } from './itemPedido';
import AsyncStorage from '@react-native-async-storage/async-storage';


export class PedidoCompleto {
    private _id: number;
    private _mesa: number;
    private _ncrachaatendente: number;
    private _nomeatendente: string;
    private _quantidadepessoas: number;
    private _status: 'pendente' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado' | 'concluido';
    private _valortotal: number;
    private _datahora: string;
    private _datahorafinalizacao?: string | null;
    private _n_cracha_at_finalizador?: number | null;
    private _nomeatendentefinalizador?: string | null;
    private _itens: ItemPedido[]; // Lista de instâncias da classe ItemPedido
    private _observacoes?: string | null;

    constructor(
        id: number,
        mesa: number,
        ncrachaatendente: number,
        nomeatendente: string,
        quantidadepessoas: number,
        status: 'pendente' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado' | 'concluido',
        valortotal: number,
        datahora: string,
        itens: ItemPedido[], 
        datahorafinalizacao?: string | null,
        n_cracha_at_finalizador?: number | null,
        nomeatendentefinalizador?: string | null,
        observacoes?: string | null
    ) {
        this._id = id;
        this._mesa = mesa;
        this._ncrachaatendente = ncrachaatendente;
        this._nomeatendente = nomeatendente;
        this._quantidadepessoas = quantidadepessoas;
        this._status = status;
        this._valortotal = valortotal;
        this._datahora = datahora;
        this._itens = itens;
        this._datahorafinalizacao = datahorafinalizacao;
        this._n_cracha_at_finalizador = n_cracha_at_finalizador;
        this._nomeatendentefinalizador = nomeatendentefinalizador;
        this._observacoes = observacoes;
    }

    // Getters
    public get id(): number {
        return this._id;
    }

    public get mesa(): number {
        return this._mesa;
    }

    public get ncrachaatendente(): number {
        return this._ncrachaatendente;
    }

    public get nomeatendente(): string {
        return this._nomeatendente;
    }

    public get quantidadepessoas(): number {
        return this._quantidadepessoas;
    }

    public get status(): 'pendente' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado' | 'concluido' {
        return this._status;
    }

    public get valortotal(): number {
        return this._valortotal;
    }

    public get datahora(): string {
        return this._datahora;
    }

    public get datahorafinalizacao(): string | null | undefined {
        return this._datahorafinalizacao;
    }

    public get n_cracha_at_finalizador(): number | null | undefined {
        return this._n_cracha_at_finalizador;
    }

    public get nomeatendentefinalizador(): string | null | undefined {
        return this._nomeatendentefinalizador;
    }

    public get itens(): ItemPedido[] {
        return this._itens;
    }

    public get observacoes(): string | null | undefined {
        return this._observacoes;
    }

    // Setters
    public set id(value: number) {
        this._id = value;
    }

    public set mesa(value: number) {
        if (value <= 0) throw new Error("Mesa deve ser um número positivo.");
        this._mesa = value;
    }

    public set ncrachaatendente(value: number) {
        this._ncrachaatendente = value;
    }

    public set nomeatendente(value: string) {
        this._nomeatendente = value;
    }

    public set quantidadepessoas(value: number) {
        this._quantidadepessoas = value;
    }

    public set status(value: 'pendente' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado' | 'concluido') {
        this._status = value;
    }

    public set valortotal(value: number) {
        if (value < 0) throw new Error("Valor total não pode ser negativo.");
        this._valortotal = value;
    }

    public set datahora(value: string) {
        this._datahora = value;
    }

    public set datahorafinalizacao(value: string | null | undefined) {
        this._datahorafinalizacao = value;
    }

    public set n_cracha_at_finalizador(value: number | null | undefined) {
        this._n_cracha_at_finalizador = value;
    }

    public set nomeatendentefinalizador(value: string | null | undefined) {
        this._nomeatendentefinalizador = value;
    }

    public set itens(value: ItemPedido[]) {
        this._itens = value;
        this.recalcularValorTotal(); // Recalculate total when items are set
    }

    public set observacoes(value: string | null | undefined) {
        this._observacoes = value;
    }

    /**
     * Adiciona um novo item ao pedido.
     */
    public adicionarItem(item: ItemPedido): void {
        this._itens.push(item);
        // Opcional: Recalcular o valor total aqui
        this.recalcularValorTotal();
    }

    /**
     * Remove um item do pedido pelo seu ID.
     */
    public removerItem(itemId: number): void {
        const initialLength = this._itens.length;
        this._itens = this._itens.filter(item => item.id !== itemId);
        if (this._itens.length < initialLength) {
            this.recalcularValorTotal();
        }
    }

    /**
     * Recalcula o valor total do pedido com base nos itens atuais.
     */
    private recalcularValorTotal(): void {
        this._valortotal = this._itens.reduce((sum, item) => sum + (item.precounitario * item.quantidade), 0);
    }

    /**
     * Converte o objeto da classe para um formato JSON compatível com o backend.
     * Útil ao enviar dados para a API.
     */
    public toJSON() {
        const json: any = {
            mesa: this._mesa,
            n_cracha: this._ncrachaatendente,
            nomeatendente: this._nomeatendente,
            quantidadepessoas: this._quantidadepessoas || 1,
            status: this._status,
            valortotal: this._valortotal,
            itens: JSON.stringify(this._itens.map(item => ({
                id: item.id,
                idpedido: item.idpedido,
                idproduto: item.idproduto,
                nomeproduto: item.nomeproduto,
                quantidade: item.quantidade,
                precounitario: item.precounitario,
                subtotal: item.subtotal,
                tipo: item.tipo,
                observacoes: item.observacoes || null
            }))),
            observacoes: this._observacoes || null
        };

        // Adiciona campos opcionais apenas se existirem
        if (this._id) json.id = this._id;
        if (this._datahora) json.datahora = this._datahora;
        if (this._datahorafinalizacao) json.datahorafinalizacao = this._datahorafinalizacao;
        if (this._n_cracha_at_finalizador) json.n_cracha_at_finalizador = this._n_cracha_at_finalizador;
        if (this._nomeatendentefinalizador) json.nomeatendentefinalizador = this._nomeatendentefinalizador;

        console.log('PedidoCompleto.toJSON - dados enviados:', json);
        return json;
    }

    public static fromJSON(data: any): PedidoCompleto {
        console.log('PedidoCompleto.fromJSON - dados recebidos:', data);
        
        // Faz o parse dos itens
        let itens: ItemPedido[] = [];
        if (data.itens) {
            try {
                // Se os itens vierem como string, faz o parse
                const itensJson = typeof data.itens === 'string' ? JSON.parse(data.itens) : data.itens;
                itens = Array.isArray(itensJson) ? itensJson.map((itemData: any) => ItemPedido.fromJSON(itemData)) : [];
            } catch (error) {
                console.error('Erro ao fazer parse dos itens:', error);
                itens = [];
            }
        }

        // Garante que quantidadepessoas sempre tenha um valor
        const quantidadepessoas = data.quantidadepessoas || 1;

        const pedido = new PedidoCompleto(
            data.id || 0,
            data.mesa,
            data.ncrachaatendente || data.n_cracha || 0,
            data.nomeatendente || '',
            quantidadepessoas,
            data.status || 'pendente',
            data.valortotal || 0,
            data.datahora || new Date().toISOString(),
            itens,
            data.datahorafinalizacao,
            data.n_cracha_at_finalizador,
            data.nomeatendentefinalizador,
            data.observacoes
        );

        console.log('PedidoCompleto.fromJSON - quantidade de pessoas:', pedido.quantidadepessoas);
        return pedido;
    }

    /**
     * Salva o pedido atual no AsyncStorage
     */
    public async salvar(): Promise<void> {
        try {
            await AsyncStorage.setItem('pedidoAtualJson', JSON.stringify(this.toJSON()));
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            throw new Error('Não foi possível salvar o pedido');
        }
    }
}