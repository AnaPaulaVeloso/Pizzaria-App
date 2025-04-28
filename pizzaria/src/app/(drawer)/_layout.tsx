import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "../../componest/drawer-content";

export default function Layout() {
    return (
        <Drawer 
            defaultStatus="closed" 
            screenOptions={{ 
                headerShown: false,
                drawerStyle: {
                    width: "60%",  
                }
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
        >
            <Drawer.Screen 
                name="concluidos" 
                options={{ 
                    title: "Pedidos Concluídos",
                    drawerLabel: "Pedidos Concluídos"
                }} 
            />
            <Drawer.Screen 
                name="Pendentes" 
                options={{ 
                    title: "Pedidos Pendentes",
                    drawerLabel: "Pedidos Pendentes"
                }} 
            />
           
        </Drawer>
    );
}