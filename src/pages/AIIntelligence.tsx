import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Brain, AlertTriangle, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function AIIntelligence() {
  const { state, dispatch } = useApp();
  const hasApiKey = !!state.settings.aiApiKey;

  const handleGenerateReport = () => {
    if (!hasApiKey) {
      toast.error('Please configure an AI API key in Settings first');
      return;
    }
    toast.success('AI report generation initiated');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Intelligence</h1>
          <p className="text-muted-foreground">AI-powered insights and automated analysis</p>
        </div>

        {!hasApiKey ? (
          <div className="bg-card border border-warning/30 rounded-lg p-8">
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                <Key className="w-8 h-8 text-warning" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                AI API Key Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Connect an AI API key to enable intelligent report generation, anomaly detection, 
                and predictive maintenance recommendations.
              </p>
              <div className="flex items-center gap-2 text-warning text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Configure your API key in Settings → API Keys</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Generation */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Report Generation</h3>
                  <p className="text-sm text-muted-foreground">Generate intelligent operation reports</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <select className="w-full p-2 rounded-md bg-secondary border border-border text-foreground">
                    <option value="operational">Operational Summary</option>
                    <option value="maintenance">Maintenance Predictions</option>
                    <option value="performance">Performance Analysis</option>
                    <option value="anomaly">Anomaly Detection</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <select className="w-full p-2 rounded-md bg-secondary border border-border text-foreground">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Additional Context (Optional)</Label>
                  <Textarea 
                    placeholder="Add any specific areas of focus or concerns..."
                    className="min-h-24"
                  />
                </div>
                <Button className="w-full" onClick={handleGenerateReport}>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent AI Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Maintenance Alert</span>
                    <span className="badge-warning">Medium Priority</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Drone Osprey-4 shows battery degradation patterns. Recommend inspection within 48 hours.
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Performance Trend</span>
                    <span className="badge-active">Positive</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mission success rate increased 3% this month. Optimal weather conditions and reduced equipment failures.
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Scheduling Optimization</span>
                    <span className="badge-muted">Suggestion</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider shifting SF patrols 2 hours earlier to avoid afternoon wind patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
