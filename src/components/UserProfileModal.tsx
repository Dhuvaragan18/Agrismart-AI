import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  X, 
  User as UserIcon, 
  MapPin, 
  Wheat, 
  LogOut, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  ShieldCheck, 
  Sprout, 
  Bug, 
  ExternalLink 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Language, DiseaseResult } from "../types";
import { TRANSLATIONS } from "../constants";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  language: Language;
}

export default function UserProfileModal({ isOpen, onClose, onOpenAuth, language }: UserProfileModalProps) {
  const { user, logout, loginDemo } = useAuth();
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ totalScans: 0, highSeverity: 0 });

  // Get current app URL (window.location.origin or fallback to shared URL)
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://ais-pre-v7o6k62phez72vcginp36o-765541936451.asia-southeast1.run.app";

  useEffect(() => {
    if (isOpen) {
      try {
        const history: DiseaseResult[] = JSON.parse(localStorage.getItem("agri_history") || "[]");
        const high = history.filter((h) => h.severity === "High").length;
        setStats({ totalScans: history.length, highSeverity: high });
      } catch {
        setStats({ totalScans: 0, highSeverity: 0 });
      }
    }
  }, [isOpen]);

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#5A5A40]/10 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#5A5A40]/5 transition-colors"
        >
          <X size={20} />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#5A5A40]/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#1A1A1A] leading-tight">{user.name}</h2>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> Active
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60 mt-0.5">{user.email || user.phone}</p>
            <p className="text-xs text-[#5A5A40] font-semibold flex items-center gap-1 mt-1">
              <MapPin size={12} /> {user.location} {user.farmSize ? `• ${user.farmSize}` : ""}
            </p>
          </div>
        </div>

        {/* Crops badges */}
        <div className="mb-6 bg-[#5A5A40]/5 p-4 rounded-2xl">
          <p className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Wheat size={14} /> {t.primaryCrops}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.crops && user.crops.length > 0 ? (
              user.crops.map((crop) => (
                <span
                  key={crop}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#5A5A40]/15 text-xs font-medium text-[#1A1A1A]"
                >
                  {crop}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#1A1A1A]/50">No crops specified</span>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#5A5A40]/5 border border-[#5A5A40]/10 text-center">
            <Bug className="mx-auto text-[#5A5A40] mb-1" size={20} />
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalScans}</p>
            <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">Leaves Scanned</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#5A5A40]/5 border border-[#5A5A40]/10 text-center">
            <Sprout className="mx-auto text-amber-600 mb-1" size={20} />
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.highSeverity}</p>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Critical Alerts</p>
          </div>
        </div>

        {/* App Link Section (Answers "How to get the link of the app") */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Share2 size={14} /> App Live Web Link
            </span>
            <button
              onClick={copyLink}
              className="text-xs font-bold text-[#5A5A40] hover:text-[#4A4A30] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 transition-colors"
            >
              {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <p className="text-[11px] text-amber-800/80 break-all font-mono select-all bg-white/70 p-2 rounded-xl border border-amber-100">
            {appUrl}
          </p>
          <p className="text-[10px] text-amber-800/60">
            Share this link to open the app on your smartphone or test real-time camera leaf scanning in the farm!
          </p>
        </div>

        {/* Switch / Logout actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#5A5A40]/10">
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="text-xs font-bold text-[#5A5A40] hover:underline"
          >
            Switch Profile
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
          >
            <LogOut size={14} /> {t.logout}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
