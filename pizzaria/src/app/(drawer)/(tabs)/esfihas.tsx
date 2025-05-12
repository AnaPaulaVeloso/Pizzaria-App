import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from 'react-native';
import { FloatButton } from '../../../componest/float-button';
import { useRouter } from 'expo-router';
import { styles } from "../../../styles/esfihasStyles";
import { API_ESFIHAS_URL } from "../../../service/config";
import { Esfiha } from "../../../model/esfiha";
import Forma from "../../../componest/forma";

const ListaEsfihas = () => {
  const router = useRouter();
  const [esfihas, setEsfihas] = useState<Esfiha[]>([]);

  useEffect(() => {
    fetch(API_ESFIHAS_URL)
      .then(res => res.json())
      .then(data => setEsfihas(data))
      .catch(err => console.error("Erro ao buscar esfihas:", err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥟 Esfihas mais vendidas</Text>

      <FlatList
        horizontal
        contentContainerStyle={styles.gridContainer2}
        showsHorizontalScrollIndicator={false}
        data={esfihas}
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

      <Text style={styles.title}>🥟 Escolha sua Esfiha</Text>

      <FlatList
        horizontal
        contentContainerStyle={styles.gridContainer2}
        showsHorizontalScrollIndicator={false}
        data={esfihas}
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

export default ListaEsfihas;
