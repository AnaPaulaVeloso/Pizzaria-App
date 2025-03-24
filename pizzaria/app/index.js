import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/pizzaImage.png")} style={[styles.pizzaImage, styles.topLeftPizza]} />
      <Image source={require("../assets/pizzaImage.png")} style={[styles.pizzaImage, styles.bottomRightPizza]} />


      <View style={styles.logoContainer}>
        <Image source={require("../assets/B1.png")} style={styles.logo} />
      </View>


      <View style={styles.logotipoContainer}>
        <Image source={require("../assets/Pizzaria.jpg")} style={styles.logotipo} />
      </View>

  
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/login")}>
          <Text style={styles.signInText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/cadastro")}>
          <Text style={styles.signUpText}>Cadastra-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
