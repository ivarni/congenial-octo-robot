import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/utils/sanity";
import { PostPage } from "~/pages/PostPage";

export const loader = async ({ params, request }: LoaderArgs) => {
  return { post: await getPost(params.slug as string) };
};

export default function PostRoute() {
  const { post } = useLoaderData<typeof loader>();

  return <PostPage post={post} />;
}
