import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isReadyForIndexing = process.env.NEXT_PUBLIC_SITE_READY === "true";

  return {
    rules: {
      userAgent: "*",
      ...(isReadyForIndexing ? { allow: "/" } : { disallow: "/" }),
    },
  };
}
