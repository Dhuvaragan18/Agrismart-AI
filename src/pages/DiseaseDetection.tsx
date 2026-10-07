import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Camera, Loader2, CheckCircle2, AlertCircle, Info, Leaf, Droplets, ShieldCheck, FlaskConical, History as HistoryIcon } from "lucide-react";
import { detectDisease } from "../services/gemini";
import { DiseaseResult, Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { cn } from "../lib/utils";

export default function DiseaseDetection({ language }: { language: Language }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const data = await detectDisease(image);
      setResult(data);
      
      // Save to history
      const history = JSON.parse(localStorage.getItem("agri_history") || "[]");
      localStorage.setItem("agri_history", JSON.stringify([{ ...data, imageUrl: image }, ...history].slice(0, 20)));
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#5A5A40]">{t.detectDisease}</h1>
        <p className="text-[#1A1A1A]/60">{t.uploadImage}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-square rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
              image ? "border-[#5A5A40]/40 bg-white" : "border-[#5A5A40]/20 bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10"
            )}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-[#5A5A40] shadow-sm">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="font-bold text-[#5A5A40]">{t.dragDrop}</p>
                  <p className="text-xs text-[#1A1A1A]/40 mt-1">Supports JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setImage(null)}
              disabled={!image || loading}
              className="flex-1 py-4 rounded-2xl border-2 border-[#5A5A40]/20 font-bold text-[#5A5A40] disabled:opacity-50 hover:bg-[#5A5A40]/5 transition-all"
            >
              Reset
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="flex-[2] py-4 rounded-2xl bg-[#5A5A40] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t.detecting}
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Analyze Now
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10"
              >
                <div className="w-16 h-16 bg-[#5A5A40]/5 rounded-full flex items-center justify-center text-[#5A5A40]/40 mb-4">
                  <Info size={32} />
                </div>
                <h3 className="font-bold text-[#1A1A1A]/60">No Analysis Yet</h3>
                <p className="text-sm text-[#1A1A1A]/40 mt-2">Upload an image and click analyze to see results here.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[#5A5A40]/10 border-t-[#5A5A40] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#5A5A40]">
                    <Leaf size={32} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="font-bold text-[#5A5A40] mt-8 text-xl">Analyzing Crop Health</h3>
                <p className="text-sm text-[#1A1A1A]/40 mt-2">Our AI is identifying patterns in the leaf structure...</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Main Result Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#5A5A40]/10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">{t.diseaseName}</p>
                      <h2 className="text-2xl font-bold text-[#1A1A1A]">{result.diseaseName}</h2>
                    </div>
                    <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold border", getSeverityColor(result.severity))}>
                      {result.severity} Severity
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#5A5A40]/5 rounded-2xl">
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-bold text-[#5A5A40]/60 uppercase tracking-widest">{t.confidence}</p>
                      <div className="h-2 bg-[#5A5A40]/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          className="h-full bg-[#5A5A40]"
                        />
                      </div>
                    </div>
                    <span className="font-bold text-[#5A5A40] text-lg">{Math.round(result.confidence * 100)}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#5A5A40]">
                        <AlertCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.symptoms}</span>
                      </div>
                      <ul className="space-y-2">
                        {result.symptoms.map((s, i) => (
                          <li key={i} className="text-sm text-[#1A1A1A]/60 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#5A5A40]/40 rounded-full mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#5A5A40]">
                        <Info size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.causes}</span>
                      </div>
                      <ul className="space-y-2">
                        {result.causes.map((c, i) => (
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

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/60">
                        <Leaf size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.organic}</span>
                      </div>
                      <ul className="space-y-2">
                        {result.treatment.organic.map((o, i) => (
                          <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/60">
                        <FlaskConical size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.chemical}</span>
                      </div>
                      <ul className="space-y-2">
                        {result.treatment.chemical.map((c, i) => (
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
    </div>
  );
}
