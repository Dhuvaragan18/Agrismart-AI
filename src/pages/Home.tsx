import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Bug, 
  Sprout, 
  CloudSun, 
  MessageSquare, 
  ChevronRight, 
  AlertTriangle, 
  Camera, 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  Wheat, 
  ShieldCheck 
} from "lucide-react";
import { TRANSLATIONS } from "../constants";
import { Language } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Home({ language }: { language: Language }) {
  const t = TRANSLATIONS[language];
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://ais-pre-v7o6k62phez72vcginp36o-765541936451.asia-southeast1.run.app";

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      title: t.detectDisease,
      desc: "Live camera scan & deep learning model to detect crop diseases instantly.",
      icon: Bug,
      path: "/detect",
      color: "bg-red-50 text-red-600",
    },
    {
      title: t.smartFarming,
      desc: "Get personalized farming plans based on your location and seasonal calendar.",
      icon: Sprout,
      path: "/assistant",
      color: "bg-green-50 text-green-600",
    },
    {
      title: t.weather,
      desc: "Real-time weather updates, humidity risks, and precipitation alerts.",
      icon: CloudSun,
      path: "/weather",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t.chatbot,
      desc: "Ask our bilingual AI expert any farming, pest, or fertilizer question.",
      icon: MessageSquare,
      path: "/chat",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Farmer Greeting Banner if logged in */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#5A5A40]/15 rounded-[2rem] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center font-bold text-xl shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#1A1A1A]/50 font-semibold uppercase tracking-wider">
                  {t.welcomeBack},
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} /> Verified Farmer
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#1A1A1A]/60 mt-0.5">
                <span className="flex items-center gap-1 text-[#5A5A40] font-medium">
                  <MapPin size={12} /> {user.location}
                </span>
                {user.crops && user.crops.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Wheat size={12} className="text-[#5A5A40]" /> {user.crops.slice(0, 2).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/detect"
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#5A5A40] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#4A4A30] transition-colors"
            >
              <Camera size={14} /> Scan Plant
            </Link>
            <button
              onClick={copyLink}
              title="Share app link"
              className="py-2.5 px-3 rounded-xl border border-[#5A5A40]/20 hover:bg-[#5A5A40]/5 text-[#5A5A40] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
              {copied ? "Link Copied" : "Share"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="text-center space-y-6 py-6 sm:py-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-[#5A5A40] leading-tight"
        >
          {t.tagline}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto"
        >
          Empowering farmers and beginners with real-time camera disease detection, seasonal farming plans, and agro-meteorological advisory.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3.5 pt-2"
        >
          <Link 
            to="/detect" 
            className="bg-[#5A5A40] text-white px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
          >
            <Camera size={18} />
            {t.openCamera} & {t.detectDisease}
          </Link>
          <Link 
            to="/assistant" 
            className="bg-white text-[#5A5A40] border-2 border-[#5A5A40]/20 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 hover:bg-[#5A5A40]/5 transition-all"
          >
            <Sprout size={18} />
            {t.smartFarming}
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.path}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              to={feature.path}
              className="group block h-full bg-white p-7 rounded-[2rem] border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">{feature.title}</h3>
              <p className="text-[#1A1A1A]/60 text-xs sm:text-sm leading-relaxed mb-5">
                {feature.desc}
              </p>
              <div className="flex items-center text-[#5A5A40] font-bold text-xs sm:text-sm">
                Explore <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Weather Alert & Live App Share Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-amber-50 border border-amber-200/80 rounded-[2rem] p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle size={28} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-amber-900">Weather Alert: High Humidity & Spore Germination Risk</h4>
            <p className="text-amber-800/80 text-xs sm:text-sm mt-0.5">
              Current humidity levels exceed 65% in coastal & river delta belts. Inspect tomato, paddy, and chilli leaves with camera for early signs of fungal spotting.
            </p>
          </div>
          <Link 
            to="/weather" 
            className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-700 transition-colors shrink-0"
          >
            Check Weather
          </Link>
        </section>

        {/* Quick App Link Box */}
        <section className="bg-white border border-[#5A5A40]/15 rounded-[2rem] p-6 flex flex-col justify-between gap-3 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <Share2 size={13} /> {t.appLinks}
              </span>
              <span className="text-[10px] text-green-700 bg-green-100 font-bold px-2 py-0.5 rounded-full">Online</span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60">
              Open directly on mobile for field camera usage:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 text-xs bg-[#5A5A40]/5 border border-[#5A5A40]/10 rounded-xl px-3 py-2 text-[#1A1A1A]/70 font-mono truncate"
            />
            <button
              onClick={copyLink}
              className="py-2 px-3 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
