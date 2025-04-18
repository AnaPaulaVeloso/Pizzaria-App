import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'red',
      tabBarActiveBackgroundColor: 'yellow',
    }}>
      <Tabs.Screen 
        name="addpedido" 
        options={{
          title: 'Adicionar Pedido',
          tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="carrinho" 
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={24} color={color} />
        }} 
      />

<Tabs.Screen
  name="bebidas"
  options={{
    href: null, // Isso faz com que a página use o layout mas NÃO apareça como aba
  }}
/>

<Tabs.Screen
  name="pizzas"
  options={{
    href: null, // Isso faz com que a página use o layout mas NÃO apareça como aba
  }}
/>

<Tabs.Screen
  name="esfihas"
  options={{
    href: null, // Isso faz com que a página use o layout mas NÃO apareça como aba
  }}
/>

<Tabs.Screen
  name="pedido"
  options={{
    href: null, // Isso faz com que a página use o layout mas NÃO apareça como aba
  }}
/>

<Tabs.Screen
  name="resultado"
  options={{
    href: null, // Isso faz com que a página use o layout mas NÃO apareça como aba
  }}
/>
    
    </Tabs>
  );
}
