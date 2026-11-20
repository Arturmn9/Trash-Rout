# Route App

A phone app for trash collection workers who currently memorize their routes. Load a CSV of clients, see every address on one map, filter by route day, payment status, and over-limit status, and update a client's status from the field.

Built with React Native, Expo (Expo Router), TypeScript, and SQLite.

## Features

- Import a client list from a CSV file
- Every address shown on one map, with pins colored by status (green = paid, red = unpaid, orange = over limit)
- Filters for route day (Monday to Sunday), paid / unpaid, and over limit
- Tap a stop to see client details, mark paid or over limit, and open directions in Google Maps
- Data is saved on the phone with SQLite, so it is still there after closing the app

## Quick start

You need [Node.js](https://nodejs.org) 22 or newer (LTS), a phone, and the **Expo Go** app from the Play Store or App Store.

```
git clone <this-repo-url>
cd <repo-folder>
npm install
npm start
```

Scan the QR code with Expo Go. If your phone cannot connect (common when using WSL), use `npm run tunnel` instead.

## Using the app

1. Copy `sample-data/clients.csv` to your phone (USB, email, or Google Drive).
2. Open the app, tap **Import**, and choose the file. Each address is looked up once and saved.
3. Go back to the map and use the filter chips.
4. Tap a pin, then its label, to open the client screen.

Addresses that could not be found are listed after import.

## CSV format

The first row must be this header:

```
id,name,address,city,zip,route_day,paid,over_limit,notes
```

| Column | Meaning |
|---|---|
| id | Unique number for each client |
| name | Client name |
| address, city, zip | Street address, city, and zip code |
| route_day | Monday to Sunday |
| paid | yes or no, for the current period |
| over_limit | yes or no, for today |
| notes | Optional free text |

## Project structure

```
app/            Screens (Expo Router)
  index.tsx       Map and filters
  import.tsx      CSV import
  client/[id].tsx Client details
src/            Logic, no UI
  types.ts        Client and Filters types
  csv.ts          CSV text to clients
  geocode.ts      Address to coordinates
  db.ts           SQLite save and load
  filters.ts      Filtering clients
sample-data/    Fake clients for testing
```

Data flow: CSV file, parse, geocode, save to SQLite, load, filter, show on the map.

## Troubleshooting

- **"Project is incompatible with this version of Expo Go":** the Expo SDK in this project and the one your Expo Go app supports are different. Run `npx expo install --fix`, or update the Expo Go app. If your Expo Go is on a newer SDK, run `npx expo install expo@latest` first and then `npx expo install --fix`.
- **Warnings about library versions after `npm install`:** run `npx expo install --fix`, which sets every Expo library to the version that matches the SDK.
- **Phone cannot connect to the dev server:** run `npm run tunnel`.
- **A pin is missing:** its address could not be found. Check the spelling in the CSV.
- **The map is blank in a standalone build:** standalone builds need a Google Maps API key in `app.json`. Expo Go does not.
- **The map does not work in a browser:** `react-native-maps` is for phones only. Use a phone.

## Privacy

Client names and addresses are personal data. The app keeps everything on the device. Do not commit real client files to a public repo; `.gitignore` already excludes every `.csv` except the sample file.

## Limitations

- The map screen has to be tested on a phone, not in a browser.
- Address lookup uses the phone's built-in geocoder, which can be slow or less accurate than a paid service.
- Everything is stored on one phone. There is no sync between workers yet.
