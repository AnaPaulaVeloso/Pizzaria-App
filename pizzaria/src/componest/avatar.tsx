import { Image, ImageProps, TouchableOpacity } from "react-native";
import avatarStyles from "../styles/avatarStyles";
import { useRouter } from "expo-router";

type AvatarProps = ImageProps & {
    size?: "medium";
}

export function Avatar({ ...rest }: AvatarProps) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => {
                router.push("/(drawer)/perfil");
            }}
            style={avatarStyles.avatar}
        >
            <Image
                style={avatarStyles.avatar}
                {...rest}
            />
        </TouchableOpacity>
    );
}