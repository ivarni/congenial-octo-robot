import { Post } from "~/utils/sanity";
import { urlFor } from "~/utils/image";
import { formatDate } from "~/utils";
import { PortableText } from "@portabletext/react";

export const PostPage = ({ post }: { post: Post }) => {
  return (
    <section className="post">
      {post.mainImage ? (
        <img
          className="post__cover"
          src={urlFor(post.mainImage).url()}
          alt="Cover"
        />
      ) : (
        <div className="post__cover--none" />
      )}
      <div className="post__container">
        <h1 className="post__title">{post.title}</h1>
        <p className="post__excerpt">{post.excerpt}</p>
        <p className="post__date">{formatDate(post._createdAt)}</p>
        <div className="post__content">
          <PortableText value={post.body} />
        </div>
      </div>
    </section>
  );
};
