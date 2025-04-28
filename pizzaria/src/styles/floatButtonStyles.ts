import { StyleSheet } from 'react-native';

export const floatButton = StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: '#8C030E',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 