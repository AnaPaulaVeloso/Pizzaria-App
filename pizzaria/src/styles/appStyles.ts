import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45; // Aproximadamente metade da largura da tela (com espaço para margem)
const cardWidthHorizontal = width * 0.35; // Um pouco menor para a lista horizontal

export const appStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formaContainer: {
    width: cardWidth,
    height: 240,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formaContainerHorizontal: {
    width: cardWidthHorizontal,
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridContainer1: {
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  gridContainer2: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
 

  // Elementos visuais
  forma: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  // Textos
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHorizontal: {
    width: cardWidthHorizontal,
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
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  botao: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  botaoTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    backgroundColor: '#fff',
  },
  botaoAdicionar: {
    backgroundColor: '#8C030E',
  },
  button: {
    backgroundColor: '#8c030e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  detalhesImagem: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detalhesContainer: {
    padding: 16,
  },
  detalhesTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detalhesIngredientes: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  detalhesPreco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 24,
  },
  quantidadeContainer: {
    marginBottom: 24,
  },
  quantidadeBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantidadeBotao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantidadeBotaoTexto: {
    fontSize: 20,
    color: '#333',
  },
  quantidadeTexto: {
    fontSize: 18,
    marginHorizontal: 16,
    color: '#333',
  },
  bordaContainer: {
    marginBottom: 24,
  },
  bordaBotoes: {
    flexDirection: 'row',
    marginTop: 8,
  },
  bordaBotao: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    alignItems: 'center',
  },
  bordaBotaoSelecionado: {
    backgroundColor: '#4CAF50',
  },
  bordaBotaoTexto: {
    color: '#333',
  },
  observacaoContainer: {
    marginBottom: 24,
  },
  observacaoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#dc3545',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: '#333',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8C030E',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default appStyles; 