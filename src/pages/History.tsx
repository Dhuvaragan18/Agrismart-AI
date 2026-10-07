import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { History as HistoryIcon, Trash2, ChevronRight, Calendar, Bug, AlertCircle, Info, ShieldCheck, Leaf, FlaskConical, CheckCircle2, X } from "lucide-react";
import { DiseaseResult, Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { cn } from "../lib/utils";

export default function History({ language }: { language: Language }) {
  const [history, setHistory] = useState<DiseaseResult[]>([]);
  const [selected, setSelected] = useState<DiseaseResult | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const saved = localStorage.getItem("agri_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("agri_history");
    setHistory([]);
  };

  const deleteItem = (timestamp: number) => {
    const updated = history.filter(h => h.timestamp !== timestamp);
    localStorage.setItem("agri_history", JSON.stringify(updated));
    setHistory(updated);
    if (selected?.timestamp === timestamp) setSelected(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-200";
      case "High": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#5A5A40] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#5A5A40]/20">
            <HistoryIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#5A5A40] leading-none">{t.history}</h1>
            <p className="text-xs text-[#1A1A1A]/40 mt-1 font-medium uppercase tracking-widest">Your Scan Records</p>
          </div>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center p-12 space-y-6 bg-white rounded-[2.5rem] border border-[#5A5A40]/10">
          <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40">
            <HistoryIcon size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1A1A1A]/60">{t.noHistory}</h3>
            <p className="text-sm text-[#1A1A1A]/40 max-w-xs mx-auto">
              Your crop disease scan results will appear here for future reference.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
            {history.map((item) => (
              <motion.div
                key={item.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelected(item)}
                className={cn(
                  "p-4 rounded-[2rem] border cursor-pointer transition-all flex gap-4 group",
                  selected?.timestamp === item.timestamp 
                    ? "bg-[#5A5A40] border-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" 
                    : "bg-white border-[#5A5A40]/10 hover:border-[#5A5A40]/30 text-[#1A1A1A]"
                )}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                  <img src={item.imageUrl} alt={item.diseaseName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold truncate text-sm">{item.diseaseName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={12} className="opacity-40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.timestamp);
                  }}
                  className={cn(
                    "p-2 rounded-xl transition-colors self-center",
                    selected?.timestamp === item.timestamp ? "text-white/40 hover:text-white" : "text-[#1A1A1A]/20 hover:text-red-500"
                  )}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10"
                >
                  <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40 mb-6">
                    <Info size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A]/60">Select a Record</h3>
                  <p className="text-sm text-[#1A1A1A]/40 mt-2 max-w-xs mx-auto">
                    Click on a scan from the list to view detailed analysis and treatment recommendations.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key={selected.timestamp}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-48 aspect-square rounded-[2rem] overflow-hidden border border-[#5A5A40]/10 shrink-0">
                        <img src={selected.imageUrl} alt={selected.diseaseName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">{t.diseaseName}</p>
                            <h2 className="text-3xl font-bold text-[#1A1A1A]">{selected.diseaseName}</h2>
                          </div>
                          <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold border", getSeverityColor(selected.severity))}>
                            {selected.severity} Severity
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-[#5A5A40]/5 rounded-2xl">
                          <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-bold text-[#5A5A40]/60 uppercase tracking-widest">{t.confidence}</p>
                            <div className="h-2 bg-[#5A5A40]/10 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${selected.confidence * 100}%` }}
                                className="h-full bg-[#5A5A40]"
                              />
                            </div>
                          </div>
                          <span className="font-bold text-[#5A5A40] text-lg">{Math.round(selected.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#5A5A40]/10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#5A5A40]">
                          <AlertCircle size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.symptoms}</span>
                        </div>
                        <ul className="space-y-2">
                          {selected.symptoms.map((s, i) => (
                            <li key={i} className="text-sm text-[#1A1A1A]/60 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#5A5A40]/40 rounded-full mt-1.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#5A5A40]">
                          <Info size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.causes}</span>
                        </div>
                        <ul className="space-y-2">
                          {selected.causes.map((c, i) => (
                            <li key={i} className="text-sm text-[#1A1A1A]/60 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#5A5A40]/40 rounded-full mt-1.5 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Card */}
                  <div className="bg-[#5A5A40] text-white p-8 rounded-[2.5rem] space-y-6 shadow-xl shadow-[#5A5A40]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-xl font-bold">{t.treatment}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <Leaf size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.organic}</span>
                        </div>
                        <ul className="space-y-2">
                          {selected.treatment.organic.map((o, i) => (
                            <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <FlaskConical size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.chemical}</span>
                        </div>
                        <ul className="space-y-2">
                          {selected.treatment.chemical.map((c, i) => (
                            <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
