import { RootRedirect } from "./RootRedirect";

/**
 * Main page. Route: /.
 * Auto-redirects to /waitlist.
 */
export default function MainPage() {
  return <RootRedirect />;
}
