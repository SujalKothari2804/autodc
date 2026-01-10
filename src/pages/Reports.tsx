import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { analyticsData } from '@/data/mockData';
import { toast } from 'sonner';
import { useState } from 'react';

const CHART_COLORS = {
  primary: '#00ffff',
  secondary: '#00d4d4',
  muted: '#3b4a5a',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const PIE_COLORS = ['#00ffff', '#00d4d4', '#00a8a8', '#007a7a'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('30');

  const handleExportPDF = () => {
    const content = `
DRONE OPERATIONS REPORT
=======================
Generated: ${new Date().toISOString()}
Period: Last ${dateRange} days

SUMMARY
-------
Total Flight Hours: ${analyticsData.flightHoursPerMonth.reduce((sum, d) => sum + d.hours, 0)}
Total Missions: ${analyticsData.missionsPerType.reduce((sum, d) => sum + d.count, 0)}
Average Success Rate: ${(analyticsData.successRate.reduce((sum, d) => sum + d.rate, 0) / analyticsData.successRate.length).toFixed(1)}%

MISSIONS BY TYPE
----------------
${analyticsData.missionsPerType.map(d => `${d.type}: ${d.count}`).join('\n')}

INCIDENTS
---------
${analyticsData.incidentsByType.map(d => `${d.type}: ${d.count}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drone-ops-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const handleExportCSV = () => {
    const headers = ['Month', 'Flight Hours', 'Success Rate'];
    const rows = analyticsData.flightHoursPerMonth.map((d, i) => [
      d.month,
      d.hours,
      analyticsData.successRate[i]?.rate || 0,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drone-ops-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported to CSV');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-primary">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Performance metrics and operational insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={handleExportCSV}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleExportPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Flight Hours</p>
            <p className="text-2xl font-bold text-primary">
              {analyticsData.flightHoursPerMonth.reduce((sum, d) => sum + d.hours, 0)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Missions</p>
            <p className="text-2xl font-bold text-primary">
              {analyticsData.missionsPerType.reduce((sum, d) => sum + d.count, 0)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg Success Rate</p>
            <p className="text-2xl font-bold text-primary">
              {(analyticsData.successRate.reduce((sum, d) => sum + d.rate, 0) / analyticsData.successRate.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Incidents</p>
            <p className="text-2xl font-bold text-warning">
              {analyticsData.incidentsByType.reduce((sum, d) => sum + d.count, 0)}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flight Hours Chart */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Flight Hours by Month</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.flightHoursPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="hours" 
                    fill={CHART_COLORS.primary} 
                    radius={[4, 4, 0, 0]}
                    name="Hours"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Success Rate Chart */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Success Rate Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.successRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[80, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                    name="Success Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Missions by Type */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Missions by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.missionsPerType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {analyticsData.missionsPerType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {analyticsData.missionsPerType.map((entry, index) => (
                <div key={entry.type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.type}: {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Incidents by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.incidentsByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis type="category" dataKey="type" stroke="#6b7280" fontSize={12} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill={CHART_COLORS.warning} 
                    radius={[0, 4, 4, 0]}
                    name="Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
