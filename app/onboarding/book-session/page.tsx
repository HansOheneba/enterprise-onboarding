// app/book-session/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "../hooks/useOnboardingStore";
import { Loader2, Calendar, ArrowLeft, ShieldCheck, Mail, Phone, Target, DollarSign, TrendingUp } from "lucide-react";

declare global {
  interface Window {
    gapi: any;
    calendar: any;
  }
}

export default function BookSessionPage() {
  const router = useRouter();
  const { data, reset } = useOnboardingStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const [bookingStarted, setBookingStarted] = React.useState(false);

  // Load Google Calendar script
  useEffect(() => {
    const loadScript = () => {
      // If already loaded
      if (window.calendar?.schedulingButton) {
        setScriptLoaded(true);
        setIsLoading(false);
        return;
      }

      // CSS (avoid duplicates)
      const existingCss = document.querySelector(
        'link[href="https://calendar.google.com/calendar/scheduling-button-script.css"]'
      );
      if (!existingCss) {
        const link = document.createElement("link");
        link.href = "https://calendar.google.com/calendar/scheduling-button-script.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }

      // JS (avoid duplicates)
      const existingScript = document.querySelector(
        'script[src="https://calendar.google.com/calendar/scheduling-button-script.js"]'
      );

      if (existingScript) {
        // script exists but might not have finished loading
        const check = setInterval(() => {
          if (window.calendar?.schedulingButton) {
            clearInterval(check);
            setScriptLoaded(true);
            setIsLoading(false);
          }
        }, 200);

        setTimeout(() => clearInterval(check), 6000);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://calendar.google.com/calendar/scheduling-button-script.js";
      script.async = true;

      script.onload = () => {
        setScriptLoaded(true);
        setIsLoading(false);
      };

      script.onerror = () => {
        console.error("Failed to load Google Calendar script");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    loadScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize the calendar button once script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      initializeCalendarButton();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  const initializeCalendarButton = () => {
    if (window.calendar?.schedulingButton) {
      const target = document.getElementById("calendar-scheduling-button");
      if (!target) return;

      // Prevent duplicates if init runs more than once
      target.innerHTML = "";

      window.calendar.schedulingButton.load({
        url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2oNkk8xLNeobcMRVs7g2CvvviCQxYPsufMva3m0Qy2YgeAV01vLxqabFuYZZkRiSUsNxy-5FuI?gv=true",
        color: "#1B1856",
        label: "Book Your Advisory Session",
        target,
      });
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleRestartOnboarding = () => {
    reset();
    router.push("/onboarding?step=1");
  };

  const fullName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();

  return (
    <div className="min-h-screen ">
      <div className="mt-30"></div>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Top actions */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
         onClick={handleRestartOnboarding}
            variant="outline"
            className="h-11 rounded-full border-black/10 bg-white/60 hover:bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          Edit my information
          </Button>
        </div>

        {/* Hero header */}
        <div className="mb-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
       

              <h1 className="mt-4 font-serif text-3xl text-neutral-900 sm:text-4xl">
                Schedule your advisory session
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                Hi {data.firstName}, choose a time that works best for you. Sessions are{" "}
                <span className="font-medium text-neutral-900">60 minutes</span> and conducted{" "}
                <span className="font-medium text-neutral-900">via video call</span>.
              </p>
            </div>

            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white ring-1 ring-black/10">
              <Calendar className="h-7 w-7 text-neutral-900" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: user card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-base font-medium text-neutral-900">
                Your details
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                We’ll use this information for your booking and session confirmation.
              </p>

              <div className="mt-6 space-y-4">
                <InfoRow label="Name" value={fullName || "—"} />
                <InfoRow label="Email" value={data.email || "—"} />
                <InfoRow label="Phone" value={data.phone || "—"} />
                <InfoRow label="Time zone" value={data.timeZone || "—"} />
              </div>
            </div>

      
          </div>

          {/* Right: calendar widget */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-medium text-neutral-900">
                    Select a time
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    You’ll receive a confirmation email with the video call link after booking.
                  </p>
                </div>

                <div className="hidden sm:block rounded-2xl border border-black/10 bg-[#f4f3f2] px-2 py-2 text-xs text-neutral-700">
                  60 min • Video call
                </div>
              </div>

              <div className="mt-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-[#f4f3f2] py-14">
                    <Loader2 className="mb-4 h-8 w-8 animate-spin text-neutral-900" />
                    <p className="text-neutral-700">Loading scheduling calendar…</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      This should only take a moment.
                    </p>
                  </div>
                ) : (
                  <div
                    className="w-fit mx-auto"
                    onClick={() => setBookingStarted(true)}
                  >
                    <div id="calendar-scheduling-button" className="inline-block" />
                  </div>
                )}

                {!isLoading && !scriptLoaded ? (
                  <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                    <p className="text-sm text-yellow-800">
                      The calendar didn’t load.{" "}
                      <button
                        onClick={() => window.location.reload()}
                        className="font-medium underline underline-offset-4"
                      >
                        Refresh the page
                      </button>{" "}
                      and try again.
                    </p>
                  </div>
                ) : null}

                {bookingStarted && (
                  <div className="mt-6 rounded-2xl border border-black/10 bg-[#f4f3f2] p-4">
                    <p className="text-sm text-neutral-700">
                      If you’ve booked your session, check your email for confirmation and next steps.
                    </p>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button
                        className="h-11 rounded-full bg-[#1B1856] text-white"
                        onClick={() => router.push("/")}
                      >
                        Go back home
                      </Button>
                      <Button
                        variant="outline"
                        className="h-11 rounded-full border-black/10"
                        onClick={() => setBookingStarted(false)}
                      >
                        Not yet
                      </Button>
                    </div>
                  </div>
                )}
              </div>

          
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-6" />
      </div>

      <style jsx global>{`
        .qxCTlb {
          background-color: #1B1856 !important;
          color: #ffffff !important;
          height: 44px !important;
          padding: 0 24px !important;
          border-radius: 9999px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          border: none !important;
          box-shadow: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        #calendar-scheduling-button .qxCTlb:hover {
          background-color: rgba(27, 24, 86, 0.9) !important;
        }
        #calendar-scheduling-button .qxCTlb:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(27, 24, 86, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="text-sm font-medium text-neutral-900 text-right break-all">
        {value}
      </p>
    </div>
  );
}
