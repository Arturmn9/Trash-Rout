import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { router, useFocusEffect } from "expo-router";
import { loadClients } from "../src/db";
import { applyFilters } from "../src/filters";
import { Client, Filters } from "../src/types";

const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function Chip(props: { label: string; active: boolean; onPress: () => void })
{
    return (
        <Pressable onPress={props.onPress} style={[styles.chip, props.active && styles.chipOn]}>
            <Text style={props.active ? styles.chipTextOn : styles.chipText}>{props.label}</Text>
        </Pressable>
    );
}

export default function MapScreen()
{
    const [clients, setClients] = useState<Client[]>([]);
    const [filters, setFilters] = useState<Filters>({ day: "All", paid: "all", overLimit: false });
    const mapRef = useRef<MapView>(null);

    useFocusEffect(
        useCallback(() =>
        {
            loadClients().then(setClients);
        }, [])
    );

    const shown = applyFilters(clients, filters).filter((c) => c.lat !== null && c.lng !== null);

    useEffect(() =>
    {
        if (shown.length > 0)
        {
            const coords = shown.map((c) => ({ latitude: c.lat as number, longitude: c.lng as number }));
            mapRef.current?.fitToCoordinates(coords, {
                edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
                animated: true,
            });
        }
    }, [clients, filters]);

    function pinColor(c: Client)
    {
        if (c.overLimit)
        {
            return "orange";
        }
        return c.paid ? "green" : "red";
    }

    return (
        <View style={styles.screen}>
            <View style={styles.bar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {days.map((d) => (
                        <Chip key={d} label={d} active={filters.day === d} onPress={() => setFilters({ ...filters, day: d })} />
                    ))}
                </ScrollView>
                <View style={styles.row}>
                    <Chip label="Paid" active={filters.paid === "paid"} onPress={() => setFilters({ ...filters, paid: filters.paid === "paid" ? "all" : "paid" })} />
                    <Chip label="Unpaid" active={filters.paid === "unpaid"} onPress={() => setFilters({ ...filters, paid: filters.paid === "unpaid" ? "all" : "unpaid" })} />
                    <Chip label="Over limit" active={filters.overLimit} onPress={() => setFilters({ ...filters, overLimit: !filters.overLimit })} />
                    <Chip label="Import" active={false} onPress={() => router.push("/import")} />
                </View>
                <Text style={styles.count}>{shown.length} stops shown</Text>
            </View>
            <MapView ref={mapRef} style={styles.map}>
                {shown.map((c) => (
                    <Marker
                        key={c.id}
                        coordinate={{ latitude: c.lat as number, longitude: c.lng as number }}
                        title={c.name}
                        description={c.address}
                        pinColor={pinColor(c)}
                        onCalloutPress={() => router.push({ pathname: "/client/[id]", params: { id: String(c.id) } })}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    bar: { padding: 8, backgroundColor: "white" },
    row: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    map: { flex: 1 },
    count: { marginTop: 4, color: "gray" },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: "#999", marginRight: 6, marginTop: 4 },
    chipOn: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
    chipText: { color: "black" },
    chipTextOn: { color: "white" },
});
