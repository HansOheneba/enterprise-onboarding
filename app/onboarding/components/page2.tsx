// Update app/onboarding/components/page2.tsx (FinancialMOTPage2)
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingStore } from "../hooks/useOnboardingStore";

const FINANCIAL_GOALS = [
  { id: "retirement", label: "Retirement Planning" },
  { id: "home", label: "Buying a Home" },
  { id: "education", label: "Education Funding" },
  { id: "debt", label: "Debt Reduction" },
  { id: "investment", label: "Wealth Building" },
  { id: "emergency", label: "Emergency Fund" },
  { id: "travel", label: "Travel/Vacation" },
  { id: "other", label: "Other" },
];

const RISK_TOLERANCE = [
  {
    value: "low",
    label: "Conservative",
    description:
      "I prefer stable, predictable returns even if growth is slower",
  },
  {
    value: "medium",
    label: "Balanced",
    description: "I want a balance of growth and stability",
  },
  {
    value: "high",
    label: "Growth-Oriented",
    description: "I seek maximum growth potential and can handle volatility",
  },
];

const FINANCIAL_KNOWLEDGE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "I'm new to financial planning and investing",
    details: [
      "Just starting to learn about finances",
      "Need help with basic budgeting and saving",
      "Want to understand investment basics",
    ],
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "I have some knowledge but want to improve",
    details: [
      "Understand basic investing concepts",
      "Have started some investments",
      "Want to optimize my financial strategy",
    ],
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "I'm experienced with finances and investing",
    details: [
      "Comfortable with complex investment strategies",
      "Regularly manage my portfolio",
      "Looking for advanced optimization",
    ],
  },
];

export function FinancialMOTPage2() {
  const router = useRouter();
  const { data, updateData, completeStep, setStep } = useOnboardingStore();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    data.financialGoals || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasInitialized = React.useRef(false);

  // Scroll to top on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      // Populate initial state from store only once
      hasInitialized.current = true;
    }
    window.scrollTo(0, 0);
  }, []);

  const handleGoalToggle = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id) => id !== goalId)
      : [...selectedGoals, goalId];

    setSelectedGoals(newGoals);
    updateData({ financialGoals: newGoals });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.riskTolerance) {
      alert("Please select your risk tolerance");
      return;
    }

    if (!data.financialKnowledge) {
      alert("Please select your financial knowledge level");
      return;
    }

    try {
      setIsSubmitting(true);

      // Optional: Save all data to your backend
      // const response = await fetch('/api/onboarding/complete', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // if (response.ok) {
      completeStep(3);
      // Log the entire store data
      console.log("Onboarding Store Data (Step 3 → Book Session):", data);

      // Redirect to booking page
      router.push("/onboarding/book-session");
      // } else {
      //   throw new Error('Failed to save data');
      // }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
          Financial Goals & Preferences
        </h1>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Help us personalize your financial advisory experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Financial Knowledge */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Financial Knowledge Level
            </h2>
          </div>

          <Label className="text-lg font-medium text-neutral-900">
            How would you describe your current financial knowledge?
          </Label>

          <div className="space-y-4">
            {FINANCIAL_KNOWLEDGE_LEVELS.map((level) => (
              <div
                key={level.value}
                className={`rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  data.financialKnowledge === level.value
                    ? "border-[#1B1856] bg-[#1B1856]/5"
                    : "border-black/10 hover:border-neutral-400"
                }`}
                onClick={() =>
                  updateData({
                    financialKnowledge: level.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  })
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {level.label}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-700 mb-3">
                      {level.description}
                    </p>
                    <ul className="space-y-1">
                      {level.details.map((detail, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-neutral-600"
                        >
                          <span className="text-[#1B1856] mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 ml-4 mt-1 ${
                      data.financialKnowledge === level.value
                        ? "border-[#1B1856] bg-[#1B1856]"
                        : "border-black/30"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-neutral-500 mt-3">
            This helps us tailor our advice to your current understanding
          </p>
        </div>

        {/* Section 2: Financial Goals - FIXED */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Financial Goals
            </h2>
          </div>

          <Label className="text-lg font-medium text-neutral-900">
            What are your financial goals? (Select all that apply)
          </Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FINANCIAL_GOALS.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                  selectedGoals.includes(goal.id)
                    ? "border-[#1B1856] bg-[#1B1856]/5"
                    : "border-black/10"
                }`}
              >
                <Checkbox
                  id={`goal-${goal.id}`}
                  checked={selectedGoals.includes(goal.id)}
                  onCheckedChange={() => handleGoalToggle(goal.id)}
                  className={`${
                    selectedGoals.includes(goal.id)
                      ? "border-[#1B1856] bg-[#1B1856]"
                      : ""
                  }`}
                />
                <Label
                  htmlFor={`goal-${goal.id}`}
                  className="text-sm font-normal leading-none cursor-pointer"
                >
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Risk Tolerance */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Risk Tolerance
            </h2>
          </div>

          <Label className="text-lg font-medium text-neutral-900">
            How would you describe your investment risk tolerance?
          </Label>

          <div className="space-y-4">
            {RISK_TOLERANCE.map((risk) => (
              <div
                key={risk.value}
                className={`rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  data.riskTolerance === risk.value
                    ? "border-[#1B1856] bg-[#1B1856]/5"
                    : "border-black/10 hover:border-neutral-400"
                }`}
                onClick={() =>
                  updateData({
                    riskTolerance: risk.value as "low" | "medium" | "high",
                  })
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-neutral-900">
                        {risk.label}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {risk.description}
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 ml-4 ${
                      data.riskTolerance === risk.value
                        ? "border-[#1B1856] bg-[#1B1856]"
                        : "border-black/30"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-800 mb-1">
              Understanding Risk Tolerance
            </h4>
            <p className="text-sm text-blue-700">
              Your risk tolerance helps us recommend suitable investment
              strategies. Higher risk typically means higher potential returns,
              but also greater volatility.
            </p>
          </div>
        </div>

        {/* Optional: Additional Questions */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <h2 className="text-xl font-semibold text-neutral-900">
            Additional Preferences
          </h2>

          <div className="space-y-4">
            {/* Investment Timeframe */}
            <div className="space-y-2">
              <Label className="text-neutral-700">Investment Timeframe</Label>
              <p className="text-sm text-neutral-500">
                How long can you leave your money invested before you need it?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`rounded-lg border p-4 text-center cursor-pointer transition-colors ${
                    data.investmentTimeframe === "short"
                      ? "border-[#1B1856] bg-[#1B1856]/5"
                      : "border-black/10 hover:border-neutral-400"
                  }`}
                  onClick={() => updateData({ investmentTimeframe: "short" })}
                >
                  <h4 className="font-medium text-neutral-900">Short-term</h4>
                  <p className="text-sm text-neutral-600">1-3 years</p>
                </div>
                <div
                  className={`rounded-lg border p-4 text-center cursor-pointer transition-colors ${
                    data.investmentTimeframe === "medium"
                      ? "border-[#1B1856] bg-[#1B1856]/5"
                      : "border-black/10 hover:border-neutral-400"
                  }`}
                  onClick={() => updateData({ investmentTimeframe: "medium" })}
                >
                  <h4 className="font-medium text-neutral-900">Medium-term</h4>
                  <p className="text-sm text-neutral-600">3-7 years</p>
                </div>
                <div
                  className={`rounded-lg border p-4 text-center cursor-pointer transition-colors ${
                    data.investmentTimeframe === "long"
                      ? "border-[#1B1856] bg-[#1B1856]/5"
                      : "border-black/10 hover:border-neutral-400"
                  }`}
                  onClick={() => updateData({ investmentTimeframe: "long" })}
                >
                  <h4 className="font-medium text-neutral-900">Long-term</h4>
                  <p className="text-sm text-neutral-600">7+ years</p>
                </div>
              </div>
            </div>

            {/* Emergency Fund */}
            <div className="space-y-2">
              <Label className="text-neutral-700">Emergency Fund Status</Label>
              <p className="text-sm text-neutral-500">
                Do you have an emergency fund (3-6 months of expenses)?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`rounded-lg border p-4 text-center cursor-pointer transition-colors ${
                    data.emergencyFund === "yes"
                      ? "border-green-600 bg-green-50"
                      : "border-black/10 hover:border-neutral-400"
                  }`}
                  onClick={() => updateData({ emergencyFund: "yes" })}
                >
                  <h4 className="font-medium text-neutral-900">Yes</h4>
                  <p className="text-sm text-neutral-600">3-6 months covered</p>
                </div>
                <div
                  className={`rounded-lg border p-4 text-center cursor-pointer transition-colors ${
                    data.emergencyFund === "partial"
                      ? "border-yellow-600 bg-yellow-50"
                      : "border-black/10 hover:border-neutral-400"
                  }`}
                  onClick={() => updateData({ emergencyFund: "partial" })}
                >
                  <h4 className="font-medium text-neutral-900">Partial</h4>
                  <p className="text-sm text-neutral-600">Building it up</p>
                </div>
                <div
                  className={`rounded-lg border p-4 text-center cursor-pointer transition-colors ${
                    data.emergencyFund === "no"
                      ? "border-red-600 bg-red-50"
                      : "border-black/10 hover:border-neutral-400"
                  }`}
                  onClick={() => updateData({ emergencyFund: "no" })}
                >
                  <h4 className="font-medium text-neutral-900">Not yet</h4>
                  <p className="text-sm text-neutral-600">Need to start</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStep(2);
              router.push("/onboarding?step=2");
            }}
            className="h-12 flex-1 rounded-full border-black/10"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-full bg-[#1B1856] text-white hover:bg-[#1B1856]/90 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Complete & Book Session"}
          </Button>
        </div>
      </form>
    </div>
  );
}
