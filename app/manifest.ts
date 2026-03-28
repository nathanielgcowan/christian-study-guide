import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Christian Study Guide",
    short_name: "Study Guide",
    description:
      "Bible study, devotionals, prayer, mentoring, rooms, and advanced discipleship tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#1e40af",
    icons: [
      {
        src: "/g.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
