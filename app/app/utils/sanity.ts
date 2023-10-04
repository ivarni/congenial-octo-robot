import { createClient, QueryParams } from "@sanity/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

declare global {
  interface Window {
    ENV: {
      SANITY_PROJECT_ID: string;
      SANITY_DATASET: string;
    };
  }
}

const { SANITY_PROJECT_ID, SANITY_DATASET } =
  typeof document === "undefined" ? process.env : window.ENV;

if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
  throw new Error("Did you forget to run sanity init --env?");
}

//export const token =
//  typeof process === "undefined" ? "" : process.env.SANITY_API_READ_TOKEN!;

const DEFAULT_PARAMS = {} as QueryParams;

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-10-04",
});

export async function sanityFetch<QueryResponse>({
  previewDrafts,
  query,
  params = DEFAULT_PARAMS,
}: {
  previewDrafts?: boolean;
  query: string;
  params?: QueryParams;
}): Promise<QueryResponse> {
  if (previewDrafts && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required.",
    );
  }
  return client.fetch<QueryResponse>(
    query,
    params,
    previewDrafts
      ? {
          token,
          perspective: "previewDrafts",
        }
      : {},
  );
}

export async function getPosts(): Promise<Post[]> {
  return await client.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`,
  );
}

export async function getPost(slug: string): Promise<Post> {
  return await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    },
  );
}

export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset;
  body: PortableTextBlock[];
}
