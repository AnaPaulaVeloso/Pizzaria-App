import { View, Text, StyleSheet, FlatList } from 'react-native';
import ProdutoCard from "../../../componest/produtoCard";
import { styles } from "../../../styles/bebidasStyles";
import { FloatButton } from '../../../componest/float-button';
import { useRouter } from 'expo-router';

const bebidas = [
  { id: 1, nome: "Coca-Cola 2L", preco: 10, imagem: "https://via.placeholder.com/150" },
  { id: 2, nome: "Guaraná 2L", preco: 9, imagem: "https://via.placeholder.com/150" },
  { id: 3, nome: "Fanta 2L", preco: 9, imagem: "https://via.placeholder.com/150" },
  { id: 4, nome: "Sprite 2L", preco: 9, imagem: "https://via.placeholder.com/150" },
  { id: 5, nome: "Água Mineral 500ml", preco: 3, imagem: "https://via.placeholder.com/150" },
  { id: 6, nome: "Suco de Laranja 1L", preco: 8, imagem: "https://via.placeholder.com/150" },
  { id: 7, nome: "Suco de Uva 1L", preco: 8, imagem: "https://via.placeholder.com/150" },
  { id: 8, nome: "Cerveja 600ml", preco: 7, imagem: "https://via.placeholder.com/150" },
  { id: 9, nome: "Refrigerante Lata", preco: 5, imagem: "https://via.placeholder.com/150" },
  { id: 10, nome: "Água de Coco", preco: 6, imagem: "https://via.placeholder.com/150" },
  { id: 11, nome: "Energético", preco: 8, imagem: "https://via.placeholder.com/150" },
  { id: 12, nome: "Chá Gelado", preco: 4, imagem: "https://via.placeholder.com/150" }
];

const ListaBebidas = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥤 Bebidas mais vendidas</Text>
  
      <FlatList
        horizontal={true}
        contentContainerStyle={styles.buttonGroup}
        showsHorizontalScrollIndicator={false}
        data={bebidas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
          />
        )}
      />

      <Text style={styles.title}>🥤 Escolha sua Bebida</Text>
  
      <FlatList
        contentContainerStyle={styles.buttonGroup}
        data={bebidas}
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

export default ListaBebidas;
