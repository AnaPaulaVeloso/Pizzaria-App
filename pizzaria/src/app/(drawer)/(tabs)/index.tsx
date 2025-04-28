import { Avatar } from "../../../componest/avatar";
import { FloatButton } from "../../../componest/float-button";
import { styles } from "../../../styles/tabsStyles";
import { useRouter } from "expo-router";
import { router } from 'expo-router';
import { TouchableOpacity } from "react-native-gesture-handler";

import { Text, View } from "react-native";

export default function Home() {
  const navigate = useRouter();
  return (
    <View style={styles.container}>
      <Avatar source={{ uri: "https://github.com/iagob2.png" }} />

      <Text style={styles.title}>Adicionar Novo Pedido</Text>
      <View style={[styles.buttonContainer, { gap: 16 }]}>
        <FloatButton
          text="🍕 Escolher Pizza"
          onPress={() => navigate.push("/pizzas")}
        />
        <FloatButton
          text="🥟 Escolher Esfiha"
          onPress={() => navigate.push("/esfihas")}
        />
        <FloatButton
          text="🥤 Escolher Bebida"
          onPress={() => navigate.push("/bebidas")}
        />
        <FloatButton
          text="📜 Sugestão de Pedido"
          onPress={() => navigate.push("/pedido")}
        />

        <TouchableOpacity onPress={() => router.replace('../(auth)/login')}>
            <Text >Sair</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}
