import { Stack } from "expo-router";

export default function Layout()
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Route Map" }} />
            <Stack.Screen name="import" options={{ title: "Import CSV" }} />
            <Stack.Screen name="client/[id]" options={{ title: "Client" }} />
        </Stack>
    );
}
