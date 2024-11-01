import React from "react";

import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  steps: string[];
  currentStep: number;
};

const FormStepper = ({ currentStep, steps }: Props) => {
  return (
    <div className="grid grid-cols-[1fr_4fr] gap-x-2">
      <div className="grid-rows-subgrid grid grid-cols-1 gap-6 px-1 py-1 place-items-center row-span-2 bg-slate-200 rounded-full">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "w-full aspect-square max-w-8 rounded-full col-start-1 grid place-items-center",
              index < currentStep ? "bg-emerald-500" : "bg-primary"
            )}
          >
            {index < currentStep ? (
              <CheckIcon className="text-white" />
            ) : (
              <span className="text-white">{index + 1}</span>
            )}
          </div>
        ))}
      </div>
      {steps.map((step, index) => (
        <div className="flex items-center" key={index}>
          <p className="font-medium">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default FormStepper;
