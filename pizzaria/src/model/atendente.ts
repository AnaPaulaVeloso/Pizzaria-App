// model/atendente.ts
export class Atendente {
    private _n_cracha: number; // Assumindo number como no backend
    private _nome: string;
    private _senha: string; // Senha deve ser tratada com cuidado, idealmente não trafegada aqui após o login
    private _foto?: string | null;

    constructor(n_cracha: number, nome: string, senha: string, foto?: string | null) {
        this._n_cracha = n_cracha;
        this._nome = nome;
        this._senha = senha;
        this._foto = foto;
    }

    // Getters
    public get n_cracha(): number { return this._n_cracha; }
    public get nome(): string { return this._nome; }
    public get senha(): string { return this._senha; } // Cuidado ao expor senha
    public get foto(): string | null | undefined { return this._foto; }

    // Setters (se necessário para atualizações)
    public set nome(value: string) { this._nome = value; }
    public set foto(value: string | null | undefined) { this._foto = value; }

    // Método para converter de JSON (recebido da API) para a instância da classe
    public static fromJSON(data: any): Atendente {
        return new Atendente(
            data.n_cracha,
            data.nome,
            data.senha, // Se a senha for retornada, embora não seja recomendado
            data.foto
        );
    }

    // Método para converter a instância da classe para JSON (para enviar à API, se houver PUT/POST de Atendente)
    public toJSON() {
        return {
            n_cracha: this._n_cracha,
            nome: this._nome,
            senha: this._senha, // Cuidado aqui, idealmente não enviar senha em operações de leitura/atualização
            foto: this._foto
        };
    }
}