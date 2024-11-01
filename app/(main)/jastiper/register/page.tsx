import { redirect } from "next/navigation";
import React from "react";

import JastiperForm from "@/components/jastiper-form";
import { getCurrentUser } from "@/data/user";

const Page = async () => {
  const user = await getCurrentUser();

  if (user?.role === "JASTIPER") {
    redirect("/search");
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Verify your identity</h1>
      <p className="text-muted-foreground text-sm mt-2 mb-8">
        To ensure the security and integrity of our customers, we need to verify
        your identity. The information you provide will be securely stored in
        accordance with our privacy policy.
      </p>

      <JastiperForm />
    </div>
  );
};

export default Page;
