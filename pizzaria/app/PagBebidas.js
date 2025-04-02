import { useRouter } from 'expo-router';
import { useState } from 'react';
import Butao from '../components/butao'; // Certifique-se de que o Butao esteja adaptado para React Native
import { View, Text, StyleSheet, Alert } from 'react-native';

const PagBebidas = () => {
  const navigate = useRouter();
  const [bebida, setBebida] = useState("");
  const [comGelo, setComGelo] = useState(false);
  const [tipoLimao, setTipoLimao] = useState("");

  const adicionarBebida = () => {
    if (!bebida) {
      Alert.alert("Erro", "Selecione uma bebida antes de continuar.");
      return;
    }

    const pedidoBebida = {
      bebida,
      comGelo,
      tipoLimao: comGelo ? tipoLimao : "",
    };

    console.log("Bebida adicionada:", pedidoBebida);
    navigate.push("/PagACarrinho");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥤 Escolha sua Bebida</Text>

      <View style={styles.card}>
        <Text style={styles.subTitle}>Tipo de Bebida</Text>
        <View style={styles.buttonGroup}>
          <Butao 
            title="🥤 Refrigerante"
            onPress={() => setBebida("Refrigerante")}
            style={bebida === "Refrigerante" ? { backgroundColor: "#3B82F6" } : {}}
          />
          <Butao 
            title="🍊 Suco"
            onPress={() => setBebida("Suco")}
            style={bebida === "Suco" ? { backgroundColor: "#10B981" } : {}}
          />
        </View>

        <Text style={styles.subTitle}>Deseja com gelo?</Text>
        <View style={styles.buttonGroup}>
          <Butao 
            title="❄️ Sim"
            onPress={() => setComGelo(true)}
            style={comGelo ? { backgroundColor: "#3B82F6" } : {}}
          />
          <Butao 
            title="🚫 Não"
            onPress={() => setComGelo(false)}
            style={!comGelo ? { backgroundColor: "#EF4444" } : {}}
          />
        </View>

        {comGelo && (
          <>
            <Text style={styles.subTitle}>Tipo de Limão</Text>
            <View style={styles.buttonGroup}>
              <Butao 
                title="🍋 Rodela"
                onPress={() => setTipoLimao("Rodela")}
                style={tipoLimao === "Rodela" ? { backgroundColor: "#F59E0B" } : {}}
              />
              <Butao 
                title="🍹 Espremido"
                onPress={() => setTipoLimao("Espremido")}
                style={tipoLimao === "Espremido" ? { backgroundColor: "#F59E0B" } : {}}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Butao title="✅ Adicionar ao Pedido" onPress={adicionarBebida} />
        <Butao title="🔙 Voltar" onPress={() => navigate.push("/PagAddPedido")} />
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
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
    alignItems: 'center',
  },
});

export default PagBebidas;
