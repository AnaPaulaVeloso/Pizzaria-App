import { Drawer } from "expo-router/drawer";
import { useRouter, router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { DrawerContent } from "../../componest/drawer-content";
import { Avatar } from "../../componest/avatar";
import { usePedidoInfo } from "../../context/pedidoInfoContext";
import { View } from "react-native";

export default function Layout() {
    const { atendenteLogado } = usePedidoInfo();
    const [fotoAtual, setFotoAtual] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (atendenteLogado?.foto) {
            setFotoAtual(atendenteLogado.foto);
        }
    }, [atendenteLogado?.foto]);

    //   const handleNovoAtendimento = () => {
    //     router.push('/novoAtendimento');
    // };

    const renderAvatar = () => {
        if (!atendenteLogado) {
            return null;
        }

        return (
            <View style={{ marginRight: 10 }}>
                <Avatar 
                    source={fotoAtual ? { uri: fotoAtual } : undefined} 
                />
            </View>
        );
    };

    return (
                <Drawer 
                    defaultStatus="closed" 
                    screenOptions={{ 
                        headerShown: true,
                        headerTitle: "",
                        drawerStyle: {
                            width: "60%",  
                        },
                        headerStyle: {
                            backgroundColor: '#8c030e',
                        },
                        headerTintColor: '#fff',
                        headerRight: renderAvatar,
                    }}
                    drawerContent={(props) => <DrawerContent {...props} />}
                >
                    <Drawer.Screen 
                        name="concluidos" 
                        options={{ 
                            drawerLabel: "Pedidos Concluídos"
                        }} 
                    />
                    <Drawer.Screen 
                        name="Pendentes" 
                        options={{ 
                            drawerLabel: "Pedidos Pendentes"
                        }} 
                    />
                     <Drawer.Screen
                        name="(tabs)/pedido" // Aponta para src/app/(tabs)/pedido.tsx
                        options={{
                            drawerLabel: "Novo Atendimento", // O texto que aparecerá no menu
                            // opcionalmente, você pode definir um título para a tela
                            // headerTitle: "Criar Pedido",
                            // Isso garante que a rota para a aba correta seja ativada.
                        }}
                    />
                
                </Drawer>
    );
}