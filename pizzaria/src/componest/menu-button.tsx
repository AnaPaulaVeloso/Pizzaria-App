import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import menuButtonStyles from '../styles/menuButtonStyles';

export default function MenuButton() {
    const navigation = useNavigation();

    return (
        <Pressable 
            style={menuButtonStyles.button}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
            <MaterialIcons name="menu" size={24} color="black" />
        </Pressable>
    );
}