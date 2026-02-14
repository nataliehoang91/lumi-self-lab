import { getDashboardData } from "@/lib/dashboard-data";
import { IndividualDashboard } from "@/components/IndividualDashboard/IndividualDashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <IndividualDashboard data={data} />;
}
