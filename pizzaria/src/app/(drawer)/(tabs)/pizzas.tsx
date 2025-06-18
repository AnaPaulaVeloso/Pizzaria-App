import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert , StyleSheet, Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import { API_PIZZAS_URL, API_IMAGENS_URL } from "../../../service/config";
import { Pizza } from "../../../model/pizza";
import ItemDetailModal, { ItemModalData, CarrinhoItem } from "../../../componest/itemModel"; // Renomeei 'Item' para 'ItemDetailModal' para clareza
import { useCarrinho } from "../../../context/CarrinhoContext";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";
import { ItemPedido } from "../../../model/itemPedido";
import Seta from "../../../componest/seta";

const ITEM_WIDTH = 200; // Largura aproximada de cada item
const SCREEN_WIDTH = Dimensions.get('window').width;

const PagPizzas = () => {
  const router = useRouter();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const maisVendidasRef = useRef<FlatList<Pizza>>(null);
  const todasPizzasRef = useRef<FlatList<Pizza>>(null);
  
  // Estados para controlar a visibilidade das setas
  const [maisVendidasSetaEsquerda, setMaisVendidasSetaEsquerda] = useState(false);
  const [maisVendidasSetaDireita, setMaisVendidasSetaDireita] = useState(true);
  const [todasPizzasSetaEsquerda, setTodasPizzasSetaEsquerda] = useState(false);
  const [todasPizzasSetaDireita, setTodasPizzasSetaDireita] = useState(true);

  const { adicionarAoCarrinho } = useCarrinho();

  const rolarParaEsquerda = (ref: React.RefObject<FlatList<Pizza> | null>) => {
    if (ref.current) {
      ref.current.scrollToOffset({
        offset: 0,
        animated: true
      });
    }
  };

  const rolarParaDireita = (ref: React.RefObject<FlatList<Pizza> | null>, totalItems: number) => {
    if (ref.current) {
      const maxOffset = (totalItems * ITEM_WIDTH) - SCREEN_WIDTH;
      ref.current.scrollToOffset({
        offset: Math.max(0, maxOffset),
        animated: true
      });
    }
  };

  const rolarContinuamente = (ref: React.RefObject<FlatList<Pizza> | null>, direcao: 'esquerda' | 'direita', totalItems: number) => {
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
    fetch(API_PIZZAS_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Adiciona a propriedade 'tipo' a cada objeto pizza
        // Isso é crucial para o TypeScript entender o tipo discriminado no modal
        const pizzasComTipo: Pizza[] = data.map((pizza: any) => ({
          ...pizza,
          tipo: 'pizza' as 'pizza' // Assegura o tipo literal 'pizza'
        }));
        setPizzas(pizzasComTipo);
        setLoading(false);

        // Verifica se há necessidade de mostrar as setas inicialmente
        const maisVendidasContentWidth = Math.min(5, pizzasComTipo.length) * ITEM_WIDTH;
        const todasPizzasContentWidth = pizzasComTipo.length * ITEM_WIDTH;

        setMaisVendidasSetaDireita(maisVendidasContentWidth > SCREEN_WIDTH);
        setTodasPizzasSetaDireita(todasPizzasContentWidth > SCREEN_WIDTH);
      })
      .catch(err => {
        console.error("Erro ao buscar pizzas:", err);
        Alert.alert("Erro", "Não foi possível carregar as pizzas. Tente novamente mais tarde.");
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
        'pizza', // tipo do item
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

  const maisVendidas = pizzas.slice(0, 5);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.sectionContainer}>
        <Text style={appStyles.title}>🍕 Pizzas mais vendidas</Text>
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

      <Text style={appStyles.subTitle}>🍕 Todas as Pizzas</Text>
      <View style={{ position: 'relative' }}>
        <FlatList
          ref={todasPizzasRef}
          horizontal
          contentContainerStyle={appStyles.gridContainer2}
          data={pizzas}
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
          onScroll={(event) => handleScroll(event, setTodasPizzasSetaEsquerda, setTodasPizzasSetaDireita, pizzas.length)}
          scrollEventThrottle={16}
        />
        <Seta
          direcao="esquerda"
          onPress={() => rolarParaEsquerda(todasPizzasRef)}
          onLongPress={() => rolarContinuamente(todasPizzasRef, 'esquerda', pizzas.length)}
          visivel={todasPizzasSetaEsquerda}
        />
        <Seta
          direcao="direita"
          onPress={() => rolarParaDireita(todasPizzasRef, pizzas.length)}
          onLongPress={() => rolarContinuamente(todasPizzasRef, 'direita', pizzas.length)}
          visivel={todasPizzasSetaDireita}
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

export default PagPizzas;
