/**
 * Page Démo - Nouvelles Fonctionnalités Modernes
 * Affiche toutes les améliorations de la plateforme
 */

import { useState } from 'react';
import { FarmsExample } from '@/components/examples/FarmsExample';
import { SocketExample } from '@/components/examples/SocketExample';
import { 
  Zap, 
  Database, 
  Wifi, 
  Lock, 
  FileText, 
  Gauge,
  Shield,
  Cloud,
  Code2,
} from 'lucide-react';

export default function ModernFeaturesDemo() {
  const [activeDemo, setActiveDemo] = useState<'reactQuery' | 'socket'>('reactQuery');

  const features = [
    {
      icon: Database,
      title: 'React Query',
      description: 'State management avec cache automatique',
      color: 'from-blue-500 to-blue-600',
      implemented: true,
    },
    {
      icon: Wifi,
      title: 'Socket.IO',
      description: 'WebSocket temps réel (<100ms)',
      color: 'from-green-500 to-green-600',
      implemented: true,
    },
    {
      icon: Lock,
      title: 'Sécurité',
      description: 'Helmet + Rate Limiting + CORS',
      color: 'from-red-500 to-red-600',
      implemented: true,
    },
    {
      icon: Gauge,
      title: 'Performance',
      description: 'Code Splitting + PWA (-60% bundle)',
      color: 'from-purple-500 to-purple-600',
      implemented: true,
    },
    {
      icon: FileText,
      title: 'Swagger API',
      description: 'Documentation OpenAPI interactive',
      color: 'from-orange-500 to-orange-600',
      implemented: true,
    },
    {
      icon: Shield,
      title: 'Winston Logs',
      description: 'Logging structuré + rotation',
      color: 'from-yellow-500 to-yellow-600',
      implemented: true,
    },
    {
      icon: Cloud,
      title: 'PWA',
      description: 'Offline mode + Service Worker',
      color: 'from-cyan-500 to-cyan-600',
      implemented: true,
    },
    {
      icon: Code2,
      title: 'TypeScript',
      description: 'Type-safe frontend + backend',
      color: 'from-indigo-500 to-indigo-600',
      implemented: true,
    },
  ];

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1f5c3f] to-[#143a28] p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-10 w-10" />
          <h1 className="text-4xl font-bold">AgriTrack Pro</h1>
        </div>
        <p className="text-xl text-green-100">
          Plateforme SaaS Moderne - Niveau Production 🚀
        </p>
        <p className="mt-2 text-green-200">
          Backend + Frontend modernisés avec les meilleures pratiques 2025
        </p>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Fonctionnalités Implémentées
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm transition-all hover:border-[#1f5c3f] hover:shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-10`} />
              
              <feature.icon className={`h-8 w-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent mb-3`} />
              
              <h3 className="font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
              
              {feature.implemented && (
                <span className="mt-3 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  ✅ Actif
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Métriques de Performance
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1f5c3f]">-60%</div>
            <div className="mt-2 text-sm text-slate-600">Bundle Size</div>
            <div className="mt-1 text-xs text-slate-500">450KB → 180KB</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1f5c3f]">-62%</div>
            <div className="mt-2 text-sm text-slate-600">First Load</div>
            <div className="mt-1 text-xs text-slate-500">3.2s → 1.2s</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#1f5c3f]">95/100</div>
            <div className="mt-2 text-sm text-slate-600">Lighthouse</div>
            <div className="mt-1 text-xs text-slate-500">+23 points</div>
          </div>
        </div>
      </div>

      {/* Demo Selector */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Démos Interactives
        </h2>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveDemo('reactQuery')}
            className={`flex-1 rounded-lg px-6 py-3 font-medium transition-all ${
              activeDemo === 'reactQuery'
                ? 'bg-[#1f5c3f] text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database className="inline-block h-5 w-5 mr-2" />
            React Query Demo
          </button>
          <button
            onClick={() => setActiveDemo('socket')}
            className={`flex-1 rounded-lg px-6 py-3 font-medium transition-all ${
              activeDemo === 'socket'
                ? 'bg-[#1f5c3f] text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Wifi className="inline-block h-5 w-5 mr-2" />
            Socket.IO Demo
          </button>
        </div>

        {/* Demo Content */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
          {activeDemo === 'reactQuery' && <FarmsExample />}
          {activeDemo === 'socket' && <SocketExample />}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Tech Stack Complète
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 font-bold text-slate-700">Frontend</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✅ React 19.2 + TypeScript 5.7</li>
              <li>✅ Vite 7.2 (Build ultra-rapide)</li>
              <li>✅ Tailwind CSS 4.1</li>
              <li>✅ React Query (TanStack)</li>
              <li>✅ Socket.IO Client</li>
              <li>✅ React Router v7 + Lazy Loading</li>
              <li>✅ PWA + Service Worker</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-slate-700">Backend</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✅ Node.js 24 + Express 4.21</li>
              <li>✅ Clean Architecture</li>
              <li>✅ Helmet + Rate Limiting</li>
              <li>✅ Winston Logging</li>
              <li>✅ Socket.IO Server</li>
              <li>✅ Swagger/OpenAPI</li>
              <li>✅ PostgreSQL + Django/DRF</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Documentation Link */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-bold text-blue-900">
          📚 Documentation API Swagger
        </h3>
        <p className="mb-4 text-sm text-blue-700">
          Documentation OpenAPI interactive disponible sur le backend
        </p>
        <a
          href="http://localhost:3000/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Ouvrir Swagger UI
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
