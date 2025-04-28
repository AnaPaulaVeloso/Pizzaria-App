import { Image, ImageProps } from "react-native";

type AvatarProps = ImageProps & {
    size?: "medium"
}

export function Avatar({ ...rest }: AvatarProps) {
    return (
        <Image 
            className="w-8 h-8 rounded-full absolute top-4 right-4 z-50" 
            {...rest}
        />
    );
}