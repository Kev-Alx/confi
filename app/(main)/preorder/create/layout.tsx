"use client";

import { usePathname, useRouter } from "next/navigation";

import FormStepper from "@/components/preorder/form-stepper";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const router = useRouter();
  const path = usePathname();

  if (user?.role !== "JASTIPER") {
    router.push("/jastiper/register");
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 relative">
      <h1 className="font-semibold text-xl my-2">Make a preorder</h1>
      <div className="w-full mx-auto max-w-4xl gap-x-8 grid md:grid-cols-[1fr_3fr] ">
        <div className="hidden md:block sticky top-24 h-fit ">
          <FormStepper
            currentStep={path.endsWith("/items") ? 1 : 0}
            steps={["Preorder Details", "Open Items"]}
          />
        </div>
        {children}
      </div>
    </main>
  );
}
