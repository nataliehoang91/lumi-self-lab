import { RootRedirect } from "./RootRedirect";

/**
 * Main page. Route: /.
 * Redirect is handled in middleware (auth → /dashboard, else → /welcome).
 * This component is a fallback if the request reaches the page; it redirects on the client to avoid Performance API errors from server redirect().
 */
export default function MainPage() {
  return <RootRedirect />;
}
