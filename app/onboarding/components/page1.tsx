// app/onboarding/components/FinancialMOTPage.tsx
"use client";

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOnboardingStore } from '../hooks/useOnboardingStore';
import { X, Plus } from 'lucide-react';

const INCOME_SOURCE_OPTIONS = [
  { value: 'salary', label: 'Salary/Wages' },
  { value: 'business', label: 'Business Income' },
  { value: 'investments', label: 'Investment Income' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'retirement', label: 'Retirement/Pension' },
  { value: 'freelance', label: 'Freelance/Gig Work' },
  { value: 'multiple', label: 'Multiple Sources' },
  { value: 'other', label: 'Other' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'GHS', label: 'Ghanaian Cedi (₵)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AED', label: 'UAE Dirham (د.إ)' },
  { value: 'ZAR', label: 'South African Rand (R)' },
  { value: 'NGN', label: 'Nigerian Naira (₦)' },
];

const COUNTRY_SUGGESTIONS = [
  'Ghana',
  'United States',
  'United Kingdom',
  'Canada',
  'United Arab Emirates',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Germany',
  'France',
  'Australia',
  'Singapore',
  'Japan',
  'China',
  'India',
  'Brazil',
];

// Helper function to format number with commas
const formatNumberWithCommas = (value: string | number): string => {
  if (!value) return '';
  const num = typeof value === 'string' ? value.replace(/,/g, '') : value;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to remove all non-numeric characters from input
const removeCommas = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export function FinancialMOTPage() {
  const router = useRouter();
  const { data, updateData, completeStep, setStep } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currency, setCurrency] = useState<string>('USD');
  const [countryInput, setCountryInput] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const countryInputRef = useRef<HTMLInputElement>(null);

  // Get selected countries from store or initialize as empty array
  const selectedCountries = data.assetCountries || [];

  // Filter suggestions based on input
  const filteredSuggestions = COUNTRY_SUGGESTIONS.filter(country =>
    country.toLowerCase().includes(countryInput.toLowerCase()) &&
    !selectedCountries.includes(country)
  );

  const handleAddCountry = (country: string) => {
    if (!country.trim()) return;
    
    const trimmedCountry = country.trim();
    if (!selectedCountries.includes(trimmedCountry)) {
      const newCountries = [...selectedCountries, trimmedCountry];
      updateData({ assetCountries: newCountries });
    }
    
    setCountryInput('');
    setShowSuggestions(false);
  };

  const handleRemoveCountry = (countryToRemove: string) => {
    const newCountries = selectedCountries.filter(country => country !== countryToRemove);
    updateData({ assetCountries: newCountries });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (countryInput.trim()) {
        handleAddCountry(countryInput);
      }
    } else if (e.key === 'Backspace' && !countryInput && selectedCountries.length > 0) {
      // Remove last country when backspace is pressed on empty input
      handleRemoveCountry(selectedCountries[selectedCountries.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddCountry(suggestion);
    countryInputRef.current?.focus();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation for key financial metrics
    if (!data.monthlyIncome) newErrors.monthlyIncome = "Monthly income is required";
    if (!data.monthlyExpenses) newErrors.monthlyExpenses = "Monthly expenses are required";
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    completeStep(2);
    setStep(3);
    
    // Log the entire store data
    console.log("Onboarding Store Data (Step 2 → Step 3):", data);
    
    router.push('/onboarding?step=3');
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD': return '$';
      case 'GHS': return '₵';
      case 'GBP': return '£';
      case 'EUR': return '€';
      case 'CAD': return 'C$';
      case 'AED': return 'د.إ';
      case 'ZAR': return 'R';
      case 'NGN': return '₦';
      default: return '$';
    }
  };

  const hasInitialized = React.useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      // Populate form from store only once on mount
      hasInitialized.current = true;
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
          Financial Health Assessment
        </h1>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          {"Let's understand your current financial situation"}
        </p>
      </div>

      {/* Currency Selector */}
      <div className="mb-6">
        <Label className="text-neutral-700 mb-2 block">Select Currency for All Amounts</Label>
        <Select
          value={currency}
          onValueChange={setCurrency}
        >
          <SelectTrigger className="h-12 rounded-xl border-black/10 bg-white w-full md:w-64">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Income & Expenses */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">Income & Expenses</h2>
          </div>
          
          <div className="space-y-2">
            <Label className="text-neutral-700">Primary Income Source</Label>
            <Select
              value={data.primaryIncomeSource || ''}
              onValueChange={(v) => updateData({ primaryIncomeSource: v })}
            >
              <SelectTrigger className="h-12 rounded-xl border-black/10 bg-white">
                <SelectValue placeholder="Select your main income source" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_SOURCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome" className="text-neutral-700">
                Monthly Income (after tax)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="monthlyIncome"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.monthlyIncome || '')}
                  onChange={(e) => updateData({ monthlyIncome: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
              {errors.monthlyIncome && (
                <p className="text-xs text-red-600">{errors.monthlyIncome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses" className="text-neutral-700">
                Monthly Expenses
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="monthlyExpenses"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.monthlyExpenses || '')}
                  onChange={(e) => updateData({ monthlyExpenses: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
              {errors.monthlyExpenses && (
                <p className="text-xs text-red-600">{errors.monthlyExpenses}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Assets */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">Assets</h2>
            <p className="text-sm text-neutral-500 ml-auto">Optional - You can skip if unsure</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cashSavings" className="text-neutral-700">
                Cash & Savings Accounts
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="cashSavings"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.cashSavings || '')}
                  onChange={(e) => updateData({ cashSavings: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentPortfolio" className="text-neutral-700">
                Investment Portfolio (Stocks, Bonds, Funds)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="investmentPortfolio"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.investmentPortfolio || '')}
                  onChange={(e) => updateData({ investmentPortfolio: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirementAccounts" className="text-neutral-700">
                Retirement Accounts (Pension, 401k, etc.)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="retirementAccounts"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.retirementAccounts || '')}
                  onChange={(e) => updateData({ retirementAccounts: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="realEstateValue" className="text-neutral-700">
                Real Estate Value (Primary & Investment)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="realEstateValue"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.realEstateValue || '')}
                  onChange={(e) => updateData({ realEstateValue: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherAssets" className="text-neutral-700">
                Other Assets (Business, Vehicles, Collectibles)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="otherAssets"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.otherAssets || '')}
                  onChange={(e) => updateData({ otherAssets: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Liabilities */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">Liabilities</h2>
            <p className="text-sm text-neutral-500 ml-auto">Optional - You can skip if unsure</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mortgageDebt" className="text-neutral-700">
                Mortgage Debt
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="mortgageDebt"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.mortgageDebt || '')}
                  onChange={(e) => updateData({ mortgageDebt: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentLoans" className="text-neutral-700">
                Student Loans
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="studentLoans"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.studentLoans || '')}
                  onChange={(e) => updateData({ studentLoans: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditCardDebt" className="text-neutral-700">
                Credit Card Debt
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="creditCardDebt"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.creditCardDebt || '')}
                  onChange={(e) => updateData({ creditCardDebt: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalLoans" className="text-neutral-700">
                Personal/Other Loans
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="personalLoans"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(data.personalLoans || '')}
                  onChange={(e) => updateData({ personalLoans: removeCommas(e.target.value) })}
                  className="h-12 rounded-xl border-black/10 bg-white pl-8"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Asset Locations - UPDATED WITH TAG INPUT */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-neutral-900">Asset Locations</h2>
            <p className="text-sm text-neutral-500 ml-auto">Optional - Where are your assets held?</p>
          </div>
          
          <div className="space-y-3">
            <Label className="text-neutral-700">Add countries where your assets are located</Label>
            
            {/* Display selected countries as tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCountries.map((country) => (
                <div
                  key={country}
                  className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 px-3 py-1.5 rounded-full text-sm"
                >
                  <span>{country}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCountry(country)}
                    className="text-neutral-500 hover:text-neutral-700"
                    aria-label={`Remove ${country}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Country input with suggestions */}
            <div className="relative">
              <div className="relative">
                <Input
                  ref={countryInputRef}
                  type="text"
                  value={countryInput}
                  onChange={(e) => {
                    setCountryInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a country name and press Enter or comma"
                  className="h-12 rounded-xl border-black/10 bg-white pr-10"
                />
                {countryInput.trim() && (
                  <button
                    type="button"
                    onClick={() => handleAddCountry(countryInput)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
                    aria-label="Add country"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Suggestions dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-black/10 bg-white py-2 shadow-lg">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Helper text */}
            <p className="text-xs text-neutral-500">
              Press Enter or comma to add a country. Click the × button to remove.
              <br />
              Common suggestions: Ghana, United States, United Kingdom, etc.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStep(1);
              router.push('/onboarding?step=1');
            }}
            className="h-12 flex-1 rounded-full border-black/10"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="h-12 flex-1 rounded-full bg-[#1B1856] text-white hover:bg-[#1B1856]/90"
          >
            Continue to Goals & Risk
          </Button>
        </div>
      </form>
    </div>
  );
}