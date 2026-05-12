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

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.passwordConfirm, formData.name);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - SecurityScan Pro</title>
        <meta name="description" content="Create your SecurityScan Pro account to start monitoring your network security" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md cyber-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-primary neon-glow" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary neon-text mono-font">
              Create Account
            </CardTitle>
            <p className="text-muted-foreground mt-2">Start protecting your network today</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="you@example.com"
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
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <Label htmlFor="passwordConfirm" className="text-foreground">Confirm Password</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="Re-enter password"
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
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignupPage;