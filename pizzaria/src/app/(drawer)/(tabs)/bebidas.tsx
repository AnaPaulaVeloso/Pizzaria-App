import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert , StyleSheet, Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import { API_BEBIDAS_URL, API_IMAGENS_URL } from "../../../service/config";
import { Bebida } from "../../../model/bebida";
import ItemDetailModal, { ItemModalData, CarrinhoItem } from "../../../componest/itemModel";
import { useCarrinho } from "../../../context/CarrinhoContext";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";
import { ItemPedido } from "../../../model/itemPedido";
import Seta from "../../../componest/seta";

const ITEM_WIDTH = 200; // Largura aproximada de cada item
const SCREEN_WIDTH = Dimensions.get('window').width;

const PagBebidas = () => {
  const router = useRouter();
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const maisVendidasRef = useRef<FlatList<Bebida>>(null);
  const todasBebidasRef = useRef<FlatList<Bebida>>(null);
  
  // Estados para controlar a visibilidade das setas
  const [maisVendidasSetaEsquerda, setMaisVendidasSetaEsquerda] = useState(false);
  const [maisVendidasSetaDireita, setMaisVendidasSetaDireita] = useState(true);
  const [todasBebidasSetaEsquerda, setTodasBebidasSetaEsquerda] = useState(false);
  const [todasBebidasSetaDireita, setTodasBebidasSetaDireita] = useState(true);

  const { adicionarAoCarrinho } = useCarrinho();

  const rolarParaEsquerda = (ref: React.RefObject<FlatList<Bebida> | null>) => {
    if (ref.current) {
      ref.current.scrollToOffset({
        offset: 0,
        animated: true
      });
    }
  };

  const rolarParaDireita = (ref: React.RefObject<FlatList<Bebida> | null>, totalItems: number) => {
    if (ref.current) {
      const maxOffset = (totalItems * ITEM_WIDTH) - SCREEN_WIDTH;
      ref.current.scrollToOffset({
        offset: Math.max(0, maxOffset),
        animated: true
      });
    }
  };

  const rolarContinuamente = (ref: React.RefObject<FlatList<Bebida> | null>, direcao: 'esquerda' | 'direita', totalItems: number) => {
    if (ref.current) {
      if (direcao === 'esquerda') {
        ref.current.scrollToOffset({
          offset: 0,
          animated: true
        });
      } else {
        const maxOffset = (totalItems * ITEM_WIDTH) - SCREEN_WIDTH;
        ref.current.scrollToOffset({
          offset: Math.max(0, maxOffset),
          animated: true
        });
      }
    }
  };

  const handleScroll = (event: any, setSetaEsquerda: (value: boolean) => void, setSetaDireita: (value: boolean) => void, totalItems: number) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    
    // Verifica se chegou ao início
    setSetaEsquerda(contentOffset.x > 0);
    
    // Verifica se chegou ao fim
    const maxOffset = (totalItems * ITEM_WIDTH) - SCREEN_WIDTH;
    const isEnd = contentOffset.x >= maxOffset;
    setSetaDireita(!isEnd);
  };

  useEffect(() => {
    fetch(API_BEBIDAS_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const bebidasComTipo: Bebida[] = data.map((bebida: any) => ({
          ...bebida,
          tipo: 'bebida' as 'bebida'
        }));
        setBebidas(bebidasComTipo);
        setLoading(false);

        // Verifica se há necessidade de mostrar as setas inicialmente
        const maisVendidasContentWidth = Math.min(5, bebidasComTipo.length) * ITEM_WIDTH;
        const todasBebidasContentWidth = bebidasComTipo.length * ITEM_WIDTH;

        setMaisVendidasSetaDireita(maisVendidasContentWidth > SCREEN_WIDTH);
        setTodasBebidasSetaDireita(todasBebidasContentWidth > SCREEN_WIDTH);
      })
      .catch(err => {
        console.error("Erro ao buscar bebidas:", err);
        Alert.alert("Erro", "Não foi possível carregar as bebidas. Tente novamente mais tarde.");
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (item: ItemModalData) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleAddItemToCart = (itemToAdd: CarrinhoItem) => {
    try {
      const itemPedido = new ItemPedido(
        0,
        0,
        itemToAdd.id,
        itemToAdd.nome,
        itemToAdd.quantidade,
        itemToAdd.precoUnitario,
        itemToAdd.quantidade * itemToAdd.precoUnitario,
        'bebida',
        itemToAdd.observacao
      );
      
      adicionarAoCarrinho(itemPedido);
      Alert.alert("Item Adicionado", `${itemToAdd.nome} foi adicionado ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o item ao carrinho. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const maisVendidas = bebidas.slice(0, 5);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.sectionContainer}>
        <Text style={appStyles.title}>🥤 Bebidas mais vendidas</Text>
        <View style={{ position: 'relative' }}>
          <FlatList
            ref={maisVendidasRef}
            horizontal
            contentContainerStyle={appStyles.gridContainer2}
            showsHorizontalScrollIndicator={false}
            data={maisVendidas}
            keyExtractor={(item) => `horizontal-${item.id.toString()}`}
            renderItem={({ item }) => (
              <Forma
                nome={item.nome}
                ingredientes={item.descricao || "Sem descrição"}
                imagem={`${API_IMAGENS_URL}${item.imagem}`}
                preco={item.preco}
                horizontal={true}
                onPress={() => handleOpenModal(item)}
              />
            )}
            onScroll={(event) => handleScroll(event, setMaisVendidasSetaEsquerda, setMaisVendidasSetaDireita, maisVendidas.length)}
            scrollEventThrottle={16}
          />
          <Seta
            direcao="esquerda"
            onPress={() => rolarParaEsquerda(maisVendidasRef)}
            onLongPress={() => rolarContinuamente(maisVendidasRef, 'esquerda', maisVendidas.length)}
            visivel={maisVendidasSetaEsquerda}
          />
          <Seta
            direcao="direita"
            onPress={() => rolarParaDireita(maisVendidasRef, maisVendidas.length)}
            onLongPress={() => rolarContinuamente(maisVendidasRef, 'direita', maisVendidas.length)}
            visivel={maisVendidasSetaDireita}
          />
        </View>
      </View>

      <Text style={appStyles.subTitle}>🥤 Todas as Bebidas</Text>
      <View style={{ position: 'relative' }}>
        <FlatList
          ref={todasBebidasRef}
          horizontal
          contentContainerStyle={appStyles.gridContainer2}
          data={bebidas}
          keyExtractor={(item) => `grid-${item.id.toString()}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Forma
              nome={item.nome}
              ingredientes={item.descricao || "Sem descrição"}
              imagem={`${API_IMAGENS_URL}${item.imagem}`}
              preco={item.preco}
              horizontal={true}
              onPress={() => handleOpenModal(item)}
            />
          )}
          onScroll={(event) => handleScroll(event, setTodasBebidasSetaEsquerda, setTodasBebidasSetaDireita, bebidas.length)}
          scrollEventThrottle={16}
        />
        <Seta
          direcao="esquerda"
          onPress={() => rolarParaEsquerda(todasBebidasRef)}
          onLongPress={() => rolarContinuamente(todasBebidasRef, 'esquerda', bebidas.length)}
          visivel={todasBebidasSetaEsquerda}
        />
        <Seta
          direcao="direita"
          onPress={() => rolarParaDireita(todasBebidasRef, bebidas.length)}
          onLongPress={() => rolarContinuamente(todasBebidasRef, 'direita', bebidas.length)}
          visivel={todasBebidasSetaDireita}
        />
      </View>

      <ItemDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={handleCloseModal}
        onAddItem={handleAddItemToCart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default PagBebidas;