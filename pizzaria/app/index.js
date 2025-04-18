import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/Style_index";

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
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.signInText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/(auth)/cadastro")}>
          <Text style={styles.signUpText}>Cadastra-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

