// comp/Forma.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import appStyles from "../styles/appStyles";

interface FormaProps {
    id: string;
    nome: string;
    ingredientes: string;
    imagem: string;
    preco: number;
    tipo: 'pizza' | 'esfiha' | 'bebida';
    horizontal?: boolean;
}

export default function Forma({ id, nome, ingredientes, imagem, preco, tipo, horizontal = false }: FormaProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/item-detalhes',
            params: {
                id: id.toString(),
                nome,
                ingredientes,
                imagem,
                preco: preco.toString(),
                tipo
            }
        });
    };

    return (
        <View style={horizontal ? appStyles.formaContainerHorizontal : appStyles.formaContainer}>
            <TouchableOpacity style={appStyles.touchableContainer} onPress={handlePress}>
                <Image 
                    source={{ uri: imagem }} 
                    style={appStyles.forma} 
                    resizeMode="cover" // Use "cover" para preencher o espaço
                />
                <Text style={appStyles.textoCard} numberOfLines={1}>{nome}</Text>
                <Text style={appStyles.ingredientesText} numberOfLines={3}>{ingredientes}</Text>
                {preco && <Text style={appStyles.precoText}>R$ {preco.toFixed(2).replace('.', ',')}</Text>}
            </TouchableOpacity>
        </View>
    );
}