import { getTriageResult } from "@/lib/data";
import TriageDashboard from "@/components/TriageDashboard/TriageDashboard";

export default async function Home() {
  const result = await getTriageResult();

  return <TriageDashboard initialResult={result} />;
}
