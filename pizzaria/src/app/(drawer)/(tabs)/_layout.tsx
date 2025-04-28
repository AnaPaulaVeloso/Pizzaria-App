import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs } from "expo-router";
import "../../../styles/global.css";
import MenuButton from "../../../componest/menu-button";
import { Avatar } from "../../../componest/avatar";
import { FontAwesome } from '@expo/vector-icons';


export default function Layout() { 
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>  
            <Avatar />
            <MenuButton />
            <Tabs
            


                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#8C030E',
                        borderTopWidth: 0,
                        elevation: 0,
                        minHeight: 74,
                    },
                    tabBarLabelStyle: {
                        paddingBottom: 10,
                        paddingTop: 10,
                        fontSize: 12,
                    },
                    tabBarActiveTintColor: '#fff',
                    tabBarInactiveTintColor: '#fff',
                }}
            >
                <Tabs.Screen name="index"
                options={{
                    title: 'home',
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
                  }}  />
                <Tabs.Screen name="carrinho" 
                options={{
                    title: 'Carrinho',
                    tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={24} color={color} />
                  }} />
                <Tabs.Screen name="bebidas"  options={{href: null}}/>
                <Tabs.Screen name="esfihas"  options={{href: null}}/>
                <Tabs.Screen name="pizzas"  options={{href: null}}/>
                <Tabs.Screen name="resultado"  options={{href: null}}/>
                <Tabs.Screen name="pedido"  options={{href: null}}/>

            </Tabs>

            
        </GestureHandlerRootView>
    );
} 
