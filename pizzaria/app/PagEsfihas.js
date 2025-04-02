import { View, Text, StyleSheet,ScrollView} from 'react-native'; // Importando os componentes do React Native
import Card from "../components/Card"; // Corrigindo importação
import styles from "../style/globalStyles";
import React from "react";


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

  return (
    <View style={styles.container}>
        <Text style={styles.title}>🥟 Esfihas mais vendidas </Text>
  
   <ScrollView 
  horizontal={true} // Habilita a rolagem horizontal
  contentContainerStyle={styles.gridContainer2}
  showsHorizontalScrollIndicator={false}
>

    {esfihas.map((esfiha) => (
      <Card          

        key={esfiha.id} // A chave única
        produto={esfiha} // Corrigindo propriedade
        style={styles.cardHorizontal} // Estilo adicional

      />
    ))}
  </ScrollView>



      <Text style={styles.title}>🥟 Escolha sua Esfihas</Text>
  
      <ScrollView contentContainerStyle={styles.gridContainer1}>
        {esfihas.map((esfiha) => (
          <Card
            key={esfiha.id} // A chave única
            produto={esfiha} // Corrigindo propriedade
          />
        ))}
      </ScrollView>
    </View>
  );
};


export default ListaEsfihas;
