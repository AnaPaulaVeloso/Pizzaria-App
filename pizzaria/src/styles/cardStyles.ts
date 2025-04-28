//[]globalStyles
import { StyleSheet } from 'react-native';

const card = StyleSheet.create({
  container2: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
  },
  imagem: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  texto: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default card;