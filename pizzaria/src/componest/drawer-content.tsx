import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";

export function DrawerContent(drawerProps: DrawerContentComponentProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Historico</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                    drawerProps.navigation.navigate("concluidos");
                }}
            >
                <Text style={styles.menuText}>Pedidos Concluídos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                    drawerProps.navigation.navigate("pendentes");
                }}
            >
                <Text style={styles.menuText}>Pedidos Pendentes</Text>
            </TouchableOpacity>

        

            <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                    router.replace("../(auth)/login");
                }}
            >
                <Text style={styles.menuText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#8C030E",
    },
    menuItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuText: {
        fontSize: 16,
        color: "#333",
    },
});