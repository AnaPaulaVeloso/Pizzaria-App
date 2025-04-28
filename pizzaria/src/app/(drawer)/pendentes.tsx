import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function pedido_pendentes() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    marginBottom: 16
                }}
            >
                <Ionicons name="arrow-back" size={24} color="#8c030e" />
                <Text style={{ marginLeft: 8, color: '#8c030e', fontSize: 16 }}>Voltar</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Pedidos Pendentes</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>
                Aqui você encontrará todos os seus pedidos em andamento.
                Nenhum pedido pendente no momento.
            </Text>
        </View>
    )
}