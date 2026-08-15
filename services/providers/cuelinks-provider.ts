import { serverConfig } from "@/lib/server-config";
import type { Product } from "@/types";

interface CuelinksConvertResponse {
  short_url?: string;
  tracking_url?: string;
  affiliate_url?: string;
  url?: string;
  data?: {
    short_url?: string;
    tracking_url?: string;
    affiliate_url?: string;
    url?: string;
  };
}

export async function monetizeProductsWithCuelinks(products: Product[]) {
  if (!serverConfig.cuelinksApiKey) return products;

  const converted = await Promise.all(
    products.map(async (product) => ({
      ...product,
      buyUrl: await convertUrl(product.buyUrl, product.id)
    }))
  );

  return converted;
}

async function convertUrl(url: string, subid: string) {
  try {
    const response = await fetch(`${serverConfig.cuelinksBaseUrl}/links/convert`, {
      method: "POST",
      headers: {
        Authorization: `Token ${serverConfig.cuelinksApiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        url,
        subid,
        shorten: true
      })
    });

    if (!response.ok) return url;

    const payload = (await response.json()) as CuelinksConvertResponse;

    return (
      payload.short_url ??
      payload.tracking_url ??
      payload.affiliate_url ??
      payload.url ??
      payload.data?.short_url ??
      payload.data?.tracking_url ??
      payload.data?.affiliate_url ??
      payload.data?.url ??
      url
    );
  } catch {
    return url;
  }
}
