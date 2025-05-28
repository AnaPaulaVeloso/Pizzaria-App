import React from 'react';
import { Stack } from 'expo-router';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";   
import Loading from "../componest/loading";
import { StatusBar } from "expo-status-bar";
import { CarrinhoProvider } from '../context/CarrinhoContext';
import { PedidoInfoProvider } from '../context/pedidoInfoContext';

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });
    
    if (!fontsLoaded) {
        return <Loading/>;
    }

    return (
        <>
            <StatusBar style="light" backgroundColor="#8c030e" translucent={false} />
            <PedidoInfoProvider>
                <CarrinhoProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#fff' }
                }}
            >
                <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(drawer)" />
            </Stack>
                </CarrinhoProvider>
            </PedidoInfoProvider>
        </>
    );
} 