"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Compass, Route, ShipWheel, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getBibleMapStates, saveBibleMapState } from "../lib/persistence";

const BIBLE_MAP_STATES_KEY = "christian-study-guide:bible-map-states";

type MapDefinition = {
  title: string;
  summary: string;
  places: string[];
  accent: string;
};

type SavedMapState = {
  id: string;
  mapTitle: string;
  selectedPlace: string;
  layerMode: string;
  timelineNote: string;
};

export default function BibleMapsClient({ maps }: { maps: MapDefinition[] }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savedStates, setSavedStates] = useState<SavedMapState[]>([]);
  const [selectedMap, setSelectedMap] = useState(maps[0].title);
  const [selectedPlace, setSelectedPlace] = useState(maps[0].places[0]);
  const [timelineNote, setTimelineNote] = useState("");
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getBibleMapStates();
          setSavedStates(
            (
              data as Array<{
                id: string;
                map_title: string;
                selected_place: string;
                layer_mode: string;
                timeline_note: string | null;
              }>
            ).map((item) => ({
              id: item.id,
              mapTitle: item.map_title,
              selectedPlace: item.selected_place,
              layerMode: item.layer_mode,
              timelineNote: item.timeline_note || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(BIBLE_MAP_STATES_KEY);
          if (raw) {
            setSavedStates(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [supabase]);

  const handleSave = async () => {
    try {
      if (user) {
        const saved = await saveBibleMapState({
          map_title: selectedMap,
          selected_place: selectedPlace,
          layer_mode: "overview",
          timeline_note: timelineNote,
        });
        setSavedStates((current) => [
          {
            id: saved.id,
            mapTitle: saved.map_title,
            selectedPlace: saved.selected_place,
            layerMode: saved.layer_mode,
            timelineNote: saved.timeline_note || "",
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            mapTitle: selectedMap,
            selectedPlace,
            layerMode: "overview",
            timelineNote,
          },
          ...savedStates,
        ];
        setSavedStates(next);
        localStorage.setItem(BIBLE_MAP_STATES_KEY, JSON.stringify(next));
      }

      setTimelineNote("");
      setSaveFeedback("Map state saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-gray-600">Loading Bible maps...</div>
      </div>
    );
  }

  return (
    <>
      <section className="grid gap-6 md:grid-cols-3">
        {maps.map((map, index) => (
          <article
            key={map.title}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div
              className={`relative aspect-[4/3] bg-gradient-to-br ${map.accent}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,transparent_0%,rgba(15,23,42,0.28)_100%)]" />
              <div className="absolute inset-0 p-6">
                <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                  Interactive map
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h2 className="text-2xl font-semibold text-white">
                  {map.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-100">
                  {map.summary}
                </p>
              </div>
            </div>
            <div className="p-8">
              {index === 0 && <Route className="h-6 w-6 text-[#1e40af]" />}
              {index === 1 && <Compass className="h-6 w-6 text-[#14532d]" />}
              {index === 2 && <ShipWheel className="h-6 w-6 text-[#7c2d12]" />}
              <div className="mt-5 flex flex-wrap gap-2">
                {map.places.map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => {
                      setSelectedMap(map.title);
                      setSelectedPlace(place);
                    }}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      selectedMap === map.title && selectedPlace === place
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Map insight layer</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-7 text-amber-900">
            The strongest version lets users click places for historical notes,
            passage links, cultural background, and connected events in the
            biblical timeline.
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm font-semibold text-amber-950">
              Selected: {selectedMap} • {selectedPlace}
            </p>
            <textarea
              value={timelineNote}
              onChange={(event) => setTimelineNote(event.target.value)}
              rows={4}
              placeholder="Add a timeline note or study insight"
              className="mt-4 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleSave}
              className="mt-4 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              {saveFeedback || "Save map state"}
            </button>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">
            Saved map states
          </h2>
          <div className="mt-6 grid gap-3">
            {savedStates.length > 0 ? (
              savedStates.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {item.mapTitle} • {item.selectedPlace}
                  </p>
                  {item.timelineNote ? (
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {item.timelineNote}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save map selections to keep track of places and timeline
                insights.
              </p>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
