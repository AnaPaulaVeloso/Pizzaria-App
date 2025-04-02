import React from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import Card from "../components/Card"; // Corrigindo importação
import styles from "../style/globalStyles";

const pizzas = [
  { id: 1, nome: "Calabresa", preco: 30, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Portuguesa", preco: 32, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Frango com Catupiry", preco: 35, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Quatro Queijos", preco: 33, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Marguerita", preco: 31, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Chocolate", preco: 28, imagem: "https://via.placeholder.com/150" },
  { id: 1, nome: "Calabresa", preco: 30, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Portuguesa", preco: 32, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Frango com Catupiry", preco: 35, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Quatro Queijos", preco: 33, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Marguerita", preco: 31, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Chocolate", preco: 28, imagem: "https://via.placeholder.com/150" },
  { id: 1, nome: "Calabresa", preco: 30, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Portuguesa", preco: 32, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Frango com Catupiry", preco: 35, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Quatro Queijos", preco: 33, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Marguerita", preco: 31, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Chocolate", preco: 28, imagem: "https://via.placeholder.com/150" },
  { id: 1, nome: "Calabresa", preco: 30, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Portuguesa", preco: 32, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Frango com Catupiry", preco: 35, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Quatro Queijos", preco: 33, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Marguerita", preco: 31, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Chocolate", preco: 28, imagem: "https://via.placeholder.com/150" },
];

const ListaPizzas = () => {

  return (
    <View style={styles.container}>
        <Text style={styles.title}>🍕 Pizza mais vendidas </Text>
  
   <ScrollView 
  horizontal={true} // Habilita a rolagem horizontal
  contentContainerStyle={styles.gridContainer2}
  showsHorizontalScrollIndicator={false}
>

    {pizzas.map((pizza) => (
      <Card          

        key={pizza.id} // A chave única
        produto={pizza} // Corrigindo propriedade
        style={styles.cardHorizontal} // Estilo adicional

      />
    ))}
  </ScrollView>



      <Text style={styles.title}>🍕 Escolha sua Pizza</Text>
  
      <ScrollView contentContainerStyle={styles.gridContainer1}>
        {pizzas.map((pizza) => (
          <Card
            key={pizza.id} // A chave única
            produto={pizza} // Corrigindo propriedade
          />
        ))}
      </ScrollView>
    </View>
  );
};


export default ListaPizzas;
