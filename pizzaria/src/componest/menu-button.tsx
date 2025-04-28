import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function MenuButton() {
    const navigation = useNavigation();

    return (
        <Pressable 
            className="absolute top-4 left-4 z-50"
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
            <MaterialIcons name="menu" size={24} color="black" />
        </Pressable>
    );
}