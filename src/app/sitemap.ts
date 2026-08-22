import type { MetadataRoute } from "next";
import { STYLES } from "@/data/styles";

const BASE_URL = "https://www.makeyourrakhi.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${BASE_URL}/hero-festival.png`, `${BASE_URL}/rakhi-street.webp`],
    },
    {
      url: `${BASE_URL}/create`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/send-rakhi-without-shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...STYLES.map((s) => ({
      url: `${BASE_URL}/gallery/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: [`${BASE_URL}/gallery/${s.id}.png`],
    })),
  ];
}
