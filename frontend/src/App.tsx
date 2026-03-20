import { useState, useRef, useEffect } from 'react';
import { Home, Map, Wallet, User, Shield, Bell, TrendingUp, ChevronRight, Navigation, Zap, AlertTriangle, Activity, Clock, CloudRain, Check, Phone, MessageCircle, HelpCircle, Settings, ChevronLeft, CreditCard, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

// Types
interface Claim {
  id: string;
  amount: number;
  reason: 'rain' | 'demand';
  zone: string;
  time: string;
  status: 'pending' | 'completed';
}

interface Plan {
  id: string;
  name: string;
  price: number;
  coverage: string;
  features: string[];
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  last4: string;
  bank?: string;
  expiry?: string;
  isDefault: boolean;
}

// Mock Data
const userData = {
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  email: 'ravi@swarmshield.app',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RaviKumar',
  policyId: 'SSX-9982-A',
  joinedDate: 'January 2026',
};

const mockClaims: Claim[] = [
  { id: '1', amount: 300, reason: 'rain', zone: 'Tambaram', time: 'Today, 11:30 AM', status: 'completed' },
  { id: '2', amount: 150, reason: 'rain', zone: 'Velachery', time: 'Yesterday, 4:15 PM', status: 'completed' },
  { id: '3', amount: 200, reason: 'demand', zone: 'Sholinganallur', time: 'Mar 18, 2:00 PM', status: 'completed' },
  { id: '4', amount: 85, reason: 'demand', zone: 'Medavakkam', time: 'Mar 15, 6:30 PM', status: 'completed' },
  { id: '5', amount: 120, reason: 'rain', zone: 'Perungudi', time: 'Mar 12, 3:45 PM', status: 'pending' },
];

const weeklyData = [
  { day: 'Mon', risk: 1.2, earnings: 850 },
  { day: 'Tue', risk: 1.5, earnings: 920 },
  { day: 'Wed', risk: 1.3, earnings: 780 },
  { day: 'Thu', risk: 1.8, earnings: 1100 },
  { day: 'Fri', risk: 2.1, earnings: 950 },
  { day: 'Sat', risk: 2.5, earnings: 750 },
  { day: 'Sun', risk: 2.3, earnings: 820 },
];

const zones = [
  { id: '1', name: 'Guindy Central', status: 'safe' as const, surge: '1.5x', drivers: 12, distance: '2.1 km' },
  { id: '2', name: 'Anna Nagar', status: 'safe' as const, surge: '1.3x', drivers: 8, distance: '3.5 km' },
  { id: '3', name: 'T. Nagar', status: 'moderate' as const, surge: '1.0x', drivers: 15, distance: '4.2 km' },
  { id: '4', name: 'Velachery', status: 'danger' as const, surge: '0.4x', drivers: 32, distance: '5.8 km' },
  { id: '5', name: 'Tambaram', status: 'danger' as const, surge: '0.3x', drivers: 28, distance: '8.1 km' },
];

const plans: Plan[] = [
  { id: 'basic', name: 'Basic Shield', price: 12, coverage: '₹200/claim', features: ['Basic weather protection', 'Email support', 'Weekly reports'] },
  { id: 'pro', name: 'Pro Shield', price: 18, coverage: '₹500/claim', features: ['Full weather protection', '24/7 support', 'Real-time alerts', 'Priority claims'], popular: true },
  { id: 'premium', name: 'Premium Shield', price: 28, coverage: '₹1000/claim', features: ['All Pro features', 'Unlimited claims', 'Dedicated agent', 'Family coverage'] },
];

const paymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4532', bank: 'HDFC Bank', expiry: '12/27', isDefault: true },
  { id: '2', type: 'upi', last4: 'ravi@upi', isDefault: false },
];

// ============== COMPONENTS ==============

function Header({ title, onBack, rightElement }: { title: string; onBack?: () => void; rightElement?: React.ReactNode }) {
  return (
    <div className="bg-white px-5 pt-14 pb-4 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform">
              <ChevronLeft size={22} className="text-slate-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>
        {rightElement}
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 ${className}`}>{children}</div>;
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Button({ children, variant = 'primary', className = '', onClick, disabled }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger'; className?: string; onClick?: () => void; disabled?: boolean }) {
  const base = 'w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ';
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30',
    secondary: 'bg-slate-100 text-slate-700',
    danger: 'bg-red-50 text-red-600',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}>
      {children}
    </button>
  );
}

function SuccessModal({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-8 text-center animate-bounce-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Success!</h3>
        <p className="text-slate-500">{message}</p>
      </div>
    </div>
  );
}

// ============== SCREENS ==============

function LoginScreen({ onContinue }: { onContinue: () => void }) {
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-white flex flex-col px-6 pt-20">
      <div className="flex justify-center mb-10">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-purple-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse-glow">
            <Shield size={52} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white animate-bounce-in">
            <Check size={18} className="text-white" />
          </div>
        </div>
      </div>

      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">SwarmShield X</h1>
        <p className="text-slate-500 text-base">AI-Powered Income Protection</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-slate-100/50 p-6 animate-slide-up-delay">
        <div className="space-y-5">
          <div className="relative">
            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${isFocused || phone ? '-top-2.5 text-xs bg-white px-2 text-violet-600 font-medium' : 'top-4 text-slate-400'}`}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full px-4 pt-5 pb-3 rounded-2xl border-2 outline-none transition-all duration-300 text-slate-800 ${isFocused ? 'border-violet-500 shadow-lg shadow-violet-500/10' : 'border-slate-200'}`}
            />
          </div>

          <button
            onClick={() => phone.length >= 10 && onContinue()}
            disabled={phone.length < 10}
            className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 active:scale-[0.98] ${phone.length >= 10 ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-purple-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Send OTP
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button onClick={onContinue} className="w-full py-4 border-2 border-slate-200 rounded-2xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors active:scale-[0.98]">
            Try Demo Account
          </button>
        </div>
      </div>

      <div className="mt-auto py-8 text-center animate-fade-in-delay">
        <p className="text-xs text-slate-400">By continuing, you agree to our <span className="text-violet-600 font-medium">Terms</span></p>
      </div>
    </div>
  );
}

function OTPScreen({ onVerify, onBack }: { onVerify: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d)) setTimeout(onVerify, 300);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-16">
      <button onClick={onBack} className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        <ChevronLeft size={22} className="text-slate-600" />
      </button>

      <div className="mb-10 animate-slide-up">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Phone</h2>
        <p className="text-slate-500">Enter the 4-digit code sent to</p>
        <p className="text-violet-600 font-semibold">+91 98765 43210</p>
      </div>

      <div className="flex justify-center gap-4 mb-8 animate-slide-up-delay">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-16 h-18 text-center text-2xl font-bold rounded-2xl border-2 transition-all duration-200 ${digit ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white'}`}
          />
        ))}
      </div>

      <div className="text-center mb-8 animate-fade-in-delay">
        <p className="text-sm text-slate-500">Didn't receive it? <button className="text-violet-600 font-semibold">Resend</button></p>
      </div>

      <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 animate-fade-in-delay">
        <p className="text-xs text-violet-600 text-center font-medium">Demo: Enter any 4 digits or wait for auto-verify</p>
      </div>
    </div>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const completedClaims = mockClaims.filter(c => c.status === 'completed');
  const pendingClaims = mockClaims.filter(c => c.status === 'pending');
  const totalProtected = completedClaims.reduce((sum, c) => sum + c.amount, 0);
  const pendingTotal = pendingClaims.reduce((sum, c) => sum + c.amount, 0);
  const maxRisk = Math.max(...weeklyData.map(d => d.risk));

  return (
    <div className="min-h-full bg-slate-100">
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800 px-5 pt-14 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={userData.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl border-2 border-white/20" />
            <div>
              <p className="text-slate-400 text-sm">Welcome back,</p>
              <h1 className="text-white text-xl font-bold">{userData.name.split(' ')[0]} 👋</h1>
            </div>
          </div>
          <button className="relative p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
            <Bell size={20} className="text-white" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-emerald-400 text-sm font-medium">You're protected today</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-500 to-orange-500"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-white/80" />
                <span className="text-white/80 text-sm font-medium">Income Protected</span>
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-medium">{userData.policyId}</span>
              </div>
            </div>

            <p className="text-5xl font-bold text-white mb-1">₹{totalProtected}</p>
            <p className="text-white/70 text-sm mb-6">protected today</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20">
                <AlertTriangle size={14} className="text-amber-300" />
                <span className="text-sm font-semibold text-amber-300">1.8x Risk</span>
              </div>
              {pendingTotal > 0 && (
                <button onClick={() => onNavigate('payouts')} className="px-4 py-2 bg-white text-violet-600 rounded-full text-sm font-semibold flex items-center gap-1.5 active:scale-95 transition-transform shadow-lg">
                  Claim ₹{pendingTotal}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 -mt-3 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <p className="text-xs text-slate-500 mb-1">Risk Level</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-slate-900">Moderate</p>
              <span className="text-xs font-medium text-red-500">↑ +0.3</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mb-1">Earnings Today</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-slate-900">₹1,240</p>
              <span className="text-xs font-medium text-emerald-600">↑ 12%</span>
            </div>
          </div>

          <button onClick={() => onNavigate('map')} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 text-left border border-emerald-200/50 col-span-2 active:scale-[0.98] transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3">
                  <Zap size={18} className="text-white" />
                </div>
                <p className="text-xs text-emerald-600 font-medium mb-1">Suggested Zone</p>
                <p className="font-bold text-slate-900">{zones[0].name}</p>
                <p className="text-xs text-emerald-600 mt-1">{zones[0].distance} • {zones[0].surge} surge</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{zones[0].surge}</p>
                <p className="text-xs text-emerald-600/70">surge</p>
              </div>
            </div>
          </button>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-900">Weekly Activity</h3>
            <span className="text-xs text-slate-500">Risk by day</span>
          </div>
          
          <div className="flex items-end justify-between h-20 gap-2">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-xl transition-all ${data.risk >= 2 ? 'bg-gradient-to-t from-red-500 to-red-400' : data.risk >= 1.5 ? 'bg-gradient-to-t from-amber-500 to-amber-400' : 'bg-gradient-to-t from-emerald-500 to-emerald-400'}`}
                  style={{ height: `${Math.max((data.risk / maxRisk) * 64, 8)}px` }}
                />
                <span className="text-[10px] text-slate-400 font-medium">{data.day}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-emerald-400"></div><span className="text-xs text-slate-500">Safe</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-amber-400"></div><span className="text-xs text-slate-500">Moderate</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-red-400"></div><span className="text-xs text-slate-500">High</span></div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Zone Changed</p>
                <p className="text-xs text-slate-500">Moved to Anna Nagar at 9:30 AM</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">+₹85</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Risk Alert</p>
                <p className="text-xs text-slate-500">Heavy rain detected in Tambaram</p>
              </div>
              <span className="text-xs text-slate-400">2h ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MapScreen() {
  const [showSuccess, setShowSuccess] = useState(false);
  const mapZones = [
    { id: '1', name: 'Guindy', status: 'safe' as const, x: '20%', y: '25%' },
    { id: '2', name: 'Anna N.', status: 'safe' as const, x: '75%', y: '20%' },
    { id: '3', name: 'T. Nagar', status: 'moderate' as const, x: '50%', y: '50%' },
    { id: '4', name: 'Velachery', status: 'danger' as const, x: '25%', y: '80%' },
    { id: '5', name: 'Tambaram', status: 'danger' as const, x: '70%', y: '85%' },
  ];
  const statusColors = { safe: 'bg-emerald-500', moderate: 'bg-amber-500', danger: 'bg-red-500' };

  return (
    <div className="min-h-full bg-slate-100">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Zone Map</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-emerald-300 font-medium">Live</span>
          </div>
        </div>
        
        <div className="relative">
          <Navigation size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search location..." className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 outline-none focus:border-violet-500 transition-colors" />
        </div>
      </div>

      <div className="px-5 py-6 space-y-5">
        <Card className="!p-0 overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="absolute inset-0 opacity-[0.15]">
              <div className="grid grid-cols-10 grid-rows-8 h-full">
                {Array.from({ length: 80 }).map((_, i) => (<div key={i} className="border border-slate-400/40"></div>))}
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full opacity-40">
              <path d="M0 40% Q50% 35% 100% 40%" stroke="#64748b" strokeWidth="4" fill="none" />
              <path d="M45% 0 Q40% 50% 45% 100%" stroke="#64748b" strokeWidth="4" fill="none" />
            </svg>
            {mapZones.map((zone) => (
              <div key={zone.id} className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${zone.status === 'danger' ? 'animate-pulse' : ''}`} style={{ left: zone.x, top: zone.y }}>
                <div className={`w-14 h-14 ${statusColors[zone.status]} rounded-full flex items-center justify-center shadow-xl`}>
                  <span className="text-white text-xs font-bold">{zone.name}</span>
                </div>
              </div>
            ))}
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative">
                <div className="w-20 h-20 bg-violet-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/40">
                    <Activity size={20} className="text-white" />
                  </div>
                </div>
              </div>
              <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-violet-600">You</p>
            </div>
          </div>
          <div className="p-4 flex justify-around border-t border-slate-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs text-slate-600 font-medium">Safe</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs text-slate-600 font-medium">Moderate</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-slate-600 font-medium">Danger</span></div>
          </div>
        </Card>

        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-5 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-emerald-200" />
            <span className="text-emerald-200 text-sm font-medium">Recommended for You</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold">{zones[0].name}</h3>
              <p className="text-emerald-200 text-sm">{zones[0].distance} away • {zones[0].drivers} drivers online</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{zones[0].surge}</p>
              <p className="text-emerald-200 text-xs">surge</p>
            </div>
          </div>
          <Button onClick={() => setShowSuccess(true)} className="mt-4 !bg-white !text-emerald-700">
            <Navigation size={18} />
            Navigate Here
          </Button>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Nearby Zones</h3>
          <div className="space-y-3">
            {zones.slice(0, 4).map((zone) => (
              <div key={zone.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${zone.status === 'safe' ? 'bg-emerald-100' : zone.status === 'moderate' ? 'bg-amber-100' : 'bg-red-100'}`}>
                      <Navigation size={18} className={zone.status === 'safe' ? 'text-emerald-600' : zone.status === 'moderate' ? 'text-amber-600' : 'text-red-600'} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{zone.name}</p>
                      <p className="text-xs text-slate-500">{zone.drivers} drivers • {zone.distance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${zone.status === 'safe' ? 'text-emerald-600' : zone.status === 'moderate' ? 'text-amber-600' : 'text-red-600'}`}>{zone.surge}</p>
                    <p className="text-[10px] text-slate-400">surge</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSuccess && <SuccessModal message="Navigation started to Guindy Central" onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

function PayoutsScreen() {
  const [claims, setClaims] = useState(mockClaims);
  const [showSuccess, setShowSuccess] = useState(false);

  const completedClaims = claims.filter(c => c.status === 'completed');
  const pendingClaims = claims.filter(c => c.status === 'pending');
  const totalProtected = completedClaims.reduce((sum, c) => sum + c.amount, 0);

  const handleClaim = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'completed' as const } : c));
    setShowSuccess(true);
  };

  return (
    <div className="min-h-full bg-slate-100">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-5 pt-14 pb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Payouts</h1>
          <span className="px-3 py-1 bg-white/10 rounded-full text-white text-xs font-medium">{claims.length} claims</span>
        </div>
        <p className="text-slate-400 text-sm">Your protection claims history</p>

        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-slate-300 text-sm font-medium">Total Protected</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">₹{totalProtected}</p>
          <p className="text-slate-400 text-sm">lifetime earnings</p>
        </div>
      </div>

      <div className="px-5 py-6 -mt-3 space-y-5">
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center"><p className="text-2xl font-bold text-slate-900">{claims.length}</p><p className="text-xs text-slate-500 mt-1">Total</p></div>
            <div className="text-center border-x border-slate-100"><p className="text-2xl font-bold text-emerald-600">100%</p><p className="text-xs text-slate-500 mt-1">Success</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-slate-900">₹{totalProtected}</p><p className="text-xs text-slate-500 mt-1">Total Paid</p></div>
          </div>
        </Card>

        {pendingClaims.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Pending ({pendingClaims.length})</h3>
            <div className="space-y-3">
              {pendingClaims.map((claim) => (
                <Card key={claim.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <CloudRain size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{claim.reason === 'rain' ? 'Rain Protection' : 'Demand Protection'}</p>
                        <p className="text-sm text-slate-500">{claim.zone}</p>
                        <div className="flex items-center gap-1 mt-1"><Clock size={12} className="text-slate-400" /><span className="text-xs text-slate-400">{claim.time}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-600">+₹{claim.amount}</p>
                      <Button onClick={() => handleClaim(claim.id)} className="!py-2 !px-4 !mt-2 !text-xs">Claim</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Completed ({completedClaims.length})</h3>
          <div className="space-y-3">
            {completedClaims.map((claim) => (
              <Card key={claim.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${claim.reason === 'rain' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                      {claim.reason === 'rain' ? <CloudRain size={22} className="text-white" /> : <TrendingUp size={22} className="text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{claim.reason === 'rain' ? 'Rain Protection' : 'Demand Protection'}</p>
                      <p className="text-sm text-slate-500">{claim.zone}</p>
                      <div className="flex items-center gap-1 mt-1"><Clock size={12} className="text-slate-400" /><span className="text-xs text-slate-400">{claim.time}</span></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">+₹{claim.amount}</p>
                    <div className="flex items-center gap-1 mt-2 justify-end"><Check size={12} className="text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">Paid</span></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showSuccess && <SuccessModal message="Claim of ₹120 has been credited!" onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

function ProfileScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="min-h-full bg-slate-100">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-5 pt-14 pb-8">
        <h1 className="text-xl font-bold text-white mb-6">Profile</h1>
        <div className="flex items-center gap-4">
          <img src={userData.avatar} alt="Avatar" className="w-20 h-20 rounded-3xl border-2 border-white/20" />
          <div>
            <h2 className="text-white text-xl font-bold">{userData.name}</h2>
            <p className="text-slate-400 text-sm">{userData.phone}</p>
            <p className="text-slate-400 text-sm">{userData.email}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 -mt-3 space-y-5">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Protection Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">₹735</p>
              <p className="text-xs text-emerald-600/70 mt-1">Protected Today</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-100/50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-600">₹1,200</p>
              <p className="text-xs text-violet-600/70 mt-1">This Month</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Your Policy</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100"><span className="text-sm text-slate-500">Policy ID</span><span className="text-sm font-mono font-medium text-slate-900">{userData.policyId}</span></div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100"><span className="text-sm text-slate-500">Status</span><span className="text-sm font-medium text-emerald-600">Active</span></div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100"><span className="text-sm text-slate-500">Weekly Premium</span><span className="text-sm font-medium text-slate-900">₹18/week</span></div>
            <div className="flex justify-between items-center py-2.5"><span className="text-sm text-slate-500">Claim Limit</span><span className="text-sm font-medium text-slate-900">₹500/month</span></div>
          </div>
        </Card>

        <Card className="!p-0 !overflow-visible">
          {[
            { icon: Settings, label: 'Settings', screen: 'settings' },
            { icon: HelpCircle, label: 'Help & Support', screen: 'support' },
            { icon: FileText, label: 'Terms of Service', screen: 'terms' },
            { icon: Shield, label: 'Privacy Policy', screen: 'privacy' },
          ].map(({ icon: Icon, label, screen }, i) => (
            <button key={i} onClick={() => onNavigate(screen)} className="w-full flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3"><Icon size={20} className="text-slate-600" /><span className="text-sm font-medium text-slate-700">{label}</span></div><ChevronRight size={18} className="text-slate-400" />
            </button>
          ))}
        </Card>

        <Button variant="danger">Log Out</Button>

        <p className="text-center text-xs text-slate-400 pb-4">SwarmShield X v1.0.0 • {userData.joinedDate}</p>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);

  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Settings" onBack={onBack} />

      <div className="px-5 py-6 space-y-5">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Account</h3>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl mb-3">
            <img src={userData.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{userData.name}</p>
              <p className="text-sm text-slate-500">{userData.email}</p>
            </div>
            <button className="text-violet-600 text-sm font-medium">Edit</button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-slate-800">Push Notifications</p><p className="text-xs text-slate-500">Receive updates about claims</p></div>
              <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-slate-800">Risk Alerts</p><p className="text-xs text-slate-500">Get notified about weather risks</p></div>
              <Toggle enabled={riskAlerts} onToggle={() => setRiskAlerts(!riskAlerts)} />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Policy</h3>
          <div className="space-y-2">
            <button className="w-full p-3 text-left text-slate-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between">
              <span>Change Plan</span><ChevronRight size={18} className="text-slate-400" />
            </button>
            <button className="w-full p-3 text-left text-slate-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between">
              <span>Update Payment Method</span><ChevronRight size={18} className="text-slate-400" />
            </button>
            <button className="w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between">
              <span>Cancel Policy</span><ChevronRight size={18} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SupportScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Help & Support" onBack={onBack} />

      <div className="px-5 py-6 space-y-5">
        <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-6 text-white">
          <HelpCircle size={32} className="mb-3" />
          <h3 className="text-lg font-bold mb-2">How can we help?</h3>
          <p className="text-white/80 text-sm mb-4">Get quick answers or contact our support team.</p>
          <Button className="!bg-white !text-violet-600">Contact Support</Button>
        </div>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">FAQs</h3>
          <div className="space-y-3">
            {['How does SwarmShield protect my income?', 'When will I receive my payout?', 'What events trigger a claim?', 'How is my risk level calculated?', 'Can I change my protection plan?'].map((q, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <span className="text-sm text-slate-700">{q}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Contact Us</h3>
          <div className="space-y-3">
            <a href="mailto:support@swarmshield.app" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <MessageCircle size={20} className="text-violet-600" />
              <span className="text-sm text-slate-700">support@swarmshield.app</span>
            </a>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Phone size={20} className="text-violet-600" />
              <span className="text-sm text-slate-700">+91 1800 123 4567</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChangePlanScreen({ onBack }: { onBack: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgrade = () => {
    setShowSuccess(true);
  };

  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Change Plan" onBack={onBack} />

      <div className="px-5 py-6 space-y-5">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Choose Your Plan</h3>
          <div className="space-y-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedPlan === plan.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      {plan.name}
                      {plan.popular && <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-xs rounded-full">Popular</span>}
                    </p>
                    <p className="text-sm text-slate-500">Coverage: {plan.coverage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">₹{plan.price}</p>
                    <p className="text-xs text-slate-500">/week</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {plan.features.map((f, i) => (
                    <p key={i} className="text-xs text-slate-500 flex items-center gap-2">
                      <Check size={12} className="text-emerald-500" /> {f}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Button onClick={handleUpgrade}>Upgrade to {plans.find(p => p.id === selectedPlan)?.name}</Button>
      </div>

      {showSuccess && <SuccessModal message="Plan upgraded successfully!" onClose={() => { setShowSuccess(false); onBack(); }} />}
    </div>
  );
}

function PaymentMethodScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState('1');
  const [showAdd, setShowAdd] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Payment Method" onBack={onBack} />

      <div className="px-5 py-6 space-y-5">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Saved Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelected(method.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${selected === method.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === method.id ? 'border-violet-500' : 'border-slate-300'}`}>
                  {selected === method.id && <div className="w-3 h-3 rounded-full bg-violet-500"></div>}
                </div>
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                  <CreditCard size={18} className="text-slate-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900">{method.type === 'card' ? `•••• ${method.last4}` : method.last4}</p>
                  <p className="text-xs text-slate-500">{method.bank || 'UPI'} {method.expiry ? `• ${method.expiry}` : ''}</p>
                </div>
                {method.isDefault && <span className="text-xs text-emerald-600 font-medium">Default</span>}
              </button>
            ))}
          </div>
        </Card>

        <Button variant="secondary" onClick={() => setShowAdd(true)}>+ Add New Method</Button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-[420px] bg-white rounded-t-3xl p-6 pb-10 animate-slide-up">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Payment Method</h3>
            <div className="space-y-4 mb-6">
              <div className="relative">
                <label className="absolute left-4 -top-2.5 text-xs bg-white px-2 text-slate-500">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-violet-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <label className="absolute left-4 -top-2.5 text-xs bg-white px-2 text-slate-500">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                </div>
                <div className="flex-1 relative">
                  <label className="absolute left-4 -top-2.5 text-xs bg-white px-2 text-slate-500">CVV</label>
                  <input type="text" placeholder="123" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                </div>
              </div>
            </div>
            <Button onClick={() => { setShowAdd(false); setShowSuccess(true); }}>Add Card</Button>
          </div>
        </div>
      )}

      {showSuccess && <SuccessModal message="Card added successfully!" onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

function CancelPolicyScreen({ onBack }: { onBack: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Cancel Policy" onBack={onBack} />

      <div className="px-5 py-6 space-y-5">
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Cancel Your Policy?</h3>
          <p className="text-sm text-slate-500 text-center mb-4">
            You'll lose all protection coverage and won't be able to claim for any future disruptions. Your remaining coverage period will end immediately.
          </p>
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-500">Policy</span><span className="text-sm font-medium">{userData.policyId}</span></div>
            <div className="flex justify-between"><span className="text-sm text-slate-500">Coverage Ends</span><span className="text-sm font-medium text-red-600">Today</span></div>
          </div>
          <Button variant="danger" onClick={() => setShowConfirm(true)}>Cancel Policy</Button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 text-center animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Keep Policy</Button>
              <Button variant="danger" onClick={() => { setShowConfirm(false); setShowSuccess(true); }}>Yes, Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && <SuccessModal message="Policy cancelled successfully" onClose={() => { setShowSuccess(false); onBack(); }} />}
    </div>
  );
}

function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Terms of Service" onBack={onBack} />
      <div className="px-5 py-6">
        <Card>
          <div className="space-y-4 text-sm text-slate-600">
            <h3 className="font-semibold text-slate-900">1. Acceptance of Terms</h3>
            <p>By accessing and using SwarmShield X, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            
            <h3 className="font-semibold text-slate-900">2. Description of Service</h3>
            <p>SwarmShield X provides AI-powered income protection for gig workers. Our service monitors weather conditions and demand patterns to protect your earnings during disruptions.</p>
            
            <h3 className="font-semibold text-slate-900">3. Coverage and Claims</h3>
            <p>Coverage is provided based on the plan you select. Claims are processed automatically when parametric triggers are met. Payment is made via UPI within 24 hours of claim verification.</p>
            
            <h3 className="font-semibold text-slate-900">4. Premium Payments</h3>
            <p>Weekly premiums are auto-deducted from your registered payment method. Failure to pay may result in suspension of coverage.</p>
            
            <h3 className="font-semibold text-slate-900">5. Cancellation</h3>
            <p>You may cancel your policy at any time through the app. Cancellation takes effect immediately and no refunds are provided for the current period.</p>
            
            <h3 className="font-semibold text-slate-900">6. Limitation of Liability</h3>
            <p>SwarmShield X's liability is limited to the coverage amount specified in your selected plan. We are not liable for indirect or consequential damages.</p>
            
            <h3 className="font-semibold text-slate-900">7. Changes to Terms</h3>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of new terms.</p>
            
            <h3 className="font-semibold text-slate-900">8. Contact</h3>
            <p>For questions about these terms, contact us at support@swarmshield.app</p>
            
            <p className="text-xs text-slate-400">Last updated: March 20, 2026</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PrivacyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-slate-100">
      <Header title="Privacy Policy" onBack={onBack} />
      <div className="px-5 py-6">
        <Card>
          <div className="space-y-4 text-sm text-slate-600">
            <h3 className="font-semibold text-slate-900">1. Information We Collect</h3>
            <p>We collect information you provide directly, including your name, phone number, email, and payment information. We also collect location data and usage patterns to provide personalized protection services.</p>
            
            <h3 className="font-semibold text-slate-900">2. How We Use Your Information</h3>
            <p>We use your information to process claims, send notifications about weather risks, improve our AI models, and provide customer support. We never sell your personal data to third parties.</p>
            
            <h3 className="font-semibold text-slate-900">3. Data Security</h3>
            <p>We implement industry-standard encryption and security measures to protect your data. Payment information is processed through PCI-DSS compliant payment gateways.</p>
            
            <h3 className="font-semibold text-slate-900">4. Location Data</h3>
            <p>Location data is used only during active sessions to verify your zone for claim processing. We do not track your location continuously or store location history.</p>
            
            <h3 className="font-semibold text-slate-900">5. Third-Party Services</h3>
            <p>We use third-party services for weather data (OpenWeather), mapping (Mapbox), and payments (Razorpay). These services have their own privacy policies.</p>
            
            <h3 className="font-semibold text-slate-900">6. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@swarmshield.app for any data-related requests.</p>
            
            <h3 className="font-semibold text-slate-900">7. Cookies</h3>
            <p>We use essential cookies for app functionality and analytics cookies (with consent) to understand how you use our app.</p>
            
            <h3 className="font-semibold text-slate-900">8. Children's Privacy</h3>
            <p>Our service is not intended for users under 18 years of age. We do not knowingly collect data from minors.</p>
            
            <h3 className="font-semibold text-slate-900">9. Contact</h3>
            <p>For privacy concerns, contact our Data Protection Officer at privacy@swarmshield.app</p>
            
            <p className="text-xs text-slate-400">Last updated: March 20, 2026</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function BottomNav({ currentTab, onTabChange }: { currentTab: string; onTabChange: (tab: string) => void }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'payouts', icon: Wallet, label: 'Payouts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 px-4 pt-2 pb-8 z-40">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}>
              <div className={`p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : ''} />
              </div>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============== MAIN APP ==============
export default function App() {
  const [screen, setScreen] = useState<'login' | 'otp' | 'home' | 'map' | 'payouts' | 'profile' | 'settings' | 'support' | 'changeplan' | 'payment' | 'cancel' | 'terms' | 'privacy'>('login');

  const navigate = (tab: string) => setScreen(tab as typeof screen);
  const goHome = () => setScreen('home');
  const goBack = () => {
    const backMap: Record<string, string> = {
      otp: 'login', settings: 'profile', support: 'profile', changeplan: 'settings',
      payment: 'settings', cancel: 'settings', terms: 'profile', privacy: 'profile'
    };
    setScreen(backMap[screen] as typeof screen || 'profile');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[420px] h-screen sm:h-[900px] bg-white sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 relative flex flex-col">
        <main className="flex-1 overflow-y-auto pb-24">
          {screen === 'login' && <LoginScreen onContinue={() => setScreen('otp')} />}
          {screen === 'otp' && <OTPScreen onVerify={goHome} onBack={goBack} />}
          {screen === 'home' && <HomeScreen onNavigate={navigate} />}
          {screen === 'map' && <MapScreen />}
          {screen === 'payouts' && <PayoutsScreen />}
          {screen === 'profile' && <ProfileScreen onNavigate={navigate} />}
          {screen === 'settings' && <SettingsScreen onBack={goBack} />}
          {screen === 'support' && <SupportScreen onBack={goBack} />}
          {screen === 'changeplan' && <ChangePlanScreen onBack={goBack} />}
          {screen === 'payment' && <PaymentMethodScreen onBack={goBack} />}
          {screen === 'cancel' && <CancelPolicyScreen onBack={goBack} />}
          {screen === 'terms' && <TermsScreen onBack={goBack} />}
          {screen === 'privacy' && <PrivacyScreen onBack={goBack} />}
        </main>
        {!['login', 'otp', 'settings', 'support', 'changeplan', 'payment', 'cancel', 'terms', 'privacy'].includes(screen) && (
          <BottomNav currentTab={screen} onTabChange={navigate} />
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: translate(-50%, -20px) scale(0.8); } 60% { transform: translate(-50%, 0) scale(1.1); } 100% { opacity: 1; transform: translate(-50%, 0) scale(1); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.5s ease-out 0.2s backwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-slide-up-delay { animation: slide-up 0.5s ease-out 0.15s backwards; }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.32, 0.72, 0, 1); }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
