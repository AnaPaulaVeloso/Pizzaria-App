import { StyleSheet } from 'react-native';

const avatarStyles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 50,
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