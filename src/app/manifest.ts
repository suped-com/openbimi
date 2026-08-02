import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenBIMI",
    short_name: "OpenBIMI",
    description: "Free, open tools to set up and validate BIMI.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f1",
    theme_color: "#3148d8",
  };
}
