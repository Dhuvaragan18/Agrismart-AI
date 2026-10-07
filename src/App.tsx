/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
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
  ChevronRight,
  User as UserIcon,
  Share2,
  Check,
  Camera,
  LogIn
} from "lucide-react";
import { cn } from "./lib/utils";
import { TRANSLATIONS } from "./constants";
import { Language } from "./types";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";
import UserProfileModal from "./components/UserProfileModal";

// Pages
import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import FarmingAssistant from "./pages/FarmingAssistant";
import Weather from "./pages/Weather";
import Chat from "./pages/Chat";
import History from "./pages/History";

function LayoutContent({ 
  children, 
  language, 
  setLanguage 
}: { 
  children: React.ReactNode; 
  language: Language; 
  setLanguage: (l: Language) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const location = useLocation();
  const { user } = useAuth();
  const t = TRANSLATIONS[language];

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://ais-pre-v7o6k62phez72vcginp36o-765541936451.asia-southeast1.run.app";

  const handleShareClick = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const navItems = [
    { path: "/", label: t.dashboard, icon: LayoutDashboard },
    { path: "/detect", label: t.detectDisease, icon: Bug },
    { path: "/assistant", label: t.smartFarming, icon: Sprout },
    { path: "/weather", label: t.weather, icon: CloudSun },
    { path: "/chat", label: t.chatbot, icon: MessageSquare },
    { path: "/history", label: t.history, icon: HistoryIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#5A5A40]/10">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#5A5A40]/20">
              <Sprout size={24} />
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#5A5A40] block leading-none">{t.title}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40 block mt-0.5">Smart Agro AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-[#5A5A40] px-2 py-1",
                  location.pathname === item.path ? "text-[#5A5A40] font-bold" : "text-[#1A1A1A]/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Share Link button */}
            <button
              onClick={handleShareClick}
              title="Copy live App Link to open on phone"
              className="flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 px-3 py-2 rounded-xl transition-colors"
            >
              {copiedLink ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
              <span>{copiedLink ? "Link Copied" : "App Link"}</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#5A5A40]/5 px-3 py-2 rounded-xl hover:bg-[#5A5A40]/10 transition-colors"
            >
              <Globe size={14} />
              {language === "en" ? "தமிழ்" : "English"}
            </button>

            {/* User Profile / Login Button */}
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 py-1.5 pl-2 pr-3.5 rounded-2xl bg-[#5A5A40] text-white hover:bg-[#4A4A30] transition-colors shadow-sm"
              >
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block leading-none truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#5A5A40] text-white hover:bg-[#4A4A30] text-xs font-bold transition-colors shadow-sm"
              >
                <LogIn size={14} />
                {t.login}
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center text-xs font-bold shadow-sm"
              >
                {user.name.charAt(0)}
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold"
              >
                <LogIn size={16} />
              </button>
            )}

            <button 
              className="p-2 text-[#5A5A40] rounded-xl hover:bg-[#5A5A40]/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white pt-20 px-4 pb-8 overflow-y-auto sm:hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#5A5A40]/10 mb-4">
              <span className="font-bold text-lg text-[#5A5A40]">Navigation Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-[#1A1A1A]/60">
                <X size={22} />
              </button>
            </div>

            {/* Mobile Farmer Account Card */}
            {user ? (
              <div 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="mb-4 p-4 rounded-2xl bg-[#5A5A40]/5 border border-[#5A5A40]/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A1A]">{user.name}</h4>
                    <p className="text-xs text-[#5A5A40] font-medium">{user.location}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#5A5A40]" />
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full mb-4 p-3.5 rounded-2xl bg-[#5A5A40] text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                {t.login} / {t.signup}
              </button>
            )}

            <nav className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-2xl text-base font-semibold",
                    location.pathname === item.path ? "bg-[#5A5A40] text-white" : "bg-[#5A5A40]/5 text-[#1A1A1A]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ChevronRight size={18} />
                </Link>
              ))}

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    handleShareClick();
                  }}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] font-bold text-xs"
                >
                  {copiedLink ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                  {copiedLink ? "Copied" : "Share Link"}
                </button>
                <button
                  onClick={() => {
                    setLanguage(language === "en" ? "ta" : "en");
                  }}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] font-bold text-xs"
                >
                  <Globe size={16} />
                  {language === "en" ? "தமிழ்" : "English"}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#5A5A40]/10 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#5A5A40]/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center">
                <Sprout size={20} />
              </div>
              <span className="font-bold text-lg text-[#5A5A40]">{t.title}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#1A1A1A]/70 font-semibold">
              <Link to="/detect" className="hover:text-[#5A5A40] flex items-center gap-1">
                <Camera size={14} /> Leaf Camera
              </Link>
              <Link to="/assistant" className="hover:text-[#5A5A40]">Farming Plan</Link>
              <Link to="/weather" className="hover:text-[#5A5A40]">Weather Alerts</Link>
              <Link to="/chat" className="hover:text-[#5A5A40]">Agro Chat</Link>
              <button 
                onClick={handleShareClick}
                className="hover:text-[#5A5A40] flex items-center gap-1 text-[#5A5A40] font-bold"
              >
                <Share2 size={14} /> {copiedLink ? "Link Copied!" : "Copy App Link"}
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#1A1A1A]/40 text-center sm:text-left">
            <p>© 2026 AgriSmart AI. Crop Disease Detection & Smart Farming Assistant.</p>
            <p className="font-mono text-[11px]">Deploy: {appUrl}</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAuth={() => {
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        language={language}
      />
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <Router>
      <AuthProvider>
        <LayoutContent language={language} setLanguage={setLanguage}>
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/detect" element={<DiseaseDetection language={language} />} />
            <Route path="/assistant" element={<FarmingAssistant language={language} />} />
            <Route path="/weather" element={<Weather language={language} />} />
            <Route path="/chat" element={<Chat language={language} />} />
            <Route path="/history" element={<History language={language} />} />
          </Routes>
        </LayoutContent>
      </AuthProvider>
    </Router>
  );
}
