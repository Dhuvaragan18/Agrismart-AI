import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Leaf, 
  ShieldCheck, 
  FlaskConical, 
  Sparkles,
  RefreshCw,
  Eye,
  Check
} from "lucide-react";
import { detectDisease } from "../services/gemini";
import { DiseaseResult, Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import CameraModal from "../components/CameraModal";
import { generateSampleLeaf } from "../lib/sampleLeaves";

export default function DiseaseDetection({ language }: { language: Language }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
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

  const handleCameraCapture = (capturedBase64: string) => {
    setImage(capturedBase64);
    setResult(null);
    setError(null);
  };

  const loadSample = (type: "tomato" | "paddy" | "corn") => {
    const sampleDataUrl = generateSampleLeaf(type);
    if (sampleDataUrl) {
      setImage(sampleDataUrl);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const data = await detectDisease(image);
      setResult(data);
      
      // Save to history with user info
      const history: DiseaseResult[] = JSON.parse(localStorage.getItem("agri_history") || "[]");
      const recordToSave: DiseaseResult = {
        ...data,
        imageUrl: image,
        userId: user?.id,
      };
      localStorage.setItem("agri_history", JSON.stringify([recordToSave, ...history].slice(0, 30)));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to analyze image. Please ensure leaf is clearly visible and try again.");
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
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} /> AI Plant Pathology
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#5A5A40] tracking-tight">{t.detectDisease}</h1>
        <p className="text-sm sm:text-base text-[#1A1A1A]/60 max-w-xl mx-auto">
          Capture or upload a leaf photo. Our deep vision model detects infections, assesses severity, and prescribes treatments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input / Capture Section */}
        <div className="space-y-6">
          {/* Main Visual Box */}
          <div 
            className={cn(
              "relative aspect-square rounded-[2.5rem] border-3 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-white shadow-sm",
              image ? "border-[#5A5A40]/40" : "border-[#5A5A40]/25 hover:border-[#5A5A40]/50"
            )}
          >
            {image ? (
              <div className="relative w-full h-full group">
                <img src={image} alt="Infected leaf preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="p-3 bg-white text-[#5A5A40] rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <Camera size={16} /> Retake
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white text-[#5A5A40] rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <Upload size={16} /> Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-5">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-[#5A5A40]/10 text-[#5A5A40] rounded-3xl flex items-center justify-center shadow-inner">
                    <Camera size={28} />
                  </div>
                  <div className="w-16 h-16 bg-[#5A5A40]/10 text-[#5A5A40] rounded-3xl flex items-center justify-center shadow-inner">
                    <Upload size={28} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[#1A1A1A]">{t.uploadImage}</h3>
                  <p className="text-xs text-[#1A1A1A]/50">Use live camera or pick leaf image</p>
                </div>

                {/* Direct Action Buttons inside box */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#5A5A40] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-colors shadow-md shadow-[#5A5A40]/20"
                  >
                    <Camera size={16} />
                    {t.openCamera}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#5A5A40]/15 transition-colors"
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*"
              capture="environment"
              className="hidden" 
            />
          </div>

          {/* Dual Action Controls: Camera & Upload */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="py-3.5 px-4 rounded-2xl bg-white border-2 border-[#5A5A40]/20 hover:border-[#5A5A40] text-[#5A5A40] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Camera size={18} />
              {t.openCamera}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3.5 px-4 rounded-2xl bg-white border-2 border-[#5A5A40]/20 hover:border-[#5A5A40] text-[#5A5A40] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Upload size={18} />
              Browse File
            </button>
          </div>

          {/* Analyze CTA */}
          <div className="flex gap-3">
            {image && (
              <button 
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                disabled={loading}
                className="py-4 px-5 rounded-2xl border-2 border-[#5A5A40]/20 font-bold text-xs sm:text-sm text-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all"
              >
                Reset
              </button>
            )}
            <button 
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="flex-1 py-4 rounded-2xl bg-[#5A5A40] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 disabled:opacity-40 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t.detecting}
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Analyze Plant Health
                </>
              )}
            </button>
          </div>

          {/* Quick Sample Selector for immediate demo testing */}
          <div className="p-4 bg-white rounded-2xl border border-[#5A5A40]/10 space-y-2">
            <p className="text-[11px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
              <Leaf size={14} /> {t.orTrySample}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loadSample("tomato")}
                className="p-2 rounded-xl bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 border border-[#5A5A40]/10 text-center transition-colors"
              >
                <span className="block text-base mb-0.5">🍅</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] truncate block">{t.sampleTomatoBlight}</span>
              </button>
              <button
                type="button"
                onClick={() => loadSample("paddy")}
                className="p-2 rounded-xl bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 border border-[#5A5A40]/10 text-center transition-colors"
              >
                <span className="block text-base mb-0.5">🌾</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] truncate block">{t.samplePaddyBlast}</span>
              </button>
              <button
                type="button"
                onClick={() => loadSample("corn")}
                className="p-2 rounded-xl bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 border border-[#5A5A40]/10 text-center transition-colors"
              >
                <span className="block text-base mb-0.5">🌽</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] truncate block">{t.sampleCornRust}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-xs sm:text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
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
                className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm"
              >
                <div className="w-18 h-18 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40 mb-4">
                  <Leaf size={36} />
                </div>
                <h3 className="font-bold text-lg text-[#1A1A1A]/80">Awaiting Plant Photo</h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/50 mt-2 max-w-xs leading-relaxed">
                  Open your camera or select an infected leaf photo to generate an instant diagnosis with organic & chemical treatments.
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[#5A5A40]/15 border-t-[#5A5A40] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#5A5A40]">
                    <Leaf size={32} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="font-bold text-[#5A5A40] mt-8 text-xl">Examining Leaf Specimen</h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/50 mt-2 max-w-xs">
                  Identifying fungal, bacterial, or pest damage patterns and matching agronomy protocols...
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Main Result Card */}
                <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#5A5A40]/10 space-y-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">{t.diseaseName}</p>
                      <h2 className="text-2xl font-bold text-[#1A1A1A] leading-tight">{result.diseaseName}</h2>
                    </div>
                    <div className={cn("px-3.5 py-1.5 rounded-full text-xs font-bold border shrink-0", getSeverityColor(result.severity))}>
                      {result.severity} Severity
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#5A5A40]/5 rounded-2xl">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-widest">
                        <span>{t.confidence}</span>
                        <span>{Math.round(result.confidence * 100)}% Match</span>
                      </div>
                      <div className="h-2.5 bg-[#5A5A40]/15 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          className="h-full bg-[#5A5A40]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[#5A5A40]">
                        <AlertCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.symptoms}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {result.symptoms.map((s, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[#1A1A1A]/70 flex items-start gap-2 leading-snug">
                            <div className="w-1.5 h-1.5 bg-[#5A5A40]/60 rounded-full mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[#5A5A40]">
                        <Info size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.causes}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {result.causes.map((c, i) => (
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
                <div className="bg-[#5A5A40] text-white p-6 sm:p-8 rounded-[2.5rem] space-y-6 shadow-xl shadow-[#5A5A40]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold leading-tight">{t.treatment}</h3>
                      <p className="text-xs text-white/60">Agronomist Recommended Actions</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-green-300">
                        <Leaf size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.organic}</span>
                      </div>
                      <ul className="space-y-2">
                        {result.treatment.organic.map((o, i) => (
                          <li key={i} className="text-xs sm:text-sm text-white/90 flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 size={16} className="text-green-300 shrink-0 mt-0.5" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-blue-300">
                        <FlaskConical size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.chemical}</span>
                      </div>
                      <ul className="space-y-2">
                        {result.treatment.chemical.map((c, i) => (
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

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        language={language}
      />
    </div>
  );
}
