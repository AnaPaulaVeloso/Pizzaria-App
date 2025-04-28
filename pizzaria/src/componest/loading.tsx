import { ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <ActivityIndicator
        size="large"
        color="#8c030e"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  
    />
  );
}