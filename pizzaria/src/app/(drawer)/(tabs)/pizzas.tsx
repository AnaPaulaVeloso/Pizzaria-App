import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import { useRouter } from 'expo-router';
import { API_PIZZAS_URL } from "../../../service/config";
import { Pizza } from "../../../model/pizza";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";

const PagPizzas = () => {
  const router = useRouter();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_PIZZAS_URL)
      .then(res => res.json())
      .then(data => {
        setPizzas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar pizzas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.sectionContainer}>
        <Text style={appStyles.title}>🍕 Pizzas mais vendidas</Text>
        <FlatList
          horizontal
          contentContainerStyle={appStyles.gridContainer2}
          showsHorizontalScrollIndicator={false}
          data={pizzas.slice(0, 5)} // Limitar a 5 itens na seção de mais vendidas
          keyExtractor={(item) => `horizontal-${item.id.toString()}`}
          renderItem={({ item }) => (
            <Forma
              nome={item.nome}
              ingredientes={item.ingredientes}
              imagem={`http://localhost:8000${item.imagem}`}
              preco={item.preco}
              horizontal={true}
              onPress={() => {/* Implementar ação ao clicar */}}
            />
          )}
        />
      </View>

      <Text style={appStyles.subTitle}>🍕 Todas as Pizzas</Text>
      <FlatList
        horizontal
        contentContainerStyle={appStyles.gridContainer2}
        data={pizzas}
        keyExtractor={(item) => `grid-${item.id.toString()}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Forma
            nome={item.nome}
            ingredientes={item.ingredientes}
            imagem={`http://localhost:8000${item.imagem}`}
            preco={item.preco}
            horizontal={true}
            onPress={() => {/* Implementar ação ao clicar */}}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default PagPizzas;
