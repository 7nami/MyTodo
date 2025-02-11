import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack 
    screenOptions={{
        headerTitle:"我的待办事项"
    }}
  />;
}
