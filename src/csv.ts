import Papa from "papaparse";
import { Client } from "./types";

function isYes(value: string)
{
    return (value ?? "").trim().toLowerCase() === "yes";
}

export function parseClients(text: string): Client[]
{
    const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    return result.data.map((row) => ({
        id: Number(row.id),
        name: row.name,
        address: row.address,
        city: row.city,
        zip: row.zip,
        routeDay: row.route_day,
        paid: isYes(row.paid),
        overLimit: isYes(row.over_limit),
        notes: row.notes ?? "",
        lat: null,
        lng: null,
    }));
}
