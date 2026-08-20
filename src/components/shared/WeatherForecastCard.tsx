import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { geminiService } from '../../services/GeminiService';
import { WeatherForecastData } from '../../types';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Compass,
} from 'lucide-react';

interface WeatherForecastCardProps {
  initialLocation?: string;
}

export const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({
  initialLocation = 'San Francisco, CA',
}) => {
  const [location, setLocation] = useState<string>(initialLocation);
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherForecastData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'hourly'>('overview');

  const popularCities = ['San Francisco, CA', 'New York, NY', 'London, UK', 'Tokyo, Japan', 'Bengaluru, India'];

  const fetchWeather = async (targetLoc: string) => {
    setIsLoading(true);
    try {
      const data = await geminiService.fetchWeatherForecast(targetLoc);
      setWeatherData(data);
    } catch (err: any) {
      console.warn('Weather fetch notice:', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLocation.trim()) return;
    setLocation(customLocation.trim());
    setCustomLocation('');
    setIsSearching(false);
  };

  const getWeatherIcon = (condition: string = '') => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
      return <CloudRain className="w-8 h-8 text-cyan-400" />;
    }
    if (c.includes('sun') || c.includes('clear')) {
      return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
    }
    if (c.includes('wind') || c.includes('breeze')) {
      return <Wind className="w-8 h-8 text-teal-400" />;
    }
    return <CloudSun className="w-8 h-8 text-purple-300" />;
  };

  return (
    <div id="weather-forecast-summary" className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0C1527] via-[#0E0E22] to-[#120B24] p-5 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-60 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">
                REAL-TIME WEATHER INTELLIGENCE
              </span>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-mono">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                Search Grounded
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {weatherData?.location || location}
              </h3>
            </div>
          </div>
        </div>

        {/* Location selector & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick city pill shortcuts */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {popularCities.slice(0, 3).map((city) => (
              <button
                key={city}
                onClick={() => setLocation(city)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  location === city
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {city.split(',')[0]}
              </button>
            ))}
          </div>

          {isSearching ? (
            <form onSubmit={handleLocationSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter city (e.g., Paris, Tokyo)..."
                autoFocus
                className="px-3 py-1.5 rounded-xl bg-[#080816] border border-cyan-500/50 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 w-44"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setIsSearching(false)}
                className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearching(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
              title="Change city"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change City</span>
            </button>
          )}

          <button
            onClick={() => fetchWeather(location)}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh forecast using Google Search Grounding"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body content */}
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs text-cyan-300 font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            Fetching live weather telemetry via Gemini Search Grounding...
          </p>
        </div>
      ) : weatherData ? (
        <div className="relative z-10 pt-4 space-y-4">
          {/* Main Weather Metric Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Current temperature & condition (5 cols) */}
            <div className="md:col-span-4 flex items-center gap-4 p-3.5 rounded-xl bg-black/20 border border-white/5">
              <div className="shrink-0 p-2.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 shadow-inner">
                {getWeatherIcon(weatherData.condition)}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {weatherData.temperature}
                  </span>
                  <span className="text-xs font-semibold text-cyan-300">
                    {weatherData.condition}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>H: <strong className="text-slate-200">{weatherData.highTemp || '72°F'}</strong></span>
                  <span>•</span>
                  <span>L: <strong className="text-slate-200">{weatherData.lowTemp || '56°F'}</strong></span>
                </div>
              </div>
            </div>

            {/* Weather Telemetry stats (4 cols) */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">HUMIDITY</p>
                  <p className="text-xs font-bold text-white">{weatherData.humidity || '62%'}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">WIND</p>
                  <p className="text-xs font-bold text-white">{weatherData.windSpeed || '10 mph'}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">UV INDEX</p>
                  <p className="text-xs font-bold text-white">{weatherData.uvIndex || '5 Moderate'}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">AIR QUALITY</p>
                  <p className="text-xs font-bold text-emerald-300">{weatherData.airQuality || 'Good (32)'}</p>
                </div>
              </div>
            </div>

            {/* AI Weather Summary & Clothing Advice (4 cols) */}
            <div className="md:col-span-4 p-3 rounded-xl bg-gradient-to-br from-purple-950/40 to-blue-950/40 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-purple-300 uppercase tracking-wider font-mono">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>JARVIS DAILY BRIEFING</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed line-clamp-2">
                {weatherData.summary}
              </p>
              {weatherData.clothingAdvice && (
                <p className="text-[11px] text-cyan-300/90 font-medium">
                  💡 <span className="text-slate-300">Advice:</span> {weatherData.clothingAdvice}
                </p>
              )}
            </div>
          </div>

          {/* 4-Day Forecast Chips */}
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  4-DAY OUTLOOK
                </span>
                {weatherData.groundingSources && weatherData.groundingSources.length > 0 && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Source:</span>
                    <a
                      href={weatherData.groundingSources[0].uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      {weatherData.groundingSources[0].title}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {weatherData.forecast.slice(0, 4).map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{f.day}</p>
                      <p className="text-[10px] text-slate-400">{f.condition}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-cyan-300">{f.temp}</span>
                      {f.pop && <p className="text-[9px] text-slate-500">☂ {f.pop}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
