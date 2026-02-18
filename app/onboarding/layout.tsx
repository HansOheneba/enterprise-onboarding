"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Temporarily disabled until verification is wired up.
const ENABLE_PAYMENT_VERIFICATION = false;

function OnboardingProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);

  const wasRecentlyVerified = () => {
    if (typeof window === "undefined") return false;
    const ts = sessionStorage.getItem("celerey_payment_verified_at");
    if (!ts) return false;
    const ageMs = Date.now() - Number(ts);
    return Number.isFinite(ageMs) && ageMs < 5 * 60 * 1000; // 5 minutes
  };


  useEffect(() => {
    if (ENABLE_PAYMENT_VERIFICATION) {
      let isMounted = true;

      const performVerification = async () => {
        const userId = localStorage.getItem("celerey_user_id");
        if (!userId) {
          console.log("No user ID found in localStorage");
          if (isMounted) {
            router.push("/");
            setIsVerifying(false);
          }
          return;
        }

        try {
          const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/access?user_id=${encodeURIComponent(userId)}`;
          console.log("Fetching from:", API_URL);

          const response = await fetch(API_URL, {
            credentials: "include",
          });

          if (!response.ok) {
            console.error("HTTP error:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Error response:", errorText);

            if (wasRecentlyVerified()) {
              console.log("Recently verified, allowing access despite HTTP error");
              if (isMounted) {
                setHasAccess(true);
                setIsVerifying(false);
              }
            } else if (isMounted) {
              router.push("/payment/success");
            }
            return;
          }

          const data = await response.json();
          console.log("Access check response:", data);

          if (!data.ok || !data.paid) {
            console.log("Payment not verified:", data.error || "No payment");
            if (wasRecentlyVerified()) {
              console.log(
                "Recently verified, allowing access despite payment check",
              );
              if (isMounted) {
                setHasAccess(true);
                setIsVerifying(false);
              }
            } else if (isMounted) {
              router.push("/payment/success");
            }
            return;
          }

          console.log("Payment verified, allowing access");
          if (isMounted) {
            setHasAccess(true);
            setIsVerifying(false);
          }
        } catch (error) {
          console.error("Error verifying access:", error);
          if (wasRecentlyVerified()) {
            console.log("Recently verified, allowing access despite error");
            if (isMounted) {
              setHasAccess(true);
              setIsVerifying(false);
            }
          } else if (isMounted) {
            router.push("/payment/success");
          }
        }
      };

      performVerification();

      return () => {
        isMounted = false;
      };
    }
  }, [router]);

  if (!ENABLE_PAYMENT_VERIFICATION) {
    return <>{children}</>;
  }

  // Show loader while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1B1856] mb-4" />
          <p className="text-neutral-600">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // If no access (should have redirected already)
  if (!hasAccess) {
    return null;
  }

  // User has access - render children
  return <>{children}</>;
}

export default OnboardingProtectedLayout;
