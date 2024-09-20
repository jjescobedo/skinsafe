import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="detect" />
      <Stack.Screen name="detect_capture" />
      <Stack.Screen name="detect_report" />
      <Stack.Screen name="weather" />
    </Stack>
  );
}