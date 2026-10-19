import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Server,
  Code2,
  Clock,
  Send,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface EndpointPreset {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  defaultBody?: any;
}

const PRESET_ENDPOINTS: EndpointPreset[] = [
  {
    name: 'Get All Services Catalog',
    method: 'GET',
    path: '/api/services',
    description: 'Fetch all active household service categories, base rates and tasks'
  },
  {
    name: 'Get Domestic Helpers Fleet',
    method: 'GET',
    path: '/api/helpers',
    description: 'Retrieve all KYC-verified maid, cook, nanny & technician partners'
  },
  {
    name: 'Get Active Bookings',
    method: 'GET',
    path: '/api/bookings',
    description: 'List resident bookings with dispatch tracking & OTP security'
  },
  {
    name: 'Get CarePlans & Warranties',
    method: 'GET',
    path: '/api/careplans',
    description: 'Retrieve domestic staff replacement warranty plans'
  },
  {
    name: 'Get Promo Coupons',
    method: 'GET',
    path: '/api/coupons',
    description: 'Retrieve discount vouchers and referral codes'
  },
  {
    name: 'Get Customer Reviews',
    method: 'GET',
    path: '/api/reviews',
    description: 'Fetch user ratings and homepage featured testimonials'
  },
  {
    name: 'Get Broadcast Announcement',
    method: 'GET',
    path: '/api/cms/announcements',
    description: 'Fetch active top ribbon banner for weather/promo broadcasts'
  },
  {
    name: 'Get Database Diagnostic Status',
    method: 'GET',
    path: '/api/db/status',
    description: 'Diagnostic inspection of data store and collections'
  },
  {
    name: 'Create Quick Test Booking',
    method: 'POST',
    path: '/api/bookings',
    description: 'Dispatches a test domestic booking through the full pipeline',
    defaultBody: {
      serviceId: 'srv-maid-instant',
      category: 'maid',
      serviceTitle: '15-Min Instant House Maid',
      bookingType: 'instant',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '15 Mins Instant Arrival',
      durationHours: 2,
      frequency: 'one-time',
      selectedTasks: ['Deep Mopping', 'Dusting'],
      customer: {
        name: 'Prasad Sharma',
        phone: '+91 98765 43210',
        houseNumber: 'Flat 302',
        address: 'HSR Layout Sector 2',
        city: 'Bangalore',
        pincode: '560102'
      },
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      pricing: {
        baseAmount: 449,
        addOnsAmount: 0,
        platformFee: 49,
        taxAmount: 81,
        discount: 100,
        total: 479
      }
    }
  }
];

export const ApiTesterConsole: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointPreset>(PRESET_ENDPOINTS[0]);
  const [customPath, setCustomPath] = useState(PRESET_ENDPOINTS[0].path);
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [requestBody, setRequestBody] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<any>(null);
  const [responsePayload, setResponsePayload] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [reseedFeedback, setReseedFeedback] = useState<string | null>(null);

  const handleSelectPreset = (preset: EndpointPreset) => {
    setSelectedEndpoint(preset);
    setCustomPath(preset.path);
    setCustomMethod(preset.method);
    setRequestBody(preset.defaultBody ? JSON.stringify(preset.defaultBody, null, 2) : '');
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponsePayload(null);
    setLatencyMs(null);

    const startTime = performance.now();
    try {
      const options: RequestInit = {
        method: customMethod,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (customMethod !== 'GET' && requestBody.trim()) {
        try {
          // validate JSON syntax
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (e) {
          alert('Invalid JSON in request payload body.');
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(customPath, options);
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        setResponsePayload(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponsePayload(text);
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);
      setResponseStatus(500);
      setResponsePayload(JSON.stringify({ error: err.message || 'Network request failed' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset database with clean initial seed data?')) return;
    setIsReseeding(true);
    try {
      const res = await fetch('/api/db/reseed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setReseedFeedback('Database successfully re-seeded with pristine CMS collections!');
        setTimeout(() => setReseedFeedback(null), 4000);
      }
    } catch (e) {
      console.error('Reseed error:', e);
    } finally {
      setIsReseeding(false);
    }
  };

  const copyResponse = () => {
    if (responsePayload) {
      navigator.clipboard.writeText(responsePayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-700" />
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Live Backend API & CMS Interactive Testing Suite
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test and inspect all REST endpoints directly in real-time. Verify response schemas, latency, and data persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReseed}
            disabled={isReseeding}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>{isReseeding ? 'Reseeding...' : 'Reset & Reseed DB'}</span>
          </button>
        </div>
      </div>

      {reseedFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{reseedFeedback}</span>
        </div>
      )}

      {/* Main Grid: Left Presets, Right Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preset Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-between">
            <span>API Catalog Presets</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{PRESET_ENDPOINTS.length} APIs</span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {PRESET_ENDPOINTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedEndpoint.name === preset.name
                    ? 'bg-[#0C356A] text-white border-[#0C356A] shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-black ${
                    preset.method === 'GET'
                      ? selectedEndpoint.name === preset.name ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                      : selectedEndpoint.name === preset.name ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {preset.method}
                  </span>
                  <span className={`text-[10px] font-mono ${selectedEndpoint.name === preset.name ? 'text-cyan-200' : 'text-slate-400'}`}>
                    {preset.path}
                  </span>
                </div>
                <div className="font-bold text-xs">{preset.name}</div>
                <div className={`text-[11px] mt-0.5 line-clamp-1 ${selectedEndpoint.name === preset.name ? 'text-slate-200' : 'text-slate-500'}`}>
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Request & Response Console */}
        <div className="lg:col-span-8 space-y-4">
          {/* Request Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <select
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value as any)}
                className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-hidden"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-hidden focus:border-cyan-600 focus:bg-white"
                />
              </div>

              <button
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50 shrink-0"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>Send Request</span>
              </button>
            </div>

            {/* Request Body if POST/PUT/PATCH */}
            {customMethod !== 'GET' && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                  JSON Request Payload
                </label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{ "key": "value" }'
                  className="w-full p-3 bg-slate-900 text-cyan-300 font-mono text-xs rounded-xl border border-slate-800 outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Response Console */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-lg overflow-hidden text-xs">
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-slate-200">Response Terminal</span>
                {responseStatus !== null && (
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-black ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {responseStatus} {responseStatus === 200 ? 'OK' : responseStatus === 201 ? 'CREATED' : ''}
                  </span>
                )}
                {latencyMs !== null && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {latencyMs}ms
                  </span>
                )}
              </div>

              {responsePayload && (
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            <div className="p-4 max-h-[380px] overflow-y-auto font-mono text-slate-200 text-xs">
              {isLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Executing HTTP Request to API Server...</span>
                </div>
              ) : responsePayload ? (
                <pre className="whitespace-pre-wrap break-all text-cyan-300/90 leading-relaxed">
                  {responsePayload}
                </pre>
              ) : (
                <div className="py-12 text-center text-slate-600">
                  Select a preset and click <strong className="text-slate-400">"Send Request"</strong> to view real-time API output.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
