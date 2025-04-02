import { StyleSheet,Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");


export default  Style_index = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      },
      pizzaImage: {
        position: "absolute",
        resizeMode: "contain",
      },
      topLeftPizza: {
        width: width * 0.7,  // Maior
        height: width * 0.7,
        bottom: -width * 0.35,
        right: -width * 0.25,
      },
      bottomRightPizza: {
        width: width * 0.7,  // Menor
        height: width * 0.7,
        top: -width * 0.25,  
        left: -width * 0.2,
        
      },
      logoContainer: {
        marginBottom: 8,
        zIndex: 2,
      },
      logo: {
        width: 320,
        height: 100,
      },
      logotipoContainer: {
        marginBottom: 30,
        zIndex: 2,
      },
      logotipo: {
        width: 250,
        height: 100,
      },
      buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        zIndex: 2,
      },
      signInButton: {
        backgroundColor: "black",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginRight: 10,
      },
      signUpButton: {
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "black",
      },
      signInText: {
        color: "white",
        fontWeight: "bold",
      },
      signUpText: {
        color: "black",
        fontWeight: "bold",
      },



 });