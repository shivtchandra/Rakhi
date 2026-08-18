import type { MetadataRoute } from "next";

const BASE_URL = "https://www.makeyourrakhi.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/r/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
