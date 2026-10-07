import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  History as HistoryIcon, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  Leaf, 
  FlaskConical, 
  CheckCircle2, 
  User as UserIcon,
  Filter
} from "lucide-react";
import { DiseaseResult, Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function History({ language }: { language: Language }) {
  const [history, setHistory] = useState<DiseaseResult[]>([]);
  const [selected, setSelected] = useState<DiseaseResult | null>(null);
  const [filterMineOnly, setFilterMineOnly] = useState(false);
  const { user } = useAuth();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("agri_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0 && !selected) {
          setSelected(parsed[0]);
        }
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("agri_history");
    setHistory([]);
    setSelected(null);
  };

  const deleteItem = (timestamp: number) => {
    const updated = history.filter(h => h.timestamp !== timestamp);
    localStorage.setItem("agri_history", JSON.stringify(updated));
    setHistory(updated);
    if (selected?.timestamp === timestamp) {
      setSelected(updated.length > 0 ? updated[0] : null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-200";
      case "High": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const displayedHistory = filterMineOnly && user
    ? history.filter(item => item.userId === user.id)
    : history;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#5A5A40] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#5A5A40]/20">
            <HistoryIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#5A5A40] leading-none">{t.history}</h1>
            <p className="text-xs text-[#1A1A1A]/40 mt-1 font-medium uppercase tracking-widest">
              {displayedHistory.length} Recorded Diagnoses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => setFilterMineOnly(!filterMineOnly)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border",
                filterMineOnly
                  ? "bg-[#5A5A40] text-white border-[#5A5A40]"
                  : "bg-white text-[#5A5A40] border-[#5A5A40]/20 hover:bg-[#5A5A40]/5"
              )}
            >
              <Filter size={14} />
              {filterMineOnly ? `My Farm Scans (${user.name.split(" ")[0]})` : "All Scans"}
            </button>
          )}

          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-xs"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {displayedHistory.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center p-12 space-y-5 bg-white rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm">
          <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40">
            <HistoryIcon size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1A1A1A]/70">{t.noHistory}</h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/40 max-w-xs mx-auto leading-relaxed">
              Use the camera or upload leaf images in Disease Detection to view saved pathology scans here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-3 max-h-[72vh] overflow-y-auto pr-1 scrollbar-hide">
            {displayedHistory.map((item) => (
              <motion.div
                key={item.timestamp}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelected(item)}
                className={cn(
                  "p-3.5 rounded-[1.75rem] border cursor-pointer transition-all flex gap-3.5 items-center group",
                  selected?.timestamp === item.timestamp 
                    ? "bg-[#5A5A40] border-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" 
                    : "bg-white border-[#5A5A40]/10 hover:border-[#5A5A40]/30 text-[#1A1A1A]"
                )}
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-black/5 bg-gray-100">
                  <img src={item.imageUrl} alt={item.diseaseName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-sm leading-tight">{item.diseaseName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={11} className="opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full inline-block",
                      selected?.timestamp === item.timestamp ? "bg-white/20 text-white" : getSeverityColor(item.severity)
                    )}>
                      {item.severity}
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
                    selected?.timestamp === item.timestamp ? "text-white/50 hover:text-white" : "text-[#1A1A1A]/30 hover:text-red-500"
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
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm"
                >
                  <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40 mb-4">
                    <Info size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]/60">Select a Record</h3>
                  <p className="text-xs text-[#1A1A1A]/40 mt-1 max-w-xs mx-auto">
                    Click any scan on the left to review disease pathology, severity, and treatments.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key={selected.timestamp}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="w-full sm:w-44 aspect-square rounded-[2rem] overflow-hidden border border-[#5A5A40]/10 shrink-0 bg-gray-50">
                        <img src={selected.imageUrl} alt={selected.diseaseName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">{t.diseaseName}</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-tight">{selected.diseaseName}</h2>
                          </div>
                          <div className={cn("px-3.5 py-1 rounded-full text-xs font-bold border shrink-0", getSeverityColor(selected.severity))}>
                            {selected.severity} Severity
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-3.5 bg-[#5A5A40]/5 rounded-2xl">
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#5A5A40]/60 uppercase tracking-widest">
                              <span>Match Confidence</span>
                              <span>{Math.round(selected.confidence * 100)}%</span>
                            </div>
                            <div className="h-2 bg-[#5A5A40]/10 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${selected.confidence * 100}%` }}
                                className="h-full bg-[#5A5A40]"
                              />
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[#1A1A1A]/40 flex items-center gap-1.5">
                          <Calendar size={13} />
                          Scanned on {new Date(selected.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#5A5A40]/10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-[#5A5A40]">
                          <AlertCircle size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.symptoms}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {selected.symptoms.map((s, i) => (
                            <li key={i} className="text-xs sm:text-sm text-[#1A1A1A]/70 flex items-start gap-2 leading-snug">
                              <div className="w-1.5 h-1.5 bg-[#5A5A40]/60 rounded-full mt-1.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-[#5A5A40]">
                          <Info size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.causes}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {selected.causes.map((c, i) => (
                            <li key={i} className="text-xs sm:text-sm text-[#1A1A1A]/70 flex items-start gap-2 leading-snug">
                              <div className="w-1.5 h-1.5 bg-[#5A5A40]/60 rounded-full mt-1.5 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Card */}
                  <div className="bg-[#5A5A40] text-white p-6 sm:p-8 rounded-[2.5rem] space-y-5 shadow-xl shadow-[#5A5A40]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={22} />
                      </div>
                      <h3 className="text-lg font-bold">{t.treatment}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-green-300">
                          <Leaf size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.organic}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {selected.treatment.organic.map((o, i) => (
                            <li key={i} className="text-xs sm:text-sm text-white/90 flex items-start gap-2 leading-relaxed">
                              <CheckCircle2 size={16} className="text-green-300 shrink-0 mt-0.5" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-blue-300">
                          <FlaskConical size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.chemical}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {selected.treatment.chemical.map((c, i) => (
                            <li key={i} className="text-xs sm:text-sm text-white/90 flex items-start gap-2 leading-relaxed">
                              <CheckCircle2 size={16} className="text-blue-300 shrink-0 mt-0.5" />
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
