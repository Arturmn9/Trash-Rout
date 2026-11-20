export type Client =
{
    id: number;
    name: string;
    address: string;
    city: string;
    zip: string;
    routeDay: string;
    paid: boolean;
    overLimit: boolean;
    notes: string;
    lat: number | null;
    lng: number | null;
};

export type Filters =
{
    day: string;
    paid: "all" | "paid" | "unpaid";
    overLimit: boolean;
};
