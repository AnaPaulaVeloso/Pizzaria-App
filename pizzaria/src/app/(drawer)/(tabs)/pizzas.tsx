import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { FloatButton } from '../../../componest/float-button';
import { useRouter } from 'expo-router';
import { styles } from "../../../styles/pizzasStyles";
import { globalStyles } from "../../../styles/globalStyles";
import { API_PIZZAS_URL } from "../../../service/config";
import { Pizza } from "../../../model/pizza";
import Forma from "../../../componest/forma";

const PagPizzas = () => {
  const router = useRouter();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  useEffect(() => {
    fetch(API_PIZZAS_URL)
      .then(res => res.json())
      .then(data => setPizzas(data))
      .catch(err => console.error("Erro ao buscar pizzas:", err));
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>🍕 Pizzas mais vendidas</Text>

      <FlatList
        horizontal
        contentContainerStyle={globalStyles.gridContainer2}
        showsHorizontalScrollIndicator={false}
        data={pizzas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Forma
            nome={item.nome}
            ingredientes={item.ingredientes}
            imagem={`http://localhost:8000${item.imagem}`}
            preco={item.preco}
          />
        )}
      />

      <Text style={globalStyles.title}>🍕 Escolha sua Pizza</Text>

      <FlatList
        contentContainerStyle={globalStyles.gridContainer1}
        data={pizzas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Forma
            nome={item.nome}
            ingredientes={item.ingredientes}
            imagem={`http://localhost:8000${item.imagem}`}
            preco={item.preco}
          />
        )}
      />
    </View>
  );
};

export default PagPizzas;
