import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { parseClients } from "../src/csv";
import { geocodeClient } from "../src/geocode";
import { saveClients } from "../src/db";
import { Client } from "../src/types";

export default function ImportScreen()
{
    const [status, setStatus] = useState("Pick a CSV file to import.");
    const [failed, setFailed] = useState<string[]>([]);
    const [done, setDone] = useState(false);

    async function pickFile()
    {
        const pick = await DocumentPicker.getDocumentAsync({ type: "*/*" });
        if (pick.canceled)
        {
            return;
        }
        setDone(false);
        setFailed([]);
        setStatus("Reading file...");
        const response = await fetch(pick.assets[0].uri);
        const text = await response.text();
        const parsed = parseClients(text);
        const located: Client[] = [];
        const bad: string[] = [];
        for (let i = 0; i < parsed.length; i++)
        {
            setStatus("Finding address " + (i + 1) + " of " + parsed.length + "...");
            const c = await geocodeClient(parsed[i]);
            if (c.lat === null)
            {
                bad.push(c.name + ": " + c.address + ", " + c.city);
            }
            located.push(c);
        }
        await saveClients(located);
        setFailed(bad);
        setStatus("Imported " + located.length + " clients. " + bad.length + " addresses not found.");
        setDone(true);
    }

    return (
        <View style={styles.screen}>
            <Pressable style={styles.button} onPress={pickFile}>
                <Text style={styles.buttonText}>Choose CSV file</Text>
            </Pressable>
            <Text style={styles.status}>{status}</Text>
            {done && (
                <Pressable style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go to map</Text>
                </Pressable>
            )}
            <ScrollView>
                {failed.map((f) => (
                    <Text key={f} style={styles.failed}>{f}</Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16 },
    button: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, marginVertical: 8 },
    buttonText: { color: "white", textAlign: "center", fontSize: 16 },
    status: { marginVertical: 8, fontSize: 16 },
    failed: { color: "#b91c1c", marginVertical: 2 },
});
