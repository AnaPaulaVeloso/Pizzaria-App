import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import { useRouter } from 'expo-router';
import { API_BEBIDAS_URL } from "../../../service/config";
import { Bebida } from "../../../model/bebida";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";

const ListaBebidas = () => {
  const router = useRouter();
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BEBIDAS_URL)
      .then(res => res.json())
      .then(data => {
        setBebidas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar bebidas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.sectionContainer}>
        <Text style={appStyles.title}>🥤 Bebidas mais vendidas</Text>
        <FlatList
          horizontal
          contentContainerStyle={appStyles.gridContainer2}
          showsHorizontalScrollIndicator={false}
          data={bebidas.slice(0, 5)} // Limitar a 5 itens na seção de mais vendidas
          keyExtractor={(item) => `horizontal-${item.id?.toString() || Math.random().toString()}`}
          renderItem={({ item }) => (
            <Forma
              nome={item.nome}
              ingredientes={item.descricao || "Sem descrição"}
              imagem={`http://147.79.82.109:8000${item.imagem}`}
              preco={item.preco}
              horizontal={true}
              onPress={() => {/* Implementar ação ao clicar */}}
            />
          )}
        />
      </View>

      <Text style={appStyles.subTitle}>🥤 Todas as Bebidas</Text>
      <FlatList
        horizontal
        contentContainerStyle={appStyles.gridContainer2}
        data={bebidas}
        keyExtractor={(item) => `grid-${item.id?.toString() || Math.random().toString()}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Forma
            nome={item.nome}
            ingredientes={item.descricao || "Sem descrição"}
            imagem={`http://147.79.82.109:8000${item.imagem}`}
            preco={item.preco}
            horizontal={true}
            onPress={() => {/* Implementar ação ao clicar */}}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ListaBebidas;