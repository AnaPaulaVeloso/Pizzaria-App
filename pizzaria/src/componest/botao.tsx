import { TouchableOpacity,View,StyleSheet,Text, ViewStyle } from "react-native";
import styles from "../styles/styles";

interface BotaoProps {
    onPress: () => void;
    texto: string;
    style?: ViewStyle;
}

export default function Botao(props: BotaoProps) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={props.style || styles.botao}>
                <Text style={styles.textoBotao}>{props.texto}</Text>
            </View>
        </TouchableOpacity>
    )
}