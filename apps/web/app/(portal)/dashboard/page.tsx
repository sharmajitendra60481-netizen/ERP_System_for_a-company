'use client'

import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Factory
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts"

const salesData = [
  { name: 'Jan', revenue: 420000, expenses: 240000 },
  { name: 'Feb', revenue: 380000, expenses: 210000 },
  { name: 'Mar', revenue: 510000, expenses: 310000 },
  { name: 'Apr', revenue: 490000, expenses: 280000 },
  { name: 'May', revenue: 620000, expenses: 350000 },
  { name: 'Jun', revenue: 750000, expenses: 410000 },
  { name: 'Jul', revenue: 890000, expenses: 480000 },
]

const productionData = [
  { name: 'Soyabean Oil', planned: 50000, actual: 48500 },
  { name: 'Mustard Oil', planned: 35000, actual: 36200 },
  { name: 'Palm Olein', planned: 40000, actual: 39500 },
  { name: 'Sunflower Oil', planned: 25000, actual: 24800 },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    {
      title: "Monthly Sales Revenue",
      value: "₹89.4 Lakh",
      change: "+14.2%",
      isPositive: true,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Edible Oil Processed",
      value: "1,49,000",
      unit: "Liters",
      change: "+8.5%",
      isPositive: true,
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "FSSAI Quality Approvals",
      value: "100%",
      change: "Pass",
      isPositive: true,
      icon: CheckCircle2,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Tanker Dispatches",
      value: "4",
      change: "In Transit",
      isPositive: true,
      icon: Factory,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edible Oils Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.name}. Food Processing Plant Telemetry & Live Sales.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                  {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
              </div>
              
              <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                  {stat.unit && <span className="text-slate-500 font-medium text-sm">{stat.unit}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Edible Oil Revenue & Expenses (₹)</h2>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Expenses (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Edible Oil Production */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Edible Oil Production vs Target (Liters)</h2>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="planned" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Target (L)" />
                <Bar dataKey="actual" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Actual Output (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Recent Plant Activity</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {[
            { user: "Rajesh Kumar", action: "approved refining batch", target: "PB-SOYA-2024-001", time: "2 hours ago", type: "production" },
            { user: "Priya Sharma", action: "generated GST invoice", target: "INV-2024-0089", time: "4 hours ago", type: "finance" },
            { user: "Quality Lab", action: "certified FFA % & Moisture levels", target: "COA-MUSTARD-89", time: "5 hours ago", type: "alert" },
            { user: "Suresh Yadav", action: "received raw material", target: "Crude Soyabean Degummed Oil (50,000 L)", time: "1 day ago", type: "inventory" },
          ].map((activity, idx) => (
            <div key={idx} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                activity.type === 'alert' ? "bg-emerald-100 text-emerald-600" :
                activity.type === 'finance' ? "bg-blue-100 text-blue-600" :
                activity.type === 'production' ? "bg-amber-100 text-amber-600" :
                "bg-indigo-100 text-indigo-600"
              )}>
                {activity.type === 'alert' ? <CheckCircle2 className="w-5 h-5" /> :
                 activity.type === 'finance' ? <DollarSign className="w-5 h-5" /> :
                 activity.type === 'production' ? <Factory className="w-5 h-5" /> :
                 <Package className="w-5 h-5" />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
