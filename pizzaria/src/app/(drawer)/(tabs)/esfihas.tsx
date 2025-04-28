import { View, Text, StyleSheet, FlatList } from 'react-native';
import ProdutoCard from "../../../componest/produtoCard";
import { styles } from "../../../styles/esfihasStyles";
import React from "react";
import { FloatButton } from '../../../componest/float-button';
import { useRouter } from 'expo-router';

const esfihas = [
  { id: 1, nome: "Carne", preco: 10, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Frango com Catupiry", preco: 12, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Queijo", preco: 8, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Pizza de Calabresa", preco: 15, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Espinafre com Ricota", preco: 14, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Carne Seca com Abóbora", preco: 16, imagem: "https://via.placeholder.com/150" },
  { id: 7, nome: "Frango com Milho", preco: 12, imagem: "https://via.placeholder.com/150" },
  { id: 8, nome: "Cogumelos", preco: 13, imagem: "https://via.placeholder.com/150" },
  { id: 9, nome: "Portuguesa", preco: 14, imagem: "https://via.placeholder.com/150" },
  { id: 10, nome: "Lombo com Abacaxi", preco: 15, imagem: "https://via.placeholder.com/150" },
  { id: 11, nome: "Palmito", preco: 13, imagem: "https://via.placeholder.com/150" },
  { id: 12, nome: "Peito de Peru", preco: 12, imagem: "https://via.placeholder.com/150" }
];

const ListaEsfihas = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥟 Esfihas mais vendidas</Text>
  
      <FlatList
        horizontal={true}
        contentContainerStyle={styles.gridContainer2}
        showsHorizontalScrollIndicator={false}
        data={esfihas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            style={styles.cardHorizontal}
          />
        )}
      />

      <Text style={styles.title}>🥟 Escolha sua Esfiha</Text>
  
      <FlatList
        contentContainerStyle={styles.gridContainer1}
        data={esfihas}
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

export default ListaEsfihas;
