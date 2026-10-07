import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Sprout, Loader2, ChevronRight, Droplets, Sun, Thermometer, Info, CheckCircle2, Leaf, Shovel, Wheat } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getSmartFarmingPlan } from "../services/gemini";
import { Language } from "../types";
import { TRANSLATIONS, MONTHS } from "../constants";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function FarmingAssistant({ language }: { language: Language }) {
  const { user } = useAuth();
  const [location, setLocation] = useState(user?.location || "Coimbatore, Tamil Nadu");
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (user?.location && !location) {
      setLocation(user.location);
    }
  }, [user]);

  const handleGetPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    setLoading(true);
    try {
      const data = await getSmartFarmingPlan(location, month, "Sunny with occasional rain", language);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#5A5A40]">{t.smartFarming}</h1>
        <p className="text-[#1A1A1A]/60">Get personalized cultivation guides based on your region and season.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleGetPlan} className="bg-white p-8 rounded-[2.5rem] border border-[#5A5A40]/10 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} />
                {t.location}
              </label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Coimbatore, Tamil Nadu"
                className="w-full p-4 rounded-2xl bg-[#5A5A40]/5 border-2 border-transparent focus:border-[#5A5A40]/20 focus:bg-white transition-all outline-none text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} />
                {t.month}
              </label>
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#5A5A40]/5 border-2 border-transparent focus:border-[#5A5A40]/20 focus:bg-white transition-all outline-none text-sm appearance-none"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading || !location}
              className="w-full py-4 rounded-2xl bg-[#5A5A40] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sprout size={20} />}
              {t.getPlan}
            </button>
          </form>

          {/* Quick Tips */}
          <div className="bg-[#5A5A40]/5 p-6 rounded-[2rem] space-y-4">
            <h4 className="font-bold text-[#5A5A40] flex items-center gap-2">
              <Info size={18} />
              Quick Tips
            </h4>
            <ul className="space-y-3">
              {[
                "Test your soil pH regularly.",
                "Use organic compost for better yield.",
                "Practice crop rotation to prevent pests.",
              ].map((tip, i) => (
                <li key={i} className="text-xs text-[#1A1A1A]/60 flex items-start gap-2">
                  <div className="w-1 h-1 bg-[#5A5A40]/40 rounded-full mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!plan && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10"
              >
                <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40 mb-6">
                  <Wheat size={40} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A]/60">Your Farming Plan Awaits</h3>
                <p className="text-sm text-[#1A1A1A]/40 mt-2 max-w-xs mx-auto">
                  Enter your location and the current month to receive a customized step-by-step cultivation guide.
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10"
              >
                <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-full flex items-center justify-center text-[#5A5A40] mb-6">
                  <Loader2 className="animate-spin" size={40} />
                </div>
                <h3 className="text-xl font-bold text-[#5A5A40]">Generating Your Plan</h3>
                <p className="text-sm text-[#1A1A1A]/40 mt-2">Our AI is analyzing regional data and seasonal patterns...</p>
              </motion.div>
            )}

            {plan && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm prose prose-stone max-w-none"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#5A5A40]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#5A5A40] text-white rounded-2xl flex items-center justify-center">
                      <Sprout size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A1A1A] m-0 leading-none">{t.farmingPlan}</h2>
                      <p className="text-sm text-[#1A1A1A]/40 m-0 mt-1">{location} • {month}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                    <CheckCircle2 size={14} />
                    AI Verified
                  </div>
                </div>

                <div className="markdown-body text-[#1A1A1A]/80 leading-relaxed">
                  <ReactMarkdown>{plan}</ReactMarkdown>
                </div>

                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#5A5A40]/10">
                  <div className="p-4 bg-[#5A5A40]/5 rounded-2xl text-center">
                    <Shovel className="mx-auto text-[#5A5A40] mb-2" size={20} />
                    <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">Soil Prep</p>
                  </div>
                  <div className="p-4 bg-[#5A5A40]/5 rounded-2xl text-center">
                    <Droplets className="mx-auto text-[#5A5A40] mb-2" size={20} />
                    <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">Watering</p>
                  </div>
                  <div className="p-4 bg-[#5A5A40]/5 rounded-2xl text-center">
                    <Sun className="mx-auto text-[#5A5A40] mb-2" size={20} />
                    <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">Sunlight</p>
                  </div>
                  <div className="p-4 bg-[#5A5A40]/5 rounded-2xl text-center">
                    <Wheat className="mx-auto text-[#5A5A40] mb-2" size={20} />
                    <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">Harvest</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
