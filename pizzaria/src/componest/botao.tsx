import { TouchableOpacity,View,Text, ViewStyle } from "react-native";
import appStyles from "../styles/appStyles";

interface BotaoProps {
    onPress: () => void;
    texto: string;
    style?: ViewStyle;
    textoStyle?: any;
}

export default function Botao(props: BotaoProps) {
    return (
        <TouchableOpacity onPress={props.onPress} style={props.style || appStyles.botao}>
            <Text style={props.textoStyle || appStyles.textoBotao}>{props.texto}</Text>
        </TouchableOpacity>
    )
}