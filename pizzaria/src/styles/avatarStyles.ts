import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const marginRight = width * 0.06; // 6% da largura da tela
const marginTop = height * 0.001; // 2% da altura da tela

const avatarStyles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: marginRight,
    marginLeft: 10,
    marginTop: marginTop,
    zIndex: 1000,
  },
  avatarPlaceholder: {
    backgroundColor: '#8c030e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default avatarStyles;