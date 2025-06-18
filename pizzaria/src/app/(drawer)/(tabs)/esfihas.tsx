import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert , StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ESFIHAS_URL, API_IMAGENS_URL } from "../../../service/config";
import { Esfiha } from "../../../model/esfiha";
import ItemDetailModal, { ItemModalData, CarrinhoItem } from "../../../componest/itemModel"; // Renomeei 'Item' para 'ItemDetailModal' para clareza
import { useCarrinho } from "../../../context/CarrinhoContext";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";
import { ItemPedido } from "../../../model/itemPedido";
import Seta from "../../../componest/seta";

const ITEM_WIDTH = 200; // Largura aproximada de cada item
const SCREEN_WIDTH = Dimensions.get('window').width;

const PagEsfihas = () => {
  const router = useRouter();
  const [esfihas, setEsfihas] = useState<Esfiha[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Estado para visibilidade do modal
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null); // Estado para o item selecionado
  const maisVendidasRef = useRef<FlatList<Esfiha>>(null);
  const todasEsfihasRef = useRef<FlatList<Esfiha>>(null);
  
  // Estados para controlar a visibilidade das setas
  const [maisVendidasSetaEsquerda, setMaisVendidasSetaEsquerda] = useState(false);
  const [maisVendidasSetaDireita, setMaisVendidasSetaDireita] = useState(true);
  const [todasEsfihasSetaEsquerda, setTodasEsfihasSetaEsquerda] = useState(false);
  const [todasEsfihasSetaDireita, setTodasEsfihasSetaDireita] = useState(true);

  const { adicionarAoCarrinho } = useCarrinho();

  const rolarParaEsquerda = (ref: React.RefObject<FlatList<Esfiha> | null>) => {
    if (ref.current) {
      ref.current.scrollToOffset({
        offset: 0,
        animated: true
      });
    }
  };

  const rolarParaDireita = (ref: React.RefObject<FlatList<Esfiha> | null>, totalItems: number) => {
    if (ref.current) {
      const maxOffset = (totalItems * ITEM_WIDTH) - SCREEN_WIDTH;
      ref.current.scrollToOffset({
        offset: Math.max(0, maxOffset),
        animated: true
      });
    }
  };

  const rolarContinuamente = (ref: React.RefObject<FlatList<Esfiha> | null>, direcao: 'esquerda' | 'direita', totalItems: number) => {
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
    fetch(API_ESFIHAS_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // **Crucial:** Adiciona a propriedade 'tipo' a cada objeto esfiha
        const esfihasComTipo: Esfiha[] = data.map((esfiha: any) => ({
          ...esfiha,
          tipo: 'esfiha' as 'esfiha' // Assegura o tipo literal 'esfiha'
        }));
        setEsfihas(esfihasComTipo);
        setLoading(false);

        // Verifica se há necessidade de mostrar as setas inicialmente
        const maisVendidasContentWidth = Math.min(5, esfihasComTipo.length) * ITEM_WIDTH;
        const todasEsfihasContentWidth = esfihasComTipo.length * ITEM_WIDTH;

        setMaisVendidasSetaDireita(maisVendidasContentWidth > SCREEN_WIDTH);
        setTodasEsfihasSetaDireita(todasEsfihasContentWidth > SCREEN_WIDTH);
      })
      .catch(err => {
        console.error("Erro ao buscar esfihas:", err);
        Alert.alert("Erro", "Não foi possível carregar as esfihas. Tente novamente mais tarde.");
        setLoading(false);
      });
  }, []);

  // Função para abrir o modal com o item selecionado
  const handleOpenModal = (item: ItemModalData) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null); // Limpa o item selecionado
  };

  // Função para adicionar o item ao carrinho
  const handleAddItemToCart = (itemToAdd: CarrinhoItem) => {
    try {
      const itemPedido = new ItemPedido(
        0, // id será gerado pelo backend
        0, // idpedido será atualizado quando o pedido for salvo
        itemToAdd.id,
        itemToAdd.nome,
        itemToAdd.quantidade,
        itemToAdd.precoUnitario,
        itemToAdd.quantidade * itemToAdd.precoUnitario,
        'esfiha', // tipo do item
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

  const maisVendidas = esfihas.slice(0, 5);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.sectionContainer}>
        <Text style={appStyles.title}>🥟 Esfihas mais vendidas</Text>
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
                ingredientes={item.ingredientes}
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

      <Text style={appStyles.subTitle}>🥟 Todas as Esfihas</Text>
      <View style={{ position: 'relative' }}>
        <FlatList
          ref={todasEsfihasRef}
          horizontal
          contentContainerStyle={appStyles.gridContainer2}
          data={esfihas}
          keyExtractor={(item) => `grid-${item.id.toString()}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Forma
              nome={item.nome}
              ingredientes={item.ingredientes}
              imagem={`${API_IMAGENS_URL}${item.imagem}`}
              preco={item.preco}
              horizontal={true}
              onPress={() => handleOpenModal(item)}
            />
          )}
          onScroll={(event) => handleScroll(event, setTodasEsfihasSetaEsquerda, setTodasEsfihasSetaDireita, esfihas.length)}
          scrollEventThrottle={16}
        />
        <Seta
          direcao="esquerda"
          onPress={() => rolarParaEsquerda(todasEsfihasRef)}
          onLongPress={() => rolarContinuamente(todasEsfihasRef, 'esquerda', esfihas.length)}
          visivel={todasEsfihasSetaEsquerda}
        />
        <Seta
          direcao="direita"
          onPress={() => rolarParaDireita(todasEsfihasRef, esfihas.length)}
          onLongPress={() => rolarContinuamente(todasEsfihasRef, 'direita', esfihas.length)}
          visivel={todasEsfihasSetaDireita}
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
    // Você pode precisar ajustar ou adicionar mais estilos aqui
    // para 'listContent' ou 'columnWrapper' se os layouts forem diferentes
    // para as listas horizontal e vertical.
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});

export default PagEsfihas;
