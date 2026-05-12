import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - SecurityScan Pro</title>
        <meta name="description" content="Login to your SecurityScan Pro account to monitor your network security" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md cyber-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-primary neon-glow" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary neon-text mono-font">
              SecurityScan Pro
            </CardTitle>
            <p className="text-muted-foreground mt-2">Access your security dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="admin@securityscan.pro"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full neon-glow"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;