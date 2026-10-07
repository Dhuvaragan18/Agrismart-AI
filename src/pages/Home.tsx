import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Bug, Sprout, CloudSun, MessageSquare, ChevronRight, AlertTriangle } from "lucide-react";
import { TRANSLATIONS } from "../constants";
import { Language } from "../types";

export default function Home({ language }: { language: Language }) {
  const t = TRANSLATIONS[language];

  const features = [
    {
      title: t.detectDisease,
      desc: "Upload leaf images to identify crop diseases instantly.",
      icon: Bug,
      path: "/detect",
      color: "bg-red-50 text-red-600",
    },
    {
      title: t.smartFarming,
      desc: "Get personalized farming plans based on your location.",
      icon: Sprout,
      path: "/assistant",
      color: "bg-green-50 text-green-600",
    },
    {
      title: t.weather,
      desc: "Real-time weather updates and agricultural alerts.",
      icon: CloudSun,
      path: "/weather",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t.chatbot,
      desc: "Ask our AI expert any farming-related questions.",
      icon: MessageSquare,
      path: "/chat",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-[#5A5A40]"
        >
          {t.tagline}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto"
        >
          Empowering farmers with AI-driven insights for better yields and healthier crops.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Link 
            to="/detect" 
            className="bg-[#5A5A40] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
          >
            <Bug size={20} />
            {t.detectDisease}
          </Link>
          <Link 
            to="/assistant" 
            className="bg-white text-[#5A5A40] border-2 border-[#5A5A40]/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#5A5A40]/5 transition-all"
          >
            <Sprout size={20} />
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
              className="group block h-full bg-white p-8 rounded-[2rem] border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">{feature.title}</h3>
              <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                {feature.desc}
              </p>
              <div className="flex items-center text-[#5A5A40] font-bold text-sm">
                Learn more <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Alerts / Quick Stats */}
      <section className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
          <AlertTriangle size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-amber-900">Weather Alert: High Humidity Risk</h4>
          <p className="text-amber-800/80 text-sm">
            Current conditions in your area are favorable for fungal growth. Monitor your crops closely and ensure proper ventilation.
          </p>
        </div>
        <Link 
          to="/weather" 
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors"
        >
          View Details
        </Link>
      </section>
    </div>
  );
}
