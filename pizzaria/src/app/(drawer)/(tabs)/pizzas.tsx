import React from "react";
import { View, Text, FlatList, Alert } from "react-native";
import ProdutoCard from "../../../componest/produtoCard";
import { FloatButton } from '../../../componest/float-button';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { styles } from "../../../styles/pizzasStyles";
import { globalStyles } from "../../../styles/globalStyles";

const pizzas = [
  { id: 1, nome: "Calabresa", preco: 30, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Portuguesa", preco: 32, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Frango com Catupiry", preco: 35, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Quatro Queijos", preco: 33, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Marguerita", preco: 31, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Chocolate", preco: 28, imagem: "https://via.placeholder.com/150" },
];

const PagPizzas = () => {
  const navigate = useRouter();
  const [sabor, setSabor] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [borda, setBorda] = useState("");

  const adicionarPizza = () => {
    if (!sabor || !tamanho) {
      Alert.alert("Erro", "Selecione um sabor e um tamanho antes de continuar.");
      return;
    }

    const pedidoPizza = {
      sabor,
      tamanho,
      borda,
    };

    console.log("Pizza adicionada:", pedidoPizza);
    Alert.alert("Sucesso", "Pizza adicionada ao pedido com sucesso!");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>🍕 Pizzas mais vendidas</Text>

      <FlatList
        horizontal={true}
        contentContainerStyle={globalStyles.gridContainer2}
        showsHorizontalScrollIndicator={false}
        data={pizzas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            style={globalStyles.cardHorizontal}
          />
        )}
      />

      <Text style={globalStyles.title}>🍕 Escolha sua Pizza</Text>

      <FlatList
        contentContainerStyle={globalStyles.gridContainer1}
        data={pizzas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
          />
        )}
      />

   

      
    </View>
  );
};

export default PagPizzas;
