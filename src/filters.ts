import { Client, Filters } from "./types";

export function applyFilters(clients: Client[], filters: Filters): Client[]
{
    return clients.filter((c) =>
    {
        if (filters.day !== "All" && c.routeDay !== filters.day)
        {
            return false;
        }
        if (filters.paid === "paid" && !c.paid)
        {
            return false;
        }
        if (filters.paid === "unpaid" && c.paid)
        {
            return false;
        }
        if (filters.overLimit && !c.overLimit)
        {
            return false;
        }
        return true;
    });
}
