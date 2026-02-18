"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "./onboarding/hooks/useOnboardingStore";

type Slide = {
  id: string;
  imageSrc: string; // local from /public
  headline: string;
  subline: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ANIM_MS = 520;
const PROCESSING_MS = 1200;

function enterAnim(dir: "next" | "prev") {
  return dir === "next"
    ? "animate-in fade-in slide-in-from-right-6 duration-500"
    : "animate-in fade-in slide-in-from-left-6 duration-500";
}

function exitAnim(dir: "next" | "prev") {
  return dir === "next"
    ? "animate-out fade-out slide-out-to-left-6 duration-500"
    : "animate-out fade-out slide-out-to-right-6 duration-500";
}

export default function EnterpriseLoginExactLikeMock() {
  const router = useRouter();
  const slides: Slide[] = React.useMemo(
    () => [
      {
        id: "s1",
        imageSrc: "/login/img1.jpg",
        headline:
          "Wealth planning is helping you make confident decisions; turning goals into a clear, trackable plan.",
        subline:
          "Track progress, reduce uncertainty, and stay aligned with what matters most.",
      },
      {
        id: "s2",
        imageSrc: "/login/img2.jpg",
        headline:
          "Your money is becoming easier to understand; cashflow, goals, and priorities are staying in one place.",
        subline:
          "Spot gaps early and stay on track without constantly re-doing spreadsheets.",
      },
      {
        id: "s3",
        imageSrc: "/login/img3.jpg",
        headline:
          "Planning is becoming proactive; so you’re not reacting late, you’re adjusting early.",
        subline:
          "Build a plan you can review monthly and refine as life changes.",
      },
    ],
    [],
  );

  const [active, setActive] = React.useState(0); // source of truth (which slide we want)
  const [renderIndex, setRenderIndex] = React.useState(0); // what is currently rendered
  const [dir, setDir] = React.useState<"next" | "prev">("next");
  const [phase, setPhase] = React.useState<"idle" | "exiting" | "entering">(
    "idle",
  );

  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const timerRef = React.useRef<number | null>(null);
  const gateRef = React.useRef(false);
  const submitTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
      if (submitTimerRef.current != null)
        window.clearTimeout(submitTimerRef.current);
    };
  }, []);

  const go = React.useCallback(
    (nextIndex: number, nextDir: "next" | "prev") => {
      if (slides.length <= 1) return;
      if (gateRef.current) return;
      if (nextIndex === active) return;

      gateRef.current = true;
      setDir(nextDir);
      setActive(nextIndex);
      setPhase("exiting");

      if (timerRef.current != null) window.clearTimeout(timerRef.current);

      // after exit animation: swap the rendered slide + start enter animation
      timerRef.current = window.setTimeout(() => {
        setRenderIndex(nextIndex);
        setPhase("entering");

        // after enter animation: unlock
        timerRef.current = window.setTimeout(() => {
          setPhase("idle");
          gateRef.current = false;
        }, 60);
      }, ANIM_MS);
    },
    [slides.length, active],
  );

  const prev = React.useCallback(() => {
    const nextIndex = (active - 1 + slides.length) % slides.length;
    go(nextIndex, "prev");
  }, [active, slides.length, go]);

  const next = React.useCallback(() => {
    const nextIndex = (active + 1) % slides.length;
    go(nextIndex, "next");
  }, [active, slides.length, go]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      const nextIndex = (active + 1) % slides.length;
      go(nextIndex, "next");
    }, 8000);

    return () => window.clearInterval(id);
  }, [active, slides.length, go]);

  const { updateData } = useOnboardingStore();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      console.log("Enterprise email:", email);
      updateData({ email: email.trim() });
      await new Promise<void>((resolve) => {
        submitTimerRef.current = window.setTimeout(
          () => resolve(),
          PROCESSING_MS,
        );
      });
      router.push("/onbaording");
    } finally {
      setIsSubmitting(false);
    }
  }

  const slide = slides[renderIndex];

  const isBusy = phase === "exiting"; // prevent double clicks during exit
  const animClass =
    phase === "exiting"
      ? exitAnim(dir)
      : phase === "entering"
        ? enterAnim(dir)
        : enterAnim(dir);

  return (
    <div className="min-h-screen flex justify-center items-center bg-muted/40 px-4 py-5 md:px-7 md:py-8">
      <div className="mx-auto w-full max-w-6xl rounded-[28px] bg-background shadow-sm ring-1 ring-border">
        {/* height tuned to look like your reference, not overly tall */}
        <div className="grid h-[760px] grid-cols-1 gap-0 md:grid-cols-2">
          {/* LEFT */}
          <section className="relative m-4 overflow-hidden rounded-[22px] bg-black md:m-5 hidden md:block">
            {/* ONE animated layer for image + text => always in sync */}
            <div
              className={cn("absolute inset-0", animClass)}
              key={`${slide.id}-${renderIndex}-${phase}-${dir}`}
            >
              <Image
                src={slide.imageSrc}
                alt="Celerey visual"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute inset-x-6 bottom-20 z-10 text-white">
                <p className="max-w-xl text-3xl font-semibold leading-tight md:text-[40px] md:leading-[1.05]">
                  “{slide.headline}”
                </p>
                <p className="mt-4 max-w-xl text-sm text-white/85 md:text-base">
                  {slide.subline}
                </p>
              </div>
            </div>

            {/* controls */}
            <div className="absolute inset-x-6 bottom-6 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={isBusy}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/15",
                    isBusy && "opacity-60 cursor-not-allowed",
                  )}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={isBusy}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/15",
                    isBusy && "opacity-60 cursor-not-allowed",
                  )}
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>

              <Link href="/" className="text-sm text-white/90 hover:text-white">
                Learn more →
              </Link>
            </div>
          </section>

          {/* RIGHT */}
          <section className="relative flex items-start justify-center px-6 pb-6 pt-8 md:px-10 md:pb-10 md:pt-10">
            <div className="w-full max-w-md flex flex-col justify-between h-full">
              {/* top logo */}
              <div className="mb-10 flex items-center justify-start gap-2 md:mb-12">
                <Image
                  src="/Celerey_Logo_dark.png"
                  alt="Celerey logo"
                  width={100}
                  height={100}
                  priority
                />
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Enterprise login
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in with your company email to access your Celerey
                  dashboard.
                </p>

                <form onSubmit={onSubmit} className="mt-5 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">Company email</Label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your company email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || email.trim().length === 0}
                    className="h-11 w-full rounded-full"
                  >
                    {isSubmitting ? "Continuing…" : "Continue"}
                  </Button>
                </form>
              </div>

              <div className="mt-6 text-xs text-muted-foreground">
                <Link
                  href="/support"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  Need help?
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
