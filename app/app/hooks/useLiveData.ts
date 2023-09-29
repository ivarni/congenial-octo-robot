import { client, Post } from "~/utils/sanity";
import { useEffect, useState } from "react";

export function useLiveData(post: Post) {
  const [result, setResult] = useState(post);

  useEffect(() => {
    const subscription = client
      .listen<Post>('*[_type == "post" && slug.current == $slug][0]', {
        slug: post.slug,
      })
      .subscribe((update) => {
        if (update.type === "mutation") {
          setResult(update.result as Post);
        }
      });

    return () => subscription.unsubscribe();
  }, [post.slug]);

  return result;
}
