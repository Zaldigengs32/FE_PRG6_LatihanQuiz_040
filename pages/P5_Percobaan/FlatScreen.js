import React, { useMemo, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function FlatListScreen() {
    const start = Date.now();

    const total = 5000;

    const data = useMemo(() => {
        return Array.from({ length: total }, (_, i) => ({
            id: (i + 1).toString(),
            name: "User " + (i + 1),
        }));
    }, []);

    useEffect(() => {
        const end = Date.now();
        console.log("Waktu render (FlatList):", end - start, "ms");
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.name}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daftar User (Optimized)</Text>
            <Text style={styles.subtitle}>Total: {total}</Text>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    title: { fontSize: 22, fontWeight: "bold" },
    subtitle: { marginBottom: 10, color: "#666" },
    card: {
        flexDirection: "row",
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: "#f2f2f2",
    },
    id: { width: 40, color: "#888" },
    name: { fontWeight: "bold" },
});
