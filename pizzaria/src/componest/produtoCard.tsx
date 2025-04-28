import React from 'react';
import { Text, Image, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import card from '../styles/cardStyles';
import { globalStyles } from '../styles/globalStyles';
// import { useCarrinho } from '../context/CarrinhoContext';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
}

interface ProdutoCardProps {
  produto: Produto;
  style?: StyleProp<ViewStyle>;
}

const ProdutoCard = ({ produto, style }: ProdutoCardProps) => {
  // const { adicionarAoCarrinho } = useCarrinho(); // Desestruturação correta

  return (
    <View style={[card.container2, style]}>
      <TouchableOpacity
        onPress={() => {
          // adicionarAoCarrinho(produto);
          alert("Produto adicionado ao carrinho");
        }}
      >
        <Image source={{ uri: produto.imagem }} style={card.imagem} />
        <Text style={card.texto}>{produto.nome}</Text>
        <Text style={card.texto}>R$ {produto.preco}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProdutoCard;