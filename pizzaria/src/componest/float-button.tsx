import {TouchableOpacity, Text, StyleProp, ViewStyle} from 'react-native';
import { floatButton } from '../styles/floatButton';

interface FloatButtonProps {
    text: string;
    position?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export function FloatButton({text, position = {}, style, onPress}: FloatButtonProps) {
    const buttonStyle = {
        ...floatButton.button,
        ...position,
        ...(style as object),
    };

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={floatButton.buttonText}>{text}</Text>
        </TouchableOpacity>               
    );
}