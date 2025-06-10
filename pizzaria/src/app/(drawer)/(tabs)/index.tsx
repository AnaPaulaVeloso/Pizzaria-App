import { Avatar } from "../../../componest/avatar";
import { useRouter } from "expo-router";
import { Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import appStyles from "../../../styles/appStyles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../service/api_db";
import { usePedidoInfo } from '../../../context/pedidoInfoContext';

// Tipo para os itens do menu
interface MenuItem {
  id: string;
  nome: string;
  imagem: string;
  descricao: string;
  route: string;
}

// Dados para os cards da página inicial
const menuItems: MenuItem[] = [
  {
    id: '1',
    nome: 'Pizzas',
    imagem: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg',
    descricao: 'Escolha sua pizza favorita',
    route: '/pizzas'
  },
  {
    id: '2',
    nome: 'Esfihas',
    imagem: require('../../../assets/imagens/esfiha.jpg'),
    descricao: 'Deliciosas esfihas',
    route: '/esfihas'
  },
  {
    id: '3',
    nome: 'Bebidas',
    imagem: require('../../../assets/imagens/bebida.jpg'),

    descricao: 'Refrigerantes e sucos',
    route: '/bebidas'
  },
  {
    id: '4',
    nome: 'Sugestão de Pedido',
    imagem: require('../../../assets/imagens/sugestao.jpg'),

    descricao: 'Recomendações do dia',
    route: '/resultado'
  }
];

// Interface para as props do componente MenuCard
interface MenuCardProps {
  item: MenuItem;
  onPress: () => void;
}

// Componente de Card personalizado para a página inicial
const MenuCard = ({ item, onPress }: MenuCardProps) => {
  return (
    <TouchableOpacity 
      style={appStyles.formaContainer} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={typeof item.imagem === 'string' ? { uri: item.imagem } : item.imagem} 
        style={appStyles.forma} 
      />
      <Text style={appStyles.textoCard} numberOfLines={1}>
        {item.nome}
      </Text>
      <Text style={appStyles.ingredientesText} numberOfLines={2}>
        {item.descricao}
      </Text>
    </TouchableOpacity>
  );
};

export default function Home() {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const { atendenteLogado, pedidoAtual } = usePedidoInfo();

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        if (atendenteLogado?.foto) {
          setUserPhoto(atendenteLogado.foto);
        }
      } catch (error) {
        console.error("Erro ao buscar foto do usuário:", error);
      }
    };

    fetchUserPhoto();
  }, [atendenteLogado]);

  const handleSugestaoPress = async () => {
    try {
      if (!pedidoAtual) {
        Alert.alert('Atenção', 'Você precisa iniciar um pedido primeiro para obter sugestões.');
        return;
      }

      const sugestao = await api.obterSugestao(pedidoAtual.quantidadepessoas);
      router.push({
        pathname: '/resultado',
        params: { predicao: JSON.stringify(sugestao) }
      });
    } catch (error) {
      console.error('Erro ao obter sugestão:', error);
      Alert.alert('Erro', 'Não foi possível obter a sugestão. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={appStyles.container}> 
      {/* <Avatar source={{ uri: userPhoto || "https://github.com/iagob2.png" }} /> */}
      <Text style={appStyles.title}>   Escolha uma opção</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={appStyles.gridContainer1}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <MenuCard 
            item={item} 
            onPress={() => {
              if (item.id === '4') {
                handleSugestaoPress();
              } else {
                router.push(item.route);
              }
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
