"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { useRouter } from "next/navigation";
import { authClient, callbackURL, type RoleIntent } from "@/lib/auth-client";
import { getAuthProviders, type SocialProvider } from "@/lib/api";

const ROLES: { value: RoleIntent; label: string; sub: string }[] = [
  { value: "CLIENT", label: "Pay my team", sub: "I run payroll" },
  { value: "CONTRACTOR", label: "Get paid", sub: "I'm a contractor" },
];

const SOCIAL: Record<SocialProvider, { label: string; icon: React.ReactNode }> = {
  google: {
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8H1.3v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z" />
      </svg>
    ),
  },
};

const inputClass =
  "h-14 w-full rounded-none border border-line bg-canvas px-4 text-[16px] text-ink placeholder:text-faint focus:border-ink focus:outline-none";
const primaryClass =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-mint text-[17px] font-medium text-ink-deep transition-[opacity,transform] duration-150 enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleIntent>("CLIENT");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [social, setSocial] = useState<SocialProvider[]>([]);
  const [socialBusy, setSocialBusy] = useState<SocialProvider | null>(null);

  // Only offer the social buttons the backend actually has credentials for.
  useEffect(() => {
    let cancelled = false;
    getAuthProviders()
      .then((p) => !cancelled && setSocial(p.social))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWith = async (provider: SocialProvider) => {
    setSocialBusy(provider);
    setMessage(null);
    const { error } = await authClient.signIn.social({ provider, callbackURL: callbackURL(role) });
    if (error) {
      setSocialBusy(null);
      setStatus("error");
      setMessage(error.message ?? "We couldn't start that sign-in. Please try again.");
    }
  };

  // The link usually opens in a new tab. Poll for the session here so this tab
  // follows along instead of sitting on "Check your email" forever.
  useEffect(() => {
    if (status !== "sent") return;
    let stopped = false;
    const tick = async () => {
      const { data } = await authClient.getSession();
      if (!stopped && data?.session) router.replace(`/auth/callback?role=${role}`);
    };
    const id = window.setInterval(tick, 3000);
    const onFocus = () => void tick();
    window.addEventListener("focus", onFocus);
    return () => {
      stopped = true;
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [status, role, router]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === "sending") return;
    setStatus("sending");
    setMessage(null);
    const { error } = await authClient.signIn.magicLink({
      email: trimmed,
      callbackURL: callbackURL(role),
    });
    if (error) {
      setStatus("error");
      setMessage(error.message ?? "We couldn't send the link. Please try again.");
      return;
    }
    setStatus("sent");
  };

  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[72px] items-center justify-between border-b border-line px-5 md:px-8">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          <Wordmark />
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-ink">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-[520px]">
          {status === "sent" ? (
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep">
                <Mail size={24} strokeWidth={2.2} />
              </span>
              <h1 className="mt-7 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                Check your email.
              </h1>
              <p className="mt-5 text-[17px] leading-[1.5] text-muted">
                We sent a sign-in link to <b className="font-medium text-ink">{email.trim()}</b>. It works
                once and expires in 15 minutes. Open it anywhere; this tab will follow you in.
              </p>
              <p className="mt-4 text-[15px] leading-[1.5] text-muted">
                Nothing there? Check spam, or{" "}
                <button type="button" onClick={() => send()} className="font-medium text-ink underline underline-offset-4">
                  send it again
                </button>
                .
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-full border border-ink text-[17px] font-medium text-ink transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98]"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="max-w-[12ch] font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                Sign in to <em className="font-medium italic">Disburs.</em>
              </h1>
              <p className="mt-4 text-[16px] leading-[1.5] text-muted md:text-[17px]">
                No password. We&rsquo;ll email you a link that signs you in. New here? The same link
                creates your account.
              </p>

              <form onSubmit={send} className="mt-8 flex flex-col gap-6">
                <fieldset>
                  <legend className="mb-3 text-[15px] font-medium text-ink">I want to…</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {ROLES.map((r) => {
                      const on = role === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          aria-pressed={on}
                          className={`inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border px-5 text-[15px] font-medium transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98] ${
                            on ? "border-ink-deep bg-ink-deep text-white" : "border-line bg-canvas text-ink hover:border-ink"
                          }`}
                        >
                          {r.label}
                          <span className={`text-[13px] font-normal ${on ? "text-white/60" : "text-muted"}`}>{r.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="mb-3 block text-[15px] font-medium text-ink">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </label>

                {status === "error" && message && <p className="text-[14px] text-[#A32D1C]">{message}</p>}

                <button type="submit" disabled={!email.trim() || status === "sending"} className={primaryClass}>
                  {status === "sending" ? <Loader2 size={20} className="animate-spin" /> : "Email me a sign-in link"}
                </button>
              </form>

              {social.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-4 text-[13.5px] text-muted">
                    <span className="h-px flex-1 bg-line" />
                    or
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    {social.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => signInWith(p)}
                        disabled={socialBusy !== null}
                        className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-ink text-[17px] font-medium text-ink transition-[opacity,transform] duration-150 enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.98] disabled:opacity-50"
                      >
                        {socialBusy === p ? <Loader2 size={20} className="animate-spin" /> : SOCIAL[p].icon}
                        {SOCIAL[p].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-5 text-[13.5px] text-muted">
                By continuing you agree to our terms. Disburs is in private beta.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
