import type { MetadataRoute } from "next";

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
  ];
}
