import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { FloatButton } from '../../../componest/float-button';
import { useRouter } from 'expo-router';
import { styles } from "../../../styles/bebidasStyles"; // Importe os estilos corretos para bebidas
import { globalStyles } from "../../../styles/globalStyles";
import { API_BEBIDAS_URL } from "../../../service/config";
import { Bebida } from "../../../model/bebida"; // Certifique-se de ter o modelo Bebida
import Forma from "../../../componest/forma"; // Reutilizando o componente Forma

const ListaBebidas = () => {
  const router = useRouter();
  const [bebidas, setBebidas] = useState<Bebida[]>([]);

  useEffect(() => {
    fetch(API_BEBIDAS_URL)
      .then(res => res.json())
      .then(data => setBebidas(data))
      .catch(err => console.error("Erro ao buscar bebidas:", err));
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>🥤 Bebidas mais vendidas</Text>

      <FlatList
        horizontal
        contentContainerStyle={globalStyles.gridContainer2}
        showsHorizontalScrollIndicator={false}
        data={bebidas}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Forma
            nome={item.nome}
            ingredientes={item.descricao || "Sem descrição"} // Usando descrição como ingredientes
            imagem={`http://localhost:8000${item.imagem}`}
            preco={item.preco}
          />
        )}
      />

      <Text style={globalStyles.title}>🥤 Escolha sua Bebida</Text>

      <FlatList
        contentContainerStyle={globalStyles.gridContainer1}
        data={bebidas}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        numColumns={2} // Exibindo em duas colunas, ajuste conforme necessário
        renderItem={({ item }) => (
          <Forma
            nome={item.nome}
            ingredientes={item.descricao || "Sem descrição"} // Usando descrição como ingredientes
            imagem={`http://localhost:8000${item.imagem}`}
            preco={item.preco}
          />
        )}
      />

      {/* O FloatButton pode ser usado para adicionar novas bebidas, se necessário */}
      {/* <FloatButton onPress={() => router.push('/cadastroBebida')} /> */}
    </View>
  );
};

export default ListaBebidas;