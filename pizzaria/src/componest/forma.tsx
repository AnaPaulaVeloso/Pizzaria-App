// comp/Forma.tsx
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45; // Aproximadamente metade da largura da tela (com espaço para margem)
const cardWidthHorizontal = width * 0.35; // Um pouco menor para a lista horizontal

interface FormaProps {
    nome: string;
    ingredientes: string;
    imagem: string;
    preco?: string;
    onPress?: () => void;
    horizontal?: boolean;
}

export default function Forma({ nome, ingredientes, imagem, preco, onPress, horizontal = false }: FormaProps) {
    return (
        <View style={horizontal ? styles.formaContainerHorizontal : styles.formaContainer}>
            <TouchableOpacity style={styles.touchableContainer} onPress={onPress}>
                <Image source={{ uri: imagem }} style={styles.forma} />
                <Text style={styles.textoCard} numberOfLines={1}>{nome}</Text>
                <Text style={styles.ingredientesText} numberOfLines={3}>{ingredientes}</Text>
                {preco && <Text style={styles.precoText}>R$ {preco}</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formaContainer: {
        width: cardWidth,
        height: 240,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        margin: 6,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formaContainerHorizontal: {
        width: cardWidthHorizontal,
        height: 220,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        margin: 6,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    forma: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
        backgroundColor: "#eee",
    },
    touchableContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textoCard: {
        fontSize: 14,
        textAlign: "center",
        color: "#333",
        fontWeight: 'bold',
        marginBottom: 6,
        paddingHorizontal: 5,
        width: '100%',
    },
    ingredientesText: {
        fontSize: 11,
        textAlign: "center",
        color: "#666",
        marginBottom: 8,
        height: 25,
        overflow: 'hidden',
        paddingHorizontal: 5,
        flexWrap: 'wrap',
    },
    precoText: {
        fontSize: 16,
        textAlign: "center",
        color: "#8C030E",
        fontWeight: 'bold',
        marginTop: 8,
    },
});
