/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sprout, 
  Bug, 
  CloudSun, 
  MessageSquare, 
  History as HistoryIcon, 
  LayoutDashboard, 
  Menu, 
  X, 
  Globe,
  ChevronRight
} from "lucide-react";
import { cn } from "./lib/utils";
import { TRANSLATIONS } from "./constants";
import { Language } from "./types";

// Pages
import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import FarmingAssistant from "./pages/FarmingAssistant";
import Weather from "./pages/Weather";
import Chat from "./pages/Chat";
import History from "./pages/History";

function Layout({ children, language, setLanguage }: { 
  children: React.ReactNode; 
  language: Language; 
  setLanguage: (l: Language) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const t = TRANSLATIONS[language];

  const navItems = [
    { path: "/", label: t.dashboard, icon: LayoutDashboard },
    { path: "/detect", label: t.detectDisease, icon: Bug },
    { path: "/assistant", label: t.smartFarming, icon: Sprout },
    { path: "/weather", label: t.weather, icon: CloudSun },
    { path: "/chat", label: t.chatbot, icon: MessageSquare },
    { path: "/history", label: t.history, icon: HistoryIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#5A5A40]/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white">
              <Sprout size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#5A5A40]">{t.title}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#5A5A40]",
                  location.pathname === item.path ? "text-[#5A5A40]" : "text-[#1A1A1A]/60"
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              className="flex items-center gap-1 text-sm font-medium bg-[#5A5A40]/5 px-3 py-1.5 rounded-full hover:bg-[#5A5A40]/10 transition-colors"
            >
              <Globe size={16} />
              {language === "en" ? "தமிழ்" : "English"}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#5A5A40]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl text-lg font-medium",
                    location.pathname === item.path ? "bg-[#5A5A40] text-white" : "bg-[#5A5A40]/5 text-[#1A1A1A]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    {item.label}
                  </div>
                  <ChevronRight size={20} />
                </Link>
              ))}
              <button
                onClick={() => {
                  setLanguage(language === "en" ? "ta" : "en");
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] font-bold"
              >
                <Globe size={20} />
                {language === "en" ? "தமிழ்" : "English"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#5A5A40]/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="text-[#5A5A40]" size={24} />
            <span className="font-bold text-xl text-[#5A5A40]">{t.title}</span>
          </div>
          <p className="text-[#1A1A1A]/60 text-sm max-w-md mx-auto">
            {t.tagline}
          </p>
          <div className="mt-8 pt-8 border-t border-[#5A5A40]/5 text-[#1A1A1A]/40 text-xs">
            © 2026 AgriSmart AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <Router>
      <Layout language={language} setLanguage={setLanguage}>
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/detect" element={<DiseaseDetection language={language} />} />
          <Route path="/assistant" element={<FarmingAssistant language={language} />} />
          <Route path="/weather" element={<Weather language={language} />} />
          <Route path="/chat" element={<Chat language={language} />} />
          <Route path="/history" element={<History language={language} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

