import { StyleSheet } from 'react-native';

const avatarStyles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 4,
    right: 10,
    zIndex: 200,
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