# Enroute

AI-powered ride sharing and parcel delivery, built with React + Vite.
Includes a live OpenStreetMap, a place explorer with accessibility/comfort filters
(ported from the **OSM Fit-Finder Pro** project, CIA 1), and a Journeys CRUD module backed by Express + MongoDB.

## Run

    mongod --dbpath ~/data/db      # MongoDB must be running (Windows: service starts automatically)
    npm run install:all            # installs React app + server packages
    npm start                      # Express API (3001) + Vite (5173)

Check the data: `mongosh` then `use enrouteDB` and `db.trips.find().pretty()`.

Open http://localhost:5173. Use `npm run build` for a production build.

## Features

| Area | What it does |
|---|---|
| **Hero map** | Real OpenStreetMap (Leaflet) with an animated demo route, live ETA and AI-match cards |
| **Search box** | Ride / parcel search with Geolocation, Web Storage (recent searches), Share, Clipboard and Notifications APIs |
| **Explore map** | Search any area (Nominatim), query places (Overpass), filter by wheelchair access, Wi-Fi, outdoor seating, power sockets, A/C, toilets (AND / OR, include unverified), sort, geolocation, quick presets |
| **Pickup helper** | "Use as pickup / drop-off" on any place fills the main search box |
| **Contribution hub** | Record observed tags in a modal, saved locally; copy / download JSON, export GeoJSON |
| **Journeys (CRUD)** | Create, read, update, delete and search rides/parcels via Express + MongoDB |
| **Parcel tools** | File API, drag & drop, IndexedDB tracking demo |
| **Extras** | Offline demo dataset, online/offline pill, keyboard shortcuts (`/`, `M`, `?`, `Esc`) |

OpenStreetMap data can be incomplete: a missing tag is shown as **Unknown**, never as "No".
Contributions stay in your browser; nothing is uploaded to OpenStreetMap automatically.

## Project structure

    server/server.js             Express + Mongoose API (MongoDB: enrouteDB.trips)
    index.html                   Tailwind CDN + theme config
    docs/part1-original.html     Original Part 1 landing page (reference)
    public/images/               Put your own hero.jpg here (optional)
    src/
      main.jsx, App.jsx          Entry point + page composition
      config/site.js             Nav links, stats, hero photo URL, hero route, map tiles
      api/
        trips.js                 REST calls to the Express API (GET, POST, PUT, DELETE)
        osm.js                   Nominatim + Overpass calls
      hooks/                     useToast, useReveal, useLocalStorage, useOnlineStatus
      utils/                     webApis (clipboard, notifications), geo, download
      styles/
        index.css                Imports the files below
        base.css                 Page, photo background, reveal animation
        landing.css              Road, vehicles, scenery, floating cards
        explorer.css             Leaflet pins, popups, hero route styling
        journeys.css             CRUD module styles
      components/
        layout/                  Header, Footer, Toast, PageBackground
        ui/                      Button, InputField, SelectField, RadioGroup
      features/
        landing/                 Hero, HeroMap, ScenicRoad, Stats, Counter, Services, HowItWorks, Cta
        search/                  SearchBox
        explorer/                ExplorerSection, MapView, SearchPanel, PlaceCard,
                                 FixModal, ContributionHub, ShortcutsModal,
                                 useExplorer (state), constants, tags (helpers)
        journeys/                JourneysSection, JourneyForm, JourneyList, JourneyCard, SearchBar
        parcels/                 ParcelApiDemo

## Background photograph

The page uses a real photograph instead of the old AI-generated image.
It is set in one place: `HERO_PHOTO` in `src/config/site.js`.
It currently loads a free-to-use photo from Pexels (https://www.pexels.com/photo/2996211).
To use your own, save it as `public/images/hero.jpg` and set `HERO_PHOTO = "/images/hero.jpg"`.

## External services

OpenStreetMap tiles, Nominatim and Overpass (please follow their usage policies), Leaflet, Tailwind CDN, Pexels (photo).
