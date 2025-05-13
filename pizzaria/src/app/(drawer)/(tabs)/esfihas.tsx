import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ESFIHAS_URL } from "../../../service/config";
import { Esfiha } from "../../../model/esfiha";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";

const ListaEsfihas = () => {
  const router = useRouter();
  const [esfihas, setEsfihas] = useState<Esfiha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ESFIHAS_URL)
      .then(res => res.json())
      .then(data => {
        setEsfihas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar esfihas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.sectionContainer}>
        <Text style={appStyles.title}>🥟 Esfihas mais vendidas</Text>
        <FlatList
          horizontal
          contentContainerStyle={appStyles.gridContainer2}
          showsHorizontalScrollIndicator={false}
          data={esfihas.slice(0, 5)} // Limitar a 5 itens na seção de mais vendidas
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

      <Text style={appStyles.subTitle}>🥟 Todas as Esfihas</Text>
      <FlatList
        horizontal
        contentContainerStyle={appStyles.gridContainer2}
        data={esfihas}
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

export default ListaEsfihas;
