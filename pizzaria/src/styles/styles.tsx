import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between", // importante para espaçar uniformemente
        backgroundColor: "#f4f4f4",
        padding: 10,
    },
    circuloContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    logoContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logoTexto: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#222",
        textAlign: "center",
        marginVertical: 20,
    },
    botaoLogo: { 
        alignSelf: "center",
        height: 50,
        width: 200,
        backgroundColor: "#ADD8E6", 
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        },
    formaContainer: {
        alignSelf: "center",
        width: "48%", // dois cards por linha com pequeno espaço entre eles
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    forma: {
        alignSelf: "center",
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: "#eee",
    },
    image: {
        alignSelf: "center",
    },
    imageTriangulo: {
        width: "100%",
        alignSelf: "center",
    },
    textoCard: {
        fontSize: 14,
        textAlign: "center",
        color: "#333",
        marginBottom: 4,
    },
    input: {
        alignSelf: "center",
        height: 50,
        width: 200,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        marginTop: 10,
    },
    textoForma: {
        alignSelf: "center",
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: "bold",
        marginTop: 50,
        textAlign: "center", 
    },
    
    botao: {
        alignSelf: "center",
        height: 50,
        width: 200,
        backgroundColor: "#ADD8E6", 
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    textoBotao: {
        color: "black",
        fontSize: 20,
    },
    resultadoContainer: {
        alignSelf: "center",
        marginTop: 20,
    },
    resultadoTexto: {
        fontSize: 20,
        fontStyle: "italic",
        textAlign: "center",
    },
    rodape: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    
});

export default styles;