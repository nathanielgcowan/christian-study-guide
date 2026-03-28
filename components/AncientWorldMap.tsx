"use client";

import { useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  type MapRef,
} from "react-map-gl/maplibre";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import { Compass, Landmark, Mountain, Route } from "lucide-react";

type AncientLocation = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  position: [number, number];
};

const locations: AncientLocation[] = [
  {
    id: "nazareth",
    name: "Nazareth",
    subtitle: "Home of Jesus",
    description:
      "A hillside village in Lower Galilee where Jesus grew up before His public ministry.",
    position: [35.3006, 32.6996],
  },
  {
    id: "capernaum",
    name: "Capernaum",
    subtitle: "Teaching center in Galilee",
    description:
      "A lakeside town on the Sea of Galilee closely associated with Jesus' teaching and healing ministry.",
    position: [35.5736, 32.8803],
  },
  {
    id: "bethlehem",
    name: "Bethlehem",
    subtitle: "Birthplace of Jesus",
    description:
      "The Judean town tied to Davidic kingship and the Nativity traditions of the Gospel accounts.",
    position: [35.2038, 31.7054],
  },
  {
    id: "bethany",
    name: "Bethany",
    subtitle: "Village near Jerusalem",
    description:
      "The village of Mary, Martha, and Lazarus on the road over the Mount of Olives.",
    position: [35.2622, 31.7714],
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    subtitle: "Temple city",
    description:
      "The spiritual and political center of Judea during the days of Jesus, dominated by the Temple mount.",
    position: [35.2137, 31.7683],
  },
];

const regionGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Galilee" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35.15, 32.58],
          [35.72, 32.58],
          [35.8, 33.08],
          [35.3, 33.15],
          [35.1, 32.95],
          [35.15, 32.58],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { name: "Samaria" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [34.95, 31.95],
          [35.45, 31.95],
          [35.55, 32.55],
          [35.05, 32.62],
          [34.9, 32.2],
          [34.95, 31.95],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { name: "Judea" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [34.9, 31.25],
          [35.55, 31.25],
          [35.62, 31.98],
          [35.0, 32.0],
          [34.82, 31.55],
          [34.9, 31.25],
        ]],
      },
    },
  ],
};

const routeGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Jesus ministry route" },
      geometry: {
        type: "LineString",
        coordinates: locations.map((location) => location.position),
      },
    },
  ],
};

const regionFillLayer: Omit<FillLayerSpecification, "source"> = {
  id: "ancient-regions-fill",
  type: "fill",
  paint: {
    "fill-color": "#d4af37",
    "fill-opacity": 0.12,
  },
};

const regionOutlineLayer: Omit<LineLayerSpecification, "source"> = {
  id: "ancient-regions-outline",
  type: "line",
  paint: {
    "line-color": "#f8e3a1",
    "line-width": 2,
    "line-opacity": 0.7,
    "line-dasharray": [2, 1],
  },
};

const ministryRouteLayer: Omit<LineLayerSpecification, "source"> = {
  id: "jesus-ministry-route",
  type: "line",
  paint: {
    "line-color": "#60a5fa",
    "line-width": 4,
    "line-opacity": 0.85,
  },
};

const atmosphereModes = [
  {
    id: "dawn",
    label: "Dawn",
    mapClass:
      "[&_.maplibregl-canvas]:sepia-[0.18] [&_.maplibregl-canvas]:saturate-[1.05] [&_.maplibregl-canvas]:brightness-[1.03]",
    overlay: "from-amber-300/20 via-transparent to-slate-950/10",
  },
  {
    id: "midday",
    label: "Midday",
    mapClass:
      "[&_.maplibregl-canvas]:sepia-[0.08] [&_.maplibregl-canvas]:saturate-[1.1] [&_.maplibregl-canvas]:brightness-[1.06]",
    overlay: "from-sky-200/10 via-transparent to-emerald-950/5",
  },
  {
    id: "evening",
    label: "Evening",
    mapClass:
      "[&_.maplibregl-canvas]:sepia-[0.22] [&_.maplibregl-canvas]:saturate-[0.95] [&_.maplibregl-canvas]:brightness-[0.92]",
    overlay: "from-violet-400/15 via-transparent to-slate-950/30",
  },
];

const viewpointCards = [
  {
    id: "galilee",
    label: "Sea of Galilee",
    description: "Zoom to the teaching and miracle corridor around Capernaum.",
    center: [35.57, 32.84] as [number, number],
    zoom: 9.4,
    pitch: 46,
    bearing: 12,
    icon: Compass,
  },
  {
    id: "judea",
    label: "Jerusalem Ridge",
    description: "Focus on Jerusalem, Bethany, and the hill country of Judea.",
    center: [35.23, 31.78] as [number, number],
    zoom: 10.4,
    pitch: 54,
    bearing: -10,
    icon: Landmark,
  },
  {
    id: "wilderness",
    label: "Judean Wilderness",
    description: "Pull east toward the desert slopes and the Dead Sea basin.",
    center: [35.39, 31.65] as [number, number],
    zoom: 8.6,
    pitch: 52,
    bearing: 18,
    icon: Mountain,
  },
];

export default function AncientWorldMap() {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<AncientLocation>(locations[4]);
  const [atmosphere, setAtmosphere] = useState(atmosphereModes[1]);

  const selectedView = useMemo(
    () => viewpointCards.find((view) => view.label.includes(selectedLocation.name)) ?? null,
    [selectedLocation.name],
  );

  const flyToLocation = (location: AncientLocation) => {
    setSelectedLocation(location);
    mapRef.current?.flyTo({
      center: location.position,
      zoom: location.id === "jerusalem" ? 10.8 : 9.6,
      pitch: 52,
      bearing: location.id === "capernaum" ? 14 : -8,
      duration: 1600,
      essential: true,
    });
  };

  const activateView = (view: (typeof viewpointCards)[number]) => {
    mapRef.current?.flyTo({
      center: view.center,
      zoom: view.zoom,
      pitch: view.pitch,
      bearing: view.bearing,
      duration: 1700,
      essential: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {atmosphereModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setAtmosphere(mode)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  atmosphere.id === mode.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div
            className={`relative h-[620px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-2xl ${atmosphere.mapClass}`}
          >
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: 35.27,
                latitude: 32.15,
                zoom: 7.2,
                pitch: 48,
                bearing: -8,
              }}
              mapStyle="https://demotiles.maplibre.org/style.json"
              dragRotate
              touchZoomRotate
              style={{ width: "100%", height: "100%" }}
            >
              <NavigationControl position="top-right" />

              <Source id="ancient-regions" type="geojson" data={regionGeoJson}>
                <Layer {...regionFillLayer} />
                <Layer {...regionOutlineLayer} />
              </Source>

              <Source id="jesus-route" type="geojson" data={routeGeoJson}>
                <Layer {...ministryRouteLayer} />
              </Source>

              {locations.map((location) => (
                <Marker
                  key={location.id}
                  longitude={location.position[0]}
                  latitude={location.position[1]}
                  anchor="bottom"
                >
                  <button
                    type="button"
                    onClick={() => flyToLocation(location)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg transition ${
                      selectedLocation.id === location.id
                        ? "border-white bg-amber-400 text-slate-950"
                        : "border-white/80 bg-slate-900/85 text-white backdrop-blur-sm"
                    }`}
                    aria-label={`Focus ${location.name}`}
                  >
                    <Route className="h-5 w-5" />
                  </button>
                </Marker>
              ))}

              <Popup
                longitude={selectedLocation.position[0]}
                latitude={selectedLocation.position[1]}
                anchor="top"
                closeButton={false}
                closeOnClick={false}
                offset={28}
                className="[&_.maplibregl-popup-content]:rounded-2xl [&_.maplibregl-popup-content]:border [&_.maplibregl-popup-content]:border-slate-200 [&_.maplibregl-popup-content]:bg-white [&_.maplibregl-popup-content]:p-0 [&_.maplibregl-popup-content]:shadow-xl [&_.maplibregl-popup-tip]:border-t-white"
              >
                <div className="w-72 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    {selectedLocation.subtitle}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {selectedLocation.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedLocation.description}
                  </p>
                </div>
              </Popup>
            </Map>

            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${atmosphere.overlay}`}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/45 to-transparent" />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Jesus-era explorer
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Reimagine the land during the days of Jesus
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This MapLibre scene uses region overlays, route tracing, and curated
              locations to feel closer to a first-century learning surface than a plain
              modern map screenshot.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">View presets</h3>
            <div className="mt-4 space-y-3">
              {viewpointCards.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => activateView(view)}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                      selectedView?.id === view.id
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="mt-0.5 rounded-xl bg-white p-2 shadow-sm">
                      <Icon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{view.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {view.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
            <h3 className="text-lg font-semibold text-amber-950">Locations to explore</h3>
            <div className="mt-4 space-y-3">
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => flyToLocation(location)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    selectedLocation.id === location.id
                      ? "border-amber-300 bg-white"
                      : "border-amber-200 bg-white/80 hover:bg-white"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{location.name}</p>
                  <p className="mt-1 text-sm text-amber-900">{location.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
