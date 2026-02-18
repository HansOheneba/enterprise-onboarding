"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useOnboardingStore } from "../hooks/useOnboardingStore";

const AGE_RANGES = [
  { value: "18-24", label: "18-24 years" },
  { value: "25-34", label: "25-34 years" },
  { value: "35-44", label: "35-44 years" },
  { value: "45-54", label: "45-54 years" },
  { value: "55-64", label: "55-64 years" },
  { value: "65+", label: "65+ years" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
];

const DEPENDENTS_OPTIONS = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5+", label: "5+" },
];

function FieldError({ show, message }: { show: boolean; message?: string }) {
  if (!show || !message) return null;
  return <p className="text-[11px] leading-4 text-red-600">{message}</p>;
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function PersonalInfoPage() {
  const router = useRouter();
  const { data, updateData, completeStep, setStep } = useOnboardingStore();

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const selectedDate = React.useMemo(() => {
    if (!data.dateOfBirth) return undefined;
    const next = new Date(data.dateOfBirth);
    return Number.isNaN(next.getTime()) ? undefined : next;
  }, [data.dateOfBirth]);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!data.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!data.email?.trim()) newErrors.email = "Email is required";
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email))
      newErrors.email = "Enter a valid email";
    if (!data.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!data.timeZone?.trim()) newErrors.timeZone = "Location is required";
    if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!data.citizenship?.trim())
      newErrors.citizenship = "Citizenship is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.maritalStatus)
      newErrors.maritalStatus = "Marital status is required";
    if (data.dependents === undefined)
      newErrors.dependents = "Number of dependents is required";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        timeZone: true,
        dateOfBirth: true,
        citizenship: true,
        gender: true,
        maritalStatus: true,
        dependents: true,
      });
      return;
    }

    completeStep(1);
    setStep(2);

    // Log the entire store data
    console.log("Onboarding Store Data (Step 1 → Step 2):", data);

    router.push("/onboarding?step=2");
  };

  const handleDateSelect = (date: Date | undefined) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    updateData({ dateOfBirth: dateString });
    clearError("dateOfBirth");
    setDatePickerOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-8">
      <div className="mb-5">
        <h1 className="font-serif text-2xl text-neutral-900 sm:text-3xl">
          Personal Information
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Basic details to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card title="Basic details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-sm text-neutral-700">
                First name
              </Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => {
                  updateData({ firstName: e.target.value });
                  clearError("firstName");
                }}
                onBlur={() => markTouched("firstName")}
                className="h-10 rounded-xl border-black/10 bg-white"
              />
              <FieldError
                show={Boolean(touched.firstName)}
                message={errors.firstName}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-sm text-neutral-700">
                Last name
              </Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => {
                  updateData({ lastName: e.target.value });
                  clearError("lastName");
                }}
                onBlur={() => markTouched("lastName")}
                className="h-10 rounded-xl border-black/10 bg-white"
              />
              <FieldError
                show={Boolean(touched.lastName)}
                message={errors.lastName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-neutral-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => {
                  updateData({ email: e.target.value });
                  clearError("email");
                }}
                onBlur={() => markTouched("email")}
                className="h-10 rounded-xl border-black/10 bg-white"
              />
              <FieldError
                show={Boolean(touched.email)}
                message={errors.email}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm text-neutral-700">
                Phone
              </Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => {
                  updateData({ phone: e.target.value });
                  clearError("phone");
                }}
                onBlur={() => markTouched("phone")}
                className="h-10 rounded-xl border-black/10 bg-white"
              />
              <FieldError
                show={Boolean(touched.phone)}
                message={errors.phone}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm text-neutral-700">
              Location
            </Label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                id="location"
                value={data.timeZone}
                onChange={(e) => {
                  updateData({ timeZone: e.target.value });
                  clearError("timeZone");
                }}
                onBlur={() => markTouched("timeZone")}
                placeholder="e.g., Accra, Ghana"
                className="h-10 rounded-xl border-black/10 bg-white pl-9"
              />
            </div>

            <FieldError
              show={Boolean(touched.timeZone)}
              message={errors.timeZone}
            />
            <p className="text-xs text-neutral-500">
              Used for scheduling sessions.
            </p>
          </div>
        </Card>
        <Card title="Demographics">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-neutral-700">Date of Birth</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start text-left font-normal rounded-xl border-black/10 bg-white px-3",
                      !selectedDate && "text-muted-foreground",
                    )}
                    onBlur={() => markTouched("dateOfBirth")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    captionLayout="dropdown"
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <FieldError
                show={Boolean(touched.dateOfBirth)}
                message={errors.dateOfBirth}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="citizenship" className="text-sm text-neutral-700">
                Citizenship
              </Label>
              <Input
                id="citizenship"
                value={data.citizenship || ""}
                onChange={(e) => {
                  updateData({ citizenship: e.target.value });
                  clearError("citizenship");
                }}
                onBlur={() => markTouched("citizenship")}
                placeholder="e.g., Ghanaian"
                className="h-10 w-full rounded-xl border-black/10 bg-white"
              />
              <FieldError
                show={Boolean(touched.citizenship)}
                message={errors.citizenship}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-neutral-700">Gender</Label>
              <Select
                value={data.gender || ""}
                onValueChange={(v) => {
                  updateData({ gender: v });
                  clearError("gender");
                }}
              >
                <SelectTrigger
                  onBlur={() => markTouched("gender")}
                  className="h-10 w-full rounded-xl border-black/10 bg-white"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                show={Boolean(touched.gender)}
                message={errors.gender}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-neutral-700">Marital status</Label>
              <Select
                value={data.maritalStatus || ""}
                onValueChange={(v) => {
                  updateData({ maritalStatus: v });
                  clearError("maritalStatus");
                }}
              >
                <SelectTrigger
                  onBlur={() => markTouched("maritalStatus")}
                  className="h-10 w-full rounded-xl border-black/10 bg-white"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                show={Boolean(touched.maritalStatus)}
                message={errors.maritalStatus}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-sm text-neutral-700">Dependents</Label>
              <Select
                value={data.dependents?.toString() || ""}
                onValueChange={(v) => {
                  updateData({ dependents: Number(v) });
                  clearError("dependents");
                }}
              >
                <SelectTrigger
                  onBlur={() => markTouched("dependents")}
                  className="h-10 w-full rounded-xl border-black/10 bg-white"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {DEPENDENTS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FieldError
                show={Boolean(touched.dependents)}
                message={errors.dependents}
              />
              <p className="text-xs text-neutral-500">
                Anyone who relies on you financially.
              </p>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          className="h-11 w-full rounded-full bg-[#1B1856] text-white hover:bg-[#1B1856]/90"
        >
          Continue to Financial MOT
        </Button>
      </form>
    </div>
  );
}
