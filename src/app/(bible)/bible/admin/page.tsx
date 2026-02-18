import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/bible/admin/flashcard/list");
}
