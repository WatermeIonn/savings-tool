import { Snippet } from "@nextui-org/snippet";
import GoalsTable from "@/components/goalsTable";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 w-full">
        <GoalsTable />
    </section>
  );
}
