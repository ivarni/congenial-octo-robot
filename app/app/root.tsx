import { type LinksFunction, json } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./root.module.css";
import { lazy, Suspense } from "react";
import * as process from "process";
import { getSession } from "~/utils/session";
import { LoaderArgs } from "@remix-run/server-runtime";

const PreviewProvider = lazy(() => import("~/preview/PreviewProvider"));

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("preview");
  const previewDrafts = !!token;

  console.log({ previewDrafts, token });

  return json({
    ENV: {
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
      SANITY_DATASET: process.env.SANITY_DATASET,
    },
    previewDrafts,
    token,
  });
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: cssBundleHref },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@500;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
  ];
};

export default function App() {
  const { ENV, previewDrafts, token } = useLoaderData<typeof loader>();

  const children = <Outlet />;

  return (
    <html lang="en" className={styles.app}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={styles.container}>
          <header className={styles.header}>
            <a className={styles.header__title} href="/">
              Remix + Sanity
            </a>
          </header>
          <main>
            {previewDrafts ? (
              <Suspense fallback={children}>
                <PreviewProvider token={token}>{children}</PreviewProvider>
              </Suspense>
            ) : (
              children
            )}
          </main>
          <footer className={styles.footer}>
            <p className={styles.footer__text}>
              Made with{" "}
              <svg
                datasanity-icon="heart-filled"
                width="1em"
                height="1em"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 16C15.8 17.3235 12.5 20.5 12.5 20.5C12.5 20.5 9.2 17.3235 8 16C5.2 12.9118 4.5 11.7059 4.5 9.5C4.5 7.29412 6.1 5.5 8.5 5.5C10.5 5.5 11.7 6.82353 12.5 8.14706C13.3 6.82353 14.5 5.5 16.5 5.5C18.9 5.5 20.5 7.29412 20.5 9.5C20.5 11.7059 19.8 12.9118 17 16Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.2"
                ></path>
              </svg>{" "}
              at Sanity
            </p>
          </footer>
        </div>

        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
