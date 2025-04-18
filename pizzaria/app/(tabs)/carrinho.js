import { useRouter } from "expo-router";
import  Butao  from "../../components/butao"; // Corrigindo para o nome correto
import { View, Text, StyleSheet } from 'react-native';

const PagGarconetes = () => {
  const navigate = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opções Disponíveis</Text>
      
      <View style={styles.buttonContainer}>
        {/* <Butao 
          title="Selecionar Mesa" 
          onPress={() => navigate.push("/addpedido")} 
          

        /> */}

        <Text style={styles.title}>Selecione uma mesa</Text>
       
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
    textAlign: 'center',
    color: '#333', // Cor ajustada para melhorar a leitura
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  

});

export default PagGarconetes;
