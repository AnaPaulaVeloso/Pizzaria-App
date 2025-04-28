import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  container2: {
    marginBottom: 20,
    borderWidth: 1,
    padding: 10 ,
    width: '30%', // Cada card ocupa 30% da largura
    margin: 5, // Espaço entre os cards
    alignItems: 'center',
},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  gridContainer1: {
    flexDirection: 'row', // Alinha os produtos horizontalmente
        flexWrap: 'wrap', // Permite que quebre para a próxima linha
        justifyContent: 'space-evenly', // Espaçamento uniforme entre os itens
        width: '100%',
  },
  gridContainer2: {
    flexDirection: 'row', // Alinha os produtos horizontalmente
    justifyContent: 'space-between', // Espaçamento uniforme entre os itens
    alignItems: 'flex-start', // Alinha os itens no topo (não flex-end)
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 16,
  },
  cardHorizontal: {
    width: 250, // Define uma largura fixa para os itens
    marginHorizontal: 8, // Adiciona um pouco de espaço entre os itens
  },

});
