import { useEffect, useState } from "react";
import { Text, Pressable, Linking, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { loadClient, setField } from "../../src/db";
import { Client } from "../../src/types";

export default function ClientScreen()
{
    const { id } = useLocalSearchParams<{ id: string }>();
    const [client, setClient] = useState<Client | null>(null);

    async function reload()
    {
        setClient(await loadClient(Number(id)));
    }

    useEffect(() =>
    {
        reload();
    }, [id]);

    async function toggle(field: "paid" | "overLimit")
    {
        if (!client)
        {
            return;
        }
        await setField(client.id, field, !client[field]);
        await reload();
    }

    function navigate()
    {
        if (!client)
        {
            return;
        }
        const query = client.address + ", " + client.city + " " + client.zip;
        Linking.openURL("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query));
    }

    return (
        <SafeAreaView style={styles.screen}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
                <Text style={styles.back}>Back</Text>
            </Pressable>
            {!client && <Text>Loading...</Text>}
            {client && (
                <>
                    <Text style={styles.name}>{client.name}</Text>
                    <Text>{client.address}, {client.city} {client.zip}</Text>
                    <Text>Route day: {client.routeDay}</Text>
                    <Text>Paid this period: {client.paid ? "Yes" : "No"}</Text>
                    <Text>Over limit today: {client.overLimit ? "Yes" : "No"}</Text>
                    {client.notes !== "" && <Text>Notes: {client.notes}</Text>}
                    <Pressable style={styles.button} onPress={() => toggle("paid")}>
                        <Text style={styles.buttonText}>{client.paid ? "Mark as unpaid" : "Mark as paid"}</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => toggle("overLimit")}>
                        <Text style={styles.buttonText}>{client.overLimit ? "Clear over limit" : "Mark over limit"}</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={navigate}>
                        <Text style={styles.buttonText}>Navigate</Text>
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16, backgroundColor: "white" },
    back: { color: "#2563eb", fontSize: 16, marginBottom: 8 },
    name: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
    button: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, marginTop: 12 },
    buttonText: { color: "white", textAlign: "center", fontSize: 16 },
});
