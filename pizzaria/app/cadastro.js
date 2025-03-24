import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function CadastroScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require("../assets/B1.png")} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={() => {}}
        />

        <TextInput
          style={styles.input}
          placeholder="N° do crachá"
          autoCorrect={false}
          keyboardType="numeric"
          onChangeText={() => {}}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          autoCorrect={false}
          onChangeText={() => {}}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerLogo: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
  },
  container: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#FFF",
    width: "90%",
    marginBottom: 15,
    color: "#B2B4B5",
    fontSize: 14,
    borderRadius: 10,
    padding: 10,
    borderColor:'#F2BF5E',
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#8C030E",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  linkText: {
    marginTop: 10,
    color: "#3b5998",
  },
});
