import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "../../componest/drawer-content";

export default function Layout() {
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
           
        </Drawer>
    );
}