import { getDashboardData } from "@/lib/dashboard-data";
import { IndividualDashboard } from "@/components/IndividualDashboard/IndividualDashboard";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <IndividualContainer>
      <IndividualDashboard data={data} />
    </IndividualContainer>
  );
}
