import { Image, ImageProps, TouchableOpacity, View } from "react-native";
import avatarStyles from "../styles/avatarStyles";
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

type AvatarProps = ImageProps & {
    size?: "medium";
}

export function Avatar({ source, ...rest }: AvatarProps) {
    const router = useRouter();

    const renderImage = () => {
        if (!source || !source.uri) {
            return (
                <View style={[avatarStyles.avatar, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
                    <MaterialIcons name="person" size={24} color="#666" />
                </View>
            );
        }

        return (
            <Image
                style={avatarStyles.avatar}
                source={source}
                {...rest}
            />
        );
    };

    return (
        <TouchableOpacity
            onPress={() => {
                router.push("/(drawer)/perfil");
            }}
            style={avatarStyles.avatar}
        >
            {renderImage()}
        </TouchableOpacity>
    );
}