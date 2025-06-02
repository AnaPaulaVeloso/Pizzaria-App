import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert , StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { API_PIZZAS_URL, API_IMAGENS_URL } from "../../../service/config";
import { Pizza } from "../../../model/pizza";
import ItemDetailModal, { ItemModalData, CarrinhoItem } from "../../../componest/itemModel"; // Renomeei 'Item' para 'ItemDetailModal' para clareza
import { useCarrinho } from "../../../context/CarrinhoContext";
import Forma from "../../../componest/forma";
import appStyles from "../../../styles/appStyles";
import { ItemPedido } from "../../../model/itemPedido";

const PagPizzas = () => {
  const router = useRouter();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);

  const { adicionarAoCarrinho } = useCarrinho();

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
              imagem={`${API_IMAGENS_URL}${item.imagem}`}
              preco={item.preco}
              horizontal={true}
              onPress={() => handleOpenModal(item)}
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
            imagem={`${API_IMAGENS_URL}${item.imagem}`}
            preco={item.preco}
            horizontal={true}
            onPress={() => handleOpenModal(item)}
          />
        )}
      />

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
