import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User as UserIcon, Lock, MapPin, Wheat, Check, ArrowRight, ShieldCheck, Sparkles, Phone, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Language } from "../types";
import { TRANSLATIONS } from "../constants";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function AuthModal({ isOpen, onClose, language }: AuthModalProps) {
  const { login, register, loginDemo } = useAuth();
  const t = TRANSLATIONS[language];

  const [tab, setTab] = useState<"demo" | "login" | "register">("demo");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Coimbatore, Tamil Nadu");
  const [farmSize, setFarmSize] = useState("2.5 Acres");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Paddy", "Tomato"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableCrops = [
    "Paddy / Rice",
    "Tomato",
    "Cotton",
    "Sugarcane",
    "Chilli",
    "Banana",
    "Corn / Maize",
    "Turmeric",
    "Groundnut",
  ];

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleDemoSelect = (type: "farmer1" | "farmer2") => {
    loginDemo(type);
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(emailOrPhone, password);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim()) {
      setError("Please fill in your name and email or phone");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({
        name,
        email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@farmer.agri`,
        phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
        location,
        crops: selectedCrops,
        farmSize,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#5A5A40]/10 my-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#5A5A40]/5 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} />
            AgriSmart Portal
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            {tab === "register" ? t.signup : t.login}
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/60">
            {t.loginRequiredNotice}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#5A5A40]/5 rounded-2xl mb-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setTab("demo")}
            className={`py-2 px-3 rounded-xl transition-all ${
              tab === "demo"
                ? "bg-white text-[#5A5A40] shadow-sm font-bold"
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            ⚡ Quick Demo
          </button>
          <button
            onClick={() => setTab("login")}
            className={`py-2 px-3 rounded-xl transition-all ${
              tab === "login"
                ? "bg-white text-[#5A5A40] shadow-sm font-bold"
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            {t.login}
          </button>
          <button
            onClick={() => setTab("register")}
            className={`py-2 px-3 rounded-xl transition-all ${
              tab === "register"
                ? "bg-white text-[#5A5A40] shadow-sm font-bold"
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            {t.signup}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
            {error}
          </div>
        )}

        {/* Tab 1: 1-Click Demo Logins */}
        {tab === "demo" && (
          <div className="space-y-4">
            <p className="text-xs text-[#1A1A1A]/60 font-medium">
              Try the platform immediately with an active farmer profile:
            </p>

            {/* Farmer 1 */}
            <div
              onClick={() => handleDemoSelect("farmer1")}
              className="p-4 rounded-2xl border-2 border-[#5A5A40]/15 hover:border-[#5A5A40] bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors">
                    {t.demoAccount1}
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/60 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#5A5A40]" /> Thanjavur, TN • 3.5 Acres
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#5A5A40] group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Farmer 2 */}
            <div
              onClick={() => handleDemoSelect("farmer2")}
              className="p-4 rounded-2xl border-2 border-[#5A5A40]/15 hover:border-[#5A5A40] bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🌶️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors">
                    {t.demoAccount2}
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/60 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#5A5A40]" /> Coimbatore, TN • 2.0 Acres
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#5A5A40] group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setTab("login")}
                className="text-xs text-[#5A5A40] font-bold hover:underline"
              >
                Or enter custom credentials →
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Sign In */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} />
                {t.emailOrPhone}
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. 9840123456 or farmer@agri.com"
                required
                className="w-full p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-transparent focus:border-[#5A5A40]/30 focus:bg-white text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} />
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-transparent focus:border-[#5A5A40]/30 focus:bg-white text-sm outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5A5A40]/20 transition-all"
            >
              {loading ? "Authenticating..." : t.login}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab("demo")}
                className="text-xs text-[#1A1A1A]/60 hover:text-[#5A5A40] font-semibold"
              >
                Switch back to 1-Click Demo Login
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Register */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon size={12} />
                {t.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="w-full p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-transparent focus:border-[#5A5A40]/30 focus:bg-white text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} />
                {t.emailOrPhone}
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. 9876543210 or ramesh@mail.com"
                required
                className="w-full p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-transparent focus:border-[#5A5A40]/30 focus:bg-white text-sm outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} />
                  {t.location}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Madurai, TN"
                  className="w-full p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-transparent focus:border-[#5A5A40]/30 focus:bg-white text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                  Farm Size
                </label>
                <input
                  type="text"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder="e.g. 3 Acres"
                  className="w-full p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-transparent focus:border-[#5A5A40]/30 focus:bg-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Crop selection tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <Wheat size={12} />
                {t.primaryCrops}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableCrops.map((crop) => {
                  const isSelected = selectedCrops.includes(crop);
                  return (
                    <button
                      type="button"
                      key={crop}
                      onClick={() => toggleCrop(crop)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-[#5A5A40] text-white border-[#5A5A40] font-bold"
                          : "bg-white text-[#1A1A1A]/70 border-[#5A5A40]/20 hover:border-[#5A5A40]/40"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {crop}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-2xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5A5A40]/20 transition-all"
            >
              {loading ? "Registering..." : t.signup}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
