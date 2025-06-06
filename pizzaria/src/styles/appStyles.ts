import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
let CARD_WIDTH = 160;
let CARD_HEIGHT = 220;
let CARD_MARGIN = 8; // margem pequena e igual para todos os lados

// Ajuste para desktop (telas maiores)
if (width > 600) {
  CARD_WIDTH = 200;
  CARD_HEIGHT = 240;
}

const appStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  formaContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: CARD_MARGIN,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Garante que nunca encoste na borda direita
    maxWidth: CARD_WIDTH,
    boxSizing: Platform.OS === 'web' ? 'border-box' : undefined,
  },
  formaContainerHorizontal: {
    width: CARD_WIDTH,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: CARD_MARGIN,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: CARD_WIDTH,
    boxSizing: Platform.OS === 'web' ? 'border-box' : undefined,
  },
  gridContainer1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
  },
  gridContainer2: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionContainer: {
    marginBottom: 16,
  },
 

  // Elementos visuais
  forma: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "#eee",
    maxWidth: 90,
    maxHeight: 90,
    alignSelf: 'center',
    resizeMode: Platform.OS === 'web' ? 'contain' : 'cover',
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  // Textos
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 0,
    marginTop: 13,
    color: '#333',
    paddingHorizontal: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    paddingHorizontal: 10,
    marginTop: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
  textoCard: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    fontWeight: 'bold',
    marginBottom: 6,
    paddingHorizontal: 5,
    width: '100%',
  },
  ingredientesText: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginBottom: 6,
    height: 40,
    overflow: 'visible',
    paddingHorizontal: 5,
    flexWrap: 'wrap',
  },
  precoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#8C030E",
    fontWeight: 'bold',
    marginTop: 4,
  },
  emojiText: {
    fontSize: 16,
    color: "#fff",
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  cardHorizontal: {
    width: CARD_WIDTH,
    marginVertical: 8,
  },

  // Botões
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectedButton: {
    backgroundColor: '#8C030E',
  },
  unselectedButton: {
    backgroundColor: '#f3f4f6',
  },
  botao: {
    alignSelf: "center",
    height: 50,
    width: 200,
    backgroundColor: "#8C030E", 
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default appStyles; 