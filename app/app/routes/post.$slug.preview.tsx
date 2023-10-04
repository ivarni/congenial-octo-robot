import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getPost, Post } from "~/utils/sanity";
import { useLiveData } from "~/hooks/useLiveData";
import { PostPage } from "~/pages/PostPage";
import { getSession } from "~/sessions";
import { useLiveQuery } from "@sanity/preview-kit";

export const loader = async ({ params, request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("preview");
  const preview = token ? { token } : undefined;
  return { post: await getPost(params.slug as string, preview), preview };
};

const postQuery = `*[_type == "post" && slug.current == $slug][0]`;

export default function PostRoute() {
  const { post } = useLoaderData<typeof loader>();

  const params = useParams();
  const [data] = useLiveQuery(post, postQuery, params);

  console.log(data);

  return <PostPage post={data} />;
}
