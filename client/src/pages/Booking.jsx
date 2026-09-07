import { useEffect, useState } from "react";
import axios from "axios";
import {Rocket,TrendingUp,Crown,User,Mail,Phone,ArrowRight,ArrowLeft,Check,Copy,CheckCircle2,CreditCard,Zap,ShieldCheck,Headphones,Lock,RotateCcw,Calendar,CircleDollarSign,} from "lucide-react";

const PLAN_ICON_MAP = {
  starter: Rocket,
  growth: TrendingUp,
  elite: Crown,
};

const normalizePlan = (plan) => {
  const id = plan?.id || plan?.name || "custom";
  const name = String(plan?.name || "Custom Plan");
  const monthlyValue = Number(plan?.monthly ?? plan?.price ?? 0);
  const yearlyValue = Number(plan?.yearly ?? monthlyValue * 12 * 0.83);
  const icon = PLAN_ICON_MAP[id] || PLAN_ICON_MAP[String(name).toLowerCase()] || Rocket;

  return {
    ...plan,
    id,
    name,
    tagline: plan?.tagline || "Flexible plan",
    monthly: monthlyValue,
    yearly: yearlyValue,
    icon,
    iconBg: plan?.iconBg || "bg-violet-100",
    iconColor: plan?.iconColor || "text-violet-600",
    features: Array.isArray(plan?.features) ? plan.features : [],
  };
};

const STEP_LABELS = ["Choose Plan", "Your Details", "Review & Submit"];

function yearlyPrice(monthly) {
  return Math.round(monthly * 12 * 0.83);
}



function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [bookingDate, setBookingDate] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("https://easybrand.onrender.com/api/page-data/plans");
        const savedPlans = Array.isArray(response.data?.plans) ? response.data.plans : [];
        const normalized = savedPlans.map(normalizePlan);
        setPlans(normalized);
        if (normalized.length > 0 && !planId) {
          setPlanId(normalized[0].id);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const plan = plans.find((p) => p.id === planId) || plans[0] || null;
  const price = plan ? (billing === "monthly" ? Number(plan.monthly || 0) : Number(plan.yearly || yearlyPrice(plan.monthly || 0))) : 0;

  const canContinueDetails = form.fullName.trim() !== "" && form.email.trim() !== "";

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://easybrand.onrender.com/api/booking", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        plan: plan?.name || planId,
        billing: billing,
        price: price,
      });

      if (response.data.success) {
        setBookingDate(todayLabel());
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting booking");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep(1);
    setBilling("monthly");
    if (plans.length > 0) {
      setPlanId(plans[0].id);
    }
    setForm({ fullName: "", email: "", phone: "" });
    setError("");
    setCopied(false);
  }


  return (
    <div className="min-h-screen w-full  font-sans text-slate-900" id="pricing">
      <div className="mx-auto max-w-6xl px-4 py-10">


{/*------------------ header -------------------- */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">

            <h1 className="text-xl font-bold tracking-tight text-slate-900">Choose Your Plan</h1>

          </div>
 
          <div className="flex flex-wrap gap-2">
            <Badge icon={CreditCard} color="text-violet-600" label="Simple" />
            <Badge icon={Zap} color="text-rose-500" label="Fast" />
            <Badge icon={ShieldCheck} color="text-emerald-600" label="Secure" />
          </div>
        </div>




        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-center gap-0 rounded-2xl border border-slate-200/70 bg-white px-6 py-5 shadow-sm">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1;
            const state = num < step ? "done" : num === step ? "active" : "upcoming";
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors " +
                      (state === "done"
                        ? "bg-teal-600 text-white"
                        : state === "active"
                        ? "bg-[teal] text-white"
                        : "bg-slate-100 text-slate-400")
                    }
                  >
                    {state === "done" ? <Check size={16} strokeWidth={3} /> : num}
                  </div>
                  <span
                    className={
                      "text-xs font-medium " +
                      (state === "upcoming" ? "text-slate-400" : "text-slate-700")
                    }
                  >
                    {label}
                  </span>
                </div>
                {num !== 3 && (
                  <div
                    className={
                      "mx-2 mb-5 h-0.5 flex-1 rounded " +
                      (num < step ? "bg-[teal]" : "bg-slate-200")
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
          {step === 1 && !plansLoading && (
            <StepChoosePlan
              billing={billing}
              setBilling={setBilling}
              planId={planId}
              setPlanId={setPlanId}
              plans={plans}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 1 && plansLoading && (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
            </div>
          )}

          {step === 2 && (
            <StepDetails
              form={form}
              setForm={setForm}
              plan={plan}
              billing={billing}
              price={price}
              canContinue={canContinueDetails}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          )}

          {step === 3 && (
            <StepConfirmation
              plan={plan}
              billing={billing}
              price={price}
              date={bookingDate}
              copied={copied}
              onReset={handleReset}
            />
          )}
        </div>


      </div>
    </div>
  );
}

function Badge({ icon: Icon, color, label }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ">
      <Icon size={14} className={color} />
      {label}
    </span>
  );
}

function Feature({ icon: Icon, iconBg, iconColor, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function StepChoosePlan({ billing, setBilling, planId, setPlanId, plans, onContinue }) {
  const visiblePlans = plans.slice(0, 3);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1" />
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
              (billing === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
              (billing === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")
            }
          >
            Yearly
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {visiblePlans.map((p, index) => {
          const selected = p.id === planId;
          const displayPrice = billing === "monthly" ? Number(p.monthly || 0) : Number(p.yearly || yearlyPrice(p.monthly || 0));
          const isPopular = index === 0;
          const planName = String(p.name || "Plan").replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <div
              key={p.id}
              className={
                "w-full max-w-[300px] rounded-[24px] border p-5 text-left shadow-sm transition-all " +
                (selected
                  ? "border-slate-900 bg-[#e0f2fe] "
                  : isPopular
                  ? "border-slate-200 bg-[#f5f5f4]"
                  : "border-slate-200 bg-[#f5f5f4]")
              }
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="text-2xl font-bold text-slate-900">{planName}</div>
                {isPopular && (
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="mb-3 flex items-end gap-1">
                <span className="text-5xl font-black tracking-tight text-slate-900">${displayPrice}</span>
                <span className="mb-2 text-sm text-slate-500">/mo</span>
                <span className="mb-2 ml-2 text-xs text-slate-500">{billing === "monthly" ? "billed monthly" : "billed yearly"}</span>
              </div>

              <p className="mb-5 text-base text-slate-600">{p.tagline || "Flexible support for growing teams."}</p>

              <button
                type="button"
                onClick={() => setPlanId(p.id)}
                className={
                  "mb-6 flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors " +
                  (selected
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                }
              >
                {selected ? "Selected" : isPopular ? "Start 30-day trial" : "Choose plan"}
              </button>

              <ul className="space-y-3 text-sm text-slate-600">
                {p.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function StepDetails({ form, setForm, plan, billing, price, canContinue, onBack, onSubmit, loading, error }) {
  const Icon = plan.icon;
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
        disabled={loading}
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <h2 className="text-2xl font-bold text-slate-900">Your details</h2>
      <p className="mt-1.5 text-sm text-slate-500">
        Please provide your information so we can confirm your booking.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <Field
          icon={User}
          label="Full name"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(v) => setForm({ ...form, fullName: v })}
          disabled={loading}
        />
        <Field
          icon={Mail}
          label="Email address"
          placeholder="Enter your email address"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          disabled={loading}
        />
        <Field
          icon={Phone}
          label="Phone number (optional)"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          disabled={loading}
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Your selection</p>
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${plan.iconBg}`}>
            <Icon size={20} className={plan.iconColor} />
          </div>
          <div className="flex flex-1 items-baseline justify-between">
            <div>
              <p className="font-semibold text-slate-900">{plan.name} Plan</p>
              <p className="text-sm text-slate-500">{plan.tagline}</p>
            </div>
            <p className="text-right">
              <span className="text-lg font-bold text-slate-900">${price}</span>
              <span className="text-xs text-slate-500">/{billing === "monthly" ? "month" : "year"}</span>
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
          <span className="text-slate-500">Billing</span>
          <span className="font-medium text-slate-700">
            {billing === "monthly" ? "Monthly" : "Yearly"}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!canContinue || loading}
        className={
          "mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-colors " +
          (canContinue && !loading ? "bg-[#008080d6] hover:bg-[#008080]" : "cursor-not-allowed bg-[#1e7a7192]")
        }
      >
        {loading ? "Submitting..." : "Review & Submit"}
        {!loading && <ArrowRight size={18} />}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Lock size={12} />
        We respect your privacy and keep your data safe.
      </p>
    </div>
  );
}

function Field({ icon: Icon, label, placeholder, value, onChange, type = "text", disabled = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500">
        <Icon size={16} className="shrink-0 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
    </div>
  );
}

function StepConfirmation({  plan, billing, price, date, copied, onCopy, onReset }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <Dot className="left-0 top-1 bg-emerald-300" />
        <Dot className="right-1 top-4 bg-amber-300" />
        <Dot className="left-3 bottom-2 bg-violet-300" />
        <Dot className="right-0 bottom-6 bg-rose-300" />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={2} />
        </div>
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">Booking submitted!</h2>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Thank you for choosing Happy Zimba. We've received your booking request and our team will contact you shortly.
      </p>



      <div className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-left">
        <p className="mb-3 text-sm font-semibold text-slate-700">Booking summary</p>
        <SummaryRow icon={Rocket} label="Plan" value={plan.name} />
        <SummaryRow icon={Mail} label="Billing" value={billing === "monthly" ? "Monthly" : "Yearly"} />
        <SummaryRow icon={CircleDollarSign} label="Amount" value={`$${price}`} />
        <SummaryRow icon={Calendar} label="Date" value={date} last />
      </div>

      <button
        onClick={onReset}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
      >
        <RotateCcw size={16} />
        Back to Home
      </button>
    </div>
  );
}

function Dot({ className }) {
  return <span className={`absolute h-2 w-2 rounded-full ${className}`} />;
}

function SummaryRow({ icon: Icon, label, value, last }) {
  return (
    <div className={"flex items-center justify-between py-2 " + (last ? "" : "border-b border-slate-100")}>
      <span className="flex items-center gap-2 text-sm text-slate-500">
        <Icon size={14} />
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}
