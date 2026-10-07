import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, MapPin, CloudRain, Sun, CloudLightning, Info, Calendar } from "lucide-react";
import { Language, WeatherData } from "../types";
import { TRANSLATIONS } from "../constants";
import { cn } from "../lib/utils";

export default function Weather({ language }: { language: Language }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setWeather({
        temp: 32,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        location: "Coimbatore, Tamil Nadu",
        alerts: [
          "High Humidity Risk: Favorable for fungal diseases.",
          "Rain Warning: Moderate rain expected in the evening.",
          "Temperature Alert: Heat stress risk for young saplings."
        ]
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#5A5A40]/10 border-t-[#5A5A40] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#5A5A40]">{t.weather}</h1>
        <p className="text-[#1A1A1A]/60">Real-time climate data and agricultural alerts for your location.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Weather Card */}
        <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5A5A40] font-bold">
                  <MapPin size={18} />
                  {weather?.location}
                </div>
                <h2 className="text-6xl font-bold text-[#1A1A1A]">{weather?.temp}°C</h2>
                <p className="text-xl text-[#1A1A1A]/60 font-medium">{weather?.condition}</p>
              </div>
              <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shadow-inner">
                <Sun size={64} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#5A5A40]/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5A5A40]/60 text-xs font-bold uppercase tracking-wider">
                  <Droplets size={14} />
                  Humidity
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{weather?.humidity}%</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5A5A40]/60 text-xs font-bold uppercase tracking-wider">
                  <Wind size={14} />
                  Wind
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{weather?.windSpeed} km/h</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5A5A40]/60 text-xs font-bold uppercase tracking-wider">
                  <CloudRain size={14} />
                  Precipitation
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#5A5A40] flex items-center gap-2">
            <AlertTriangle size={20} />
            {t.weatherAlerts}
          </h3>
          <div className="space-y-4">
            {weather?.alerts.map((alert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-4 rounded-2xl border flex gap-3",
                  i === 0 ? "bg-red-50 border-red-100 text-red-700" : 
                  i === 1 ? "bg-blue-50 border-blue-100 text-blue-700" : 
                  "bg-amber-50 border-amber-100 text-amber-700"
                )}
              >
                <div className="shrink-0 mt-1">
                  {i === 0 ? <AlertTriangle size={18} /> : i === 1 ? <CloudRain size={18} /> : <Thermometer size={18} />}
                </div>
                <p className="text-sm font-medium leading-relaxed">{alert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#5A5A40] flex items-center gap-2">
          <Calendar size={20} />
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
            <div key={day} className="bg-white p-6 rounded-[2rem] border border-[#5A5A40]/10 text-center space-y-4 hover:border-[#5A5A40]/30 transition-all">
              <p className="text-xs font-bold text-[#5A5A40]/60 uppercase tracking-widest">{day}</p>
              <div className="w-12 h-12 bg-[#5A5A40]/5 rounded-full flex items-center justify-center mx-auto text-[#5A5A40]">
                {i % 2 === 0 ? <Sun size={24} /> : i % 3 === 0 ? <CloudLightning size={24} /> : <CloudSun size={24} />}
              </div>
              <div>
                <p className="text-xl font-bold text-[#1A1A1A]">{30 + i}°</p>
                <p className="text-[10px] text-[#1A1A1A]/40 font-bold uppercase">{i % 2 === 0 ? "Sunny" : "Cloudy"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
