import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminPage() {
  return (
    <div>
      Admin Page <Link href="/bible/admin/login">Flashcard List</Link>
    </div>
  );
}
