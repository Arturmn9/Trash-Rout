import * as SQLite from "expo-sqlite";
import { Client } from "./types";

async function getDb()
{
    const db = await SQLite.openDatabaseAsync("routes.db");
    await db.execAsync(
        "CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY, name TEXT, address TEXT, city TEXT, zip TEXT, routeDay TEXT, paid INTEGER, overLimit INTEGER, notes TEXT, lat REAL, lng REAL);"
    );
    return db;
}

function toClient(r: any): Client
{
    return {
        id: r.id,
        name: r.name,
        address: r.address,
        city: r.city,
        zip: r.zip,
        routeDay: r.routeDay,
        paid: r.paid === 1,
        overLimit: r.overLimit === 1,
        notes: r.notes ?? "",
        lat: r.lat,
        lng: r.lng,
    };
}

export async function saveClients(list: Client[])
{
    const db = await getDb();
    await db.execAsync("DELETE FROM clients;");
    for (const c of list)
    {
        await db.runAsync(
            "INSERT OR REPLACE INTO clients (id, name, address, city, zip, routeDay, paid, overLimit, notes, lat, lng) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [c.id, c.name, c.address, c.city, c.zip, c.routeDay, c.paid ? 1 : 0, c.overLimit ? 1 : 0, c.notes, c.lat, c.lng]
        );
    }
}

export async function loadClients(): Promise<Client[]>
{
    const db = await getDb();
    const rows = await db.getAllAsync("SELECT * FROM clients ORDER BY id");
    return rows.map(toClient);
}

export async function loadClient(id: number): Promise<Client | null>
{
    const db = await getDb();
    const row = await db.getFirstAsync("SELECT * FROM clients WHERE id = ?", [id]);
    if (!row)
    {
        return null;
    }
    return toClient(row);
}

export async function setField(id: number, field: "paid" | "overLimit", value: boolean)
{
    const db = await getDb();
    await db.runAsync("UPDATE clients SET " + field + " = ? WHERE id = ?", [value ? 1 : 0, id]);
}
