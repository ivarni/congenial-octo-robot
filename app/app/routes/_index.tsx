import { useLoaderData, type V2_MetaFunction } from "@remix-run/react";
import { getPosts } from "~/utils/sanity";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async () => {
  const posts = await getPosts();
  return posts;
};

export default function Index() {
  const posts = useLoaderData<typeof loader>();

  return (
    <section>
      {posts.length && (
        <ul>
          {posts.map((post) => (
            <li key={post.slug.current}>
              <a className="card__link" href={`/post/${post.slug.current}`}>
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
