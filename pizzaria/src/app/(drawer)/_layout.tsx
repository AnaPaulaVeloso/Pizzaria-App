import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "../../componest/drawer-content";
import { Avatar } from "../../componest/avatar";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../service/api_db";

export default function Layout() {
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserPhoto = async () => {
            try {
                const loggedInCracha = await AsyncStorage.getItem('user_n_cracha');
                if (loggedInCracha) {
                    const user = await api.getAtendenteByCracha(loggedInCracha);
                    if (user?.foto) {
                        setUserPhoto(user.foto);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar foto do usuário:", error);
            }
        };
        fetchUserPhoto();
    }, []);

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
                    <Avatar source={{ uri: userPhoto || "https://github.com/iagob2.png" }} />
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
                name="pendentes" 
                options={{ 
                    drawerLabel: "Pedidos Pendentes"
                }} 
            />
           
        </Drawer>
    );
}