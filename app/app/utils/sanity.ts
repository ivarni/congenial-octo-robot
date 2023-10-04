import { createClient, SanityClient } from "@sanity/client";
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

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: "2023-03-20", // date of setup
  perspective: "published",
});

export function getClient(preview?: { token: string }): SanityClient {
  if (!preview) {
    return client;
  }
  if (!preview.token) {
    throw new Error(
      "Attempted to activate Preview but a token was not provided",
    );
  }
  return client.withConfig({
    token: preview.token,
    useCdn: false,
    ignoreBrowserTokenWarning: true,
    perspective: "previewDrafts",
  });
}

export async function getPosts(prevew?: { token: string }): Promise<Post[]> {
  return await getClient(prevew).fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`,
  );
}

export async function getPost(
  slug: string,
  preview?: { token: string },
): Promise<Post> {
  return await getClient(preview).fetch(
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
