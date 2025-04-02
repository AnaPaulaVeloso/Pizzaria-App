import { useRouter } from 'expo-router';
import Butao  from '../components/butao'; // Certifique-se de que o Butao esteja adaptado para React Native
import { View, Text, StyleSheet } from 'react-native';

const PagAdicionarPedido = () => {
  const navigate = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Pedido</Text>
      <View style={styles.buttonContainer}>
        <Butao
          title="🍕 Escolher Pizza"
          onPress={() => navigate.push("/PagPizzas")}
        />
        <Butao
          title="🥟 Escolher Esfiha"
          onPress={() => navigate.push("/PagEsfihas")}
        />
        <Butao
          title="🥤 Escolher Bebida"
          onPress={() => navigate.push("/PagBebidas")}
        />
        <Butao
          title="🛒 Carrinho de Compras"
          onPress={() => navigate.push("/PagCarrinho")}
        />
        <Butao
          title="📜 sujeição de pedido"
          onPress={() => navigate.push("/pedido")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  
});

export default PagAdicionarPedido;
