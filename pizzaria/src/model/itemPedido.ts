export class ItemPedido {
    private _id: number;
    private _idpedido: number;
    private _idproduto: number;
    private _nomeproduto: string;
    private _quantidade: number;
    private _precounitario: number;
    private _subtotal: number;
    private _observacoes?: string | null;
    private _tipo: 'pizza' | 'esfiha' | 'bebida';

    constructor(
        id: number,
        idpedido: number,
        idproduto: number,
        nomeproduto: string,
        quantidade: number,
        precounitario: number,
        subtotal: number,
        tipo: 'pizza' | 'esfiha' | 'bebida',
        observacoes?: string | null
    ) {
        this._id = id;
        this._idpedido = idpedido;
        this._idproduto = idproduto;
        this._nomeproduto = nomeproduto;
        this._quantidade = quantidade;
        this._precounitario = precounitario;
        this._subtotal = subtotal;
        this._tipo = tipo;
        this._observacoes = observacoes;
    }

    // Getters
    public get id(): number { return this._id; }
    public get idpedido(): number { return this._idpedido; }
    public get idproduto(): number { return this._idproduto; }
    public get nomeproduto(): string { return this._nomeproduto; }
    public get quantidade(): number { return this._quantidade; }
    public get precounitario(): number { return this._precounitario; }
    public get subtotal(): number { return this._subtotal; }
    public get observacoes(): string | null | undefined { return this._observacoes; }
    public get tipo(): 'pizza' | 'esfiha' | 'bebida' { return this._tipo; }

    // Setters
    public set id(value: number) { this._id = value; }
    public set idpedido(value: number) { this._idpedido = value; }
    public set idproduto(value: number) { this._idproduto = value; }
    public set nomeproduto(value: string) { this._nomeproduto = value; }
    public set quantidade(value: number) { 
        this._quantidade = value;
        this._subtotal = value * this._precounitario;
    }
    public set precounitario(value: number) { 
        this._precounitario = value;
        this._subtotal = this._quantidade * value;
    }
    public set subtotal(value: number) { this._subtotal = value; }
    public set observacoes(value: string | null | undefined) { this._observacoes = value; }
    public set tipo(value: 'pizza' | 'esfiha' | 'bebida') { this._tipo = value; }

    public toJSON() {
        return {
            id: this._id,
            idpedido: this._idpedido,
            idproduto: this._idproduto,
            nomeproduto: this._nomeproduto,
            quantidade: this._quantidade,
            precounitario: this._precounitario,
            subtotal: this._subtotal,
            observacoes: this._observacoes,
            tipo: this._tipo
        };
    }

    public static fromJSON(data: any): ItemPedido {
        return new ItemPedido(
            data.id,
            data.idpedido,
            data.idproduto,
            data.nomeproduto,
            data.quantidade,
            data.precounitario,
            data.subtotal,
            data.tipo || 'bebida', // valor padrão para compatibilidade com dados antigos
            data.observacoes
        );
    }
}
