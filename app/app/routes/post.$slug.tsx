import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Post, sanityFetch } from "~/utils/sanity";
import { PostPage } from "~/pages/PostPage";
import groq from "groq";
import { useLiveQuery } from "@sanity/preview-kit";

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const loader = async ({ params }: LoaderArgs) => {
  const post = await sanityFetch<Post>({
    query: postQuery,
    params,
  });

  return {
    post,
    params,
  };
};

export default function PostRoute() {
  const { post: initialPost, params } = useLoaderData<typeof loader>();
  const [post] = useLiveQuery(initialPost, postQuery, params);

  return <PostPage post={post} />;
}
