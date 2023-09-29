import { Post } from "~/utils/sanity";
import { urlFor } from "~/utils/image";
import { formatDate } from "~/utils";
import { PortableText } from "@portabletext/react";
import styles from "./post.module.css";
export const PostPage = ({ post }: { post: Post }) => {
  return (
    <section className={styles.post}>
      {post.mainImage ? (
        <img
          className={styles.post__cover}
          src={urlFor(post.mainImage).url()}
          alt="Cover"
        />
      ) : (
        <div className={styles.post__coverNone} />
      )}
      <div className={styles.post__container}>
        <h1 className={styles.post__title}>{post.title}</h1>
        <p className={styles.post__excerpt}>{post.excerpt}</p>
        <p className={styles.post__date}>{formatDate(post._createdAt)}</p>
        <div className={styles.post__content}>
          <PortableText value={post.body} />
        </div>
      </div>
    </section>
  );
};
