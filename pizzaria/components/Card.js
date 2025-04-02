import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import card from '../style/Style_card'; // Certifique-se de que a exportação está correta
// import { useCarrinho } from '../context/CarrinhoContext';

const ProdutoCard =  ({ produto }) => {
  // const { adicionarAoCarrinho } = useCarrinho(); // Desestruturação correta

  return (
    <View style={card.container2}>
      <TouchableOpacity
        onPress={() => {
          // adicionarAoCarrinho(produto);
          alert("Produto adicionado ao carrinho");
        }}
      >
        <Image source={{ uri: produto.imagem }} style={produto.imagens} />
        <Text style={produto.texto}>{produto.nome}</Text>
        <Text style={produto.texto}>R$ {produto.preco}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProdutoCard;