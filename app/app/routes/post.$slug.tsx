import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost, Post } from "~/utils/sanity";
import { useLiveData } from "~/hooks/useLiveData";
import { PostPage } from "~/pages/PostPage";

export const loader = async ({ params }: LoaderArgs) => {
  return await getPost(params.slug as string);
};

export default function PostRoute() {
  const post = useLiveData<Post>(useLoaderData<typeof loader>());

  return <PostPage post={post} />;
}
