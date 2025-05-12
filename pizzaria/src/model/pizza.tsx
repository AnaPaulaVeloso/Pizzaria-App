export interface Pizza {
    id: number;
    nome: string;
    preco: string; // vem como string por ser DecimalField
    ingredientes: string;
    imagem: string; // caminho da imagem, ex: /media/pizzas/portuguesa.jpg
}
