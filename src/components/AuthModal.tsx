import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Briefcase,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { UserProfile, ServiceCategory } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onPartnerRegisterSuccess?: (helperData: any) => void;
  onAdminUnlock?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onPartnerRegisterSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'partner'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Client Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Bangalore');
  const [regPincode, setRegPincode] = useState('560034');

  // Partner Registration State
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPassword, setPartnerPassword] = useState('');
  const [partnerCategory, setPartnerCategory] = useState<ServiceCategory>('maid');
  const [partnerExp, setPartnerExp] = useState('4');
  const [partnerRate, setPartnerRate] = useState('350');
  const [partnerLanguages, setPartnerLanguages] = useState('Hindi, English');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile phone number.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: loginIdentifier.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      if (data.user) {
        setSuccessMessage(`Welcome back, ${data.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error while logging in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() && !regPhone.trim()) {
      setErrorMessage('Please provide either an email or mobile phone number.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          address: regAddress.trim(),
          city: regCity.trim(),
          pincode: regPincode.trim(),
          role: 'client'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed. Please verify your details.');
        return;
      }

      if (data.user) {
        setSuccessMessage('Account created successfully! Signing you in...');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!partnerName.trim()) {
      setErrorMessage('Please enter the partner full name.');
      return;
    }
    if (!partnerPhone.trim()) {
      setErrorMessage('Please provide a contact mobile phone number.');
      return;
    }
    if (!partnerPassword || partnerPassword.length < 6) {
      setErrorMessage('Please provide a secure password (minimum 6 characters).');
      return;
    }

    setIsLoading(true);
    try {
      // Register provider account with password
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: partnerName.trim(),
          email: partnerEmail.trim() || `partner.${Date.now()}@hommlyn247.com`,
          phone: partnerPhone.trim(),
          password: partnerPassword,
          role: 'provider',
          city: 'Bangalore'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Partner registration failed.');
        return;
      }

      // Also create helper listing in catalog if handler provided
      if (onPartnerRegisterSuccess) {
        onPartnerRegisterSuccess({
          name: partnerName.trim(),
          phone: partnerPhone.trim(),
          category: partnerCategory,
          experienceYears: parseInt(partnerExp, 10) || 3,
          hourlyRate: parseInt(partnerRate, 10) || 350,
          languages: partnerLanguages.split(',').map(s => s.trim()).filter(Boolean)
        });
      }

      if (data.user) {
        setSuccessMessage('Partner onboarded successfully! Welcome to the fleet.');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error onboarding partner.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="bg-[#0C356A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-xs text-white">
              24/7
            </div>
            <span className="font-extrabold text-sm tracking-wide text-cyan-200 uppercase">
              hommlyn247 Identity & Security
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {activeTab === 'login' && 'Sign In to hommlyn247'}
            {activeTab === 'register' && 'Create Customer Account'}
            {activeTab === 'partner' && 'Join Service Provider Fleet'}
          </h2>
          <p className="text-xs text-cyan-100/80 mt-1">
            {activeTab === 'login' && 'Access bookings, live radar, and verified invoices securely.'}
            {activeTab === 'register' && 'Direct 15-minute domestic staffing with CarePlans warranty.'}
            {activeTab === 'partner' && 'Onboard as a verified house maid, cook, driver, or pro.'}
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-white/10 rounded-xl mt-4 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' ? 'bg-white text-[#0C356A] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-white text-[#0C356A] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => { setActiveTab('partner'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'partner' ? 'bg-white text-[#0C356A] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Partner Fleet
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. resident@gmail.com or 9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0C356A] hover:bg-[#092852] disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In Securely</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                    className="text-[#0C356A] font-bold hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password (min 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create secure password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Flat / Society Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Tower 2, Flat 501, Prestige Habitat"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={regPincode}
                    onChange={(e) => setRegPincode(e.target.value)}
                    placeholder="560034"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0C356A] hover:bg-[#092852] disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: PARTNER FLEET */}
          {activeTab === 'partner' && (
            <form onSubmit={handlePartnerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pro Full Name *
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Kavita Devi"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    placeholder="+91 98000 12345"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="pro@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Partner Password (min 6 chars) *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={partnerPassword}
                  onChange={(e) => setPartnerPassword(e.target.value)}
                  placeholder="Create password for partner dashboard"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Skill
                  </label>
                  <select
                    value={partnerCategory}
                    onChange={(e) => setPartnerCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  >
                    <option value="maid">House Help / Maid</option>
                    <option value="cook">Home Cook / Chef</option>
                    <option value="nanny">Babysitter / Nanny</option>
                    <option value="driver">Chauffeur / Driver</option>
                    <option value="gardener">Gardener</option>
                    <option value="elderly">Elderly Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={partnerExp}
                    onChange={(e) => setPartnerExp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C356A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enrolling Partner...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Submit Partner Onboarding</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer Security Badge */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">hommlyn247 v2.8</span>
        </div>

      </div>
    </div>
  );
};
