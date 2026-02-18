// app/onboarding/page.tsx
"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PersonalInfoPage } from "./components/bioData";
import { FinancialMOTPage } from "./components/page1";
import { FinancialMOTPage2 } from "./components/page2";
import { useOnboardingStore } from "./hooks/useOnboardingStore";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

// Progress Indicator Component
function ProgressIndicator() {
  const { data } = useOnboardingStore();

  const steps = [
    { number: 1, label: "Personal Info" },
    { number: 2, label: "Income & Expenses" },
    { number: 3, label: "Goals & Risk" },
  ];

  return (
    <div className="my-8">
      <div className="mt-30"></div>
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                data.currentStep >= step.number
                  ? "bg-[#1B1856] text-white"
                  : "border-2 border-black/20 text-black/40"
              }`}
            >
              {step.number}
            </div>
            <span className="mt-2 text-xs text-neutral-600">{step.label}</span>
          </div>
        ))}
      </div>
      <Progress
        value={((data.currentStep - 1) / (steps.length - 1)) * 100}
        className="mt-4"
      />
    </div>
  );
}

// Main Content Component
function OnboardingContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const { setStep, hydrated } = useOnboardingStore();

  useEffect(() => {
    const stepNum = parseInt(step || "1");
    if (stepNum >= 1 && stepNum <= 3) {
      setStep(stepNum);
    }
  }, [step, setStep]);

  const currentStep = parseInt(step || "1");

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#f4f3f2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1B1856] mb-4" />
          <p className="text-neutral-700">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ProgressIndicator />

        {currentStep === 1 && <PersonalInfoPage />}
        {currentStep === 2 && <FinancialMOTPage />}
        {currentStep === 3 && <FinancialMOTPage2 />}
      </div>
    </div>
  );
}

// Main Page Component with Suspense
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f3f2] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1B1856] mb-4" />
            <p className="text-neutral-700">Loading onboarding...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
