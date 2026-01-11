import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AutoDCLogo } from '@/components/brand/AutoDCLogo';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12">
        <AutoDCLogo size="lg" showText />

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-foreground">
            Command your drone fleet with precision
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time monitoring, intelligent scheduling, and comprehensive analytics 
            for enterprise autonomous drone operations.
          </p>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Live Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>AI Intelligence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Fleet Command</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2026 AutoDC. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <AutoDCLogo size="xl" />
            <h1 className="text-2xl font-bold text-foreground mt-4">AutoDC</h1>
            <p className="text-sm text-muted-foreground">Enterprise Autonomous Command</p>
          </div>

          {/* Desktop: Centered Logo */}
          <div className="hidden lg:flex flex-col items-center mb-8">
            <AutoDCLogo size="xl" />
            <h1 className="text-2xl font-bold text-foreground mt-4">AutoDC</h1>
            <p className="text-sm text-muted-foreground">Enterprise Autonomous Drone Command</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your command center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign up
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo credentials:</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium text-foreground">Admin</p>
                <p className="text-muted-foreground">admin@autodc.com</p>
                <p className="text-muted-foreground">admin123</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium text-foreground">Operator</p>
                <p className="text-muted-foreground">operator@autodc.com</p>
                <p className="text-muted-foreground">operator123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
