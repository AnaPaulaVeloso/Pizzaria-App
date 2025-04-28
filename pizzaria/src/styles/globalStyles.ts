import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  containerLogo: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
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
    width: '100%',
    marginVertical: 8,
  },

  // Textos
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8C030E',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },

  // Grids
  gridContainer1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  gridContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 16,
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

  // Informações
  infoContainer: {
    width: '100%',
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8C030E',
  },
}); 