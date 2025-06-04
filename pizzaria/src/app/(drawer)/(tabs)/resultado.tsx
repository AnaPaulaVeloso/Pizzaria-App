import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ResultadoScreen() {
  const { predicao } = useLocalSearchParams();
  const pedido = JSON.parse(predicao as string);

  // Função para determinar qual imagem mostrar baseado no tipo
  const getPizzaImage = () => {
    if (pedido.tipo_predito.toLowerCase().includes('doce')) {
      return require('../../../assets/pizza-doce.png');
    } else {
      return require('../../../assets/pizza-salgada.png');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require("../../../assets/B1.png")} style={styles.logo} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Image 
            source={getPizzaImage()} 
            style={styles.pizzaImage}
            resizeMode="contain"
          />
          
          <Text style={styles.cardTitle}>{pedido.tipo_predito}</Text>
          <Text style={styles.cardSubtitle}>{pedido.sabor_predito}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Quantidade de Pessoas:</Text>
              <Text style={styles.infoValue}>{pedido.quantidade_pessoas}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Probabilidade do Tipo:</Text>
              <Text style={styles.infoValue}>{(pedido.probabilidade_tipo * 100).toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerLogo: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  pizzaImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8C030E',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8C030E',
  },
  button: {
    backgroundColor: "#8C030E",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

