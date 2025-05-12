// comp/Forma.tsx
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles/styles";

interface FormaProps {
    nome: string;
    ingredientes: string;
    imagem: string;
    preco?: string;
    onPress?: () => void;
}

export default function Forma({ nome, ingredientes, imagem, preco, onPress }: FormaProps) {
    return (
        <View style={styles.formaContainer}>
            <TouchableOpacity onPress={onPress}>
                <Image source={{ uri: imagem }} style={styles.forma} />
                <Text style={styles.textoCard}>{nome}</Text>
                <Text style={styles.textoCard}>{ingredientes}</Text>
                {preco && <Text style={styles.textoCard}>R$ {preco}</Text>}
            </TouchableOpacity>
        </View>
    );
}
