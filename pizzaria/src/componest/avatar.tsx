import { Image, ImageProps } from "react-native";
import avatarStyles from "../styles/avatarStyles";

type AvatarProps = ImageProps & {
    size?: "medium"
}

export function Avatar({ ...rest }: AvatarProps) {
    return (
        <Image 
            style={avatarStyles.avatar} 
            {...rest}
        />
    );
}