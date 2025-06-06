import { Drawer } from "expo-router/drawer";
import { useRouter, router } from "expo-router";
import React from 'react';
import { DrawerContent } from "../../componest/drawer-content";
import { Avatar } from "../../componest/avatar";


export default function Layout() {

    //   const handleNovoAtendimento = () => {
    //     router.push('/novoAtendimento');
    // };
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
                        headerRight: () => (
                            <Avatar source={{ uri: "https://github.com/iagob2.png" }} />
                        ),
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