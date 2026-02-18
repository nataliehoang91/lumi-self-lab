import { redirect } from "next/server";

export default function AdminPage() {
  redirect("/bible/admin/flashcard/list");
}
