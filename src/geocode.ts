import * as Location from "expo-location";
import { Client } from "./types";

export async function geocodeClient(c: Client): Promise<Client>
{
    try
    {
        const found = await Location.geocodeAsync(c.address + ", " + c.city + " " + c.zip);
        if (found.length > 0)
        {
            return { ...c, lat: found[0].latitude, lng: found[0].longitude };
        }
    }
    catch (e)
    {
        return c;
    }
    return c;
}
