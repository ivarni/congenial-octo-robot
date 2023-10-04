import { LiveQueryProvider } from "@sanity/preview-kit";
import { client } from "~/utils/sanity";
import { ReactNode } from "react";
import { ExitPreview } from "~/preview/ExitPreview";

export default function PreviewProvider({
  children,
  token,
}: {
  children: ReactNode;
  token: string;
}) {
  if (!token) throw new TypeError("Missing token");
  return (
    <LiveQueryProvider client={client} token={token}>
      {children}
      <ExitPreview />
    </LiveQueryProvider>
  );
}
