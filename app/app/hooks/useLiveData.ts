import { client } from "~/utils/sanity";
import { useEffect, useState } from "react";
import { Slug } from "@sanity/types";

export function useLiveData<T extends { slug: Slug; _type: string }>(
  document: T,
) {
  const [result, setResult] = useState<T>(document);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return () => {};
    } else {
      const subscription = client
        .listen<T>(
          `*[_type == "${document._type}" && slug.current == $slug][0]`,
          {
            slug: document.slug.current,
          },
        )
        .subscribe((update) => {
          if (update.type === "mutation" && update.result !== undefined) {
            setResult(update.result);
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [document.slug]);

  return result;
}
