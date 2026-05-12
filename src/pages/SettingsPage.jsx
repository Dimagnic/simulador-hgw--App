import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, Lock, Bell, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: '',
  });
  const [notifications, setNotifications] = useState({
    newDevice: true,
    suspiciousActivity: true,
    intrusionAttempt: true,
    unknownDevice: true,
  });
  const [scanSettings, setScanSettings] = useState({
    autoScanInterval: '60',
    networkRange: '192.168.1.0/24',
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ name: profileData.name });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        oldPassword: passwordData.oldPassword,
        password: passwordData.password,
        passwordConfirm: passwordData.passwordConfirm,
      });
      toast.success('Password changed successfully');
      setPasswordData({ oldPassword: '', password: '', passwordConfirm: '' });
    } catch (error) {
      toast.error('Failed to change password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success('Notification preferences updated');
  };

  const handleScanSettingsUpdate = (e) => {
    e.preventDefault();
    toast.success('Scan settings updated');
  };

  return (
    <>
      <Helmet>
        <title>Settings - SecurityScan Pro</title>
        <meta name="description" content="Manage your SecurityScan Pro account settings and preferences" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary neon-text mono-font mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="scan" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Scan Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="text-primary mono-font">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1 bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="mt-1 bg-muted text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="text-primary mono-font">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="oldPassword" className="text-foreground">Current Password</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        className="mt-1 bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                        className="mt-1 bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.passwordConfirm}
                        onChange={(e) => setPasswordData({ ...passwordData, passwordConfirm: e.target.value })}
                        className="mt-1 bg-background text-foreground"
                      />
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="text-primary mono-font">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">New Device Detected</p>
                      <p className="text-sm text-muted-foreground">Get notified when a new device joins your network</p>
                    </div>
                    <Switch
                      checked={notifications.newDevice}
                      onCheckedChange={() => handleNotificationToggle('newDevice')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Suspicious Activity</p>
                      <p className="text-sm text-muted-foreground">Alerts for unusual network behavior</p>
                    </div>
                    <Switch
                      checked={notifications.suspiciousActivity}
                      onCheckedChange={() => handleNotificationToggle('suspiciousActivity')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Intrusion Attempts</p>
                      <p className="text-sm text-muted-foreground">Critical security breach attempts</p>
                    </div>
                    <Switch
                      checked={notifications.intrusionAttempt}
                      onCheckedChange={() => handleNotificationToggle('intrusionAttempt')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Unknown Devices</p>
                      <p className="text-sm text-muted-foreground">Devices not marked as known</p>
                    </div>
                    <Switch
                      checked={notifications.unknownDevice}
                      onCheckedChange={() => handleNotificationToggle('unknownDevice')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scan">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="text-primary mono-font">Scan Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleScanSettingsUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="scanInterval" className="text-foreground">Auto-Scan Interval (minutes)</Label>
                      <Input
                        id="scanInterval"
                        type="number"
                        value={scanSettings.autoScanInterval}
                        onChange={(e) => setScanSettings({ ...scanSettings, autoScanInterval: e.target.value })}
                        className="mt-1 bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="networkRange" className="text-foreground">Network Range (CIDR)</Label>
                      <Input
                        id="networkRange"
                        value={scanSettings.networkRange}
                        onChange={(e) => setScanSettings({ ...scanSettings, networkRange: e.target.value })}
                        className="mt-1 bg-background text-foreground mono-font"
                      />
                    </div>

                    <Button type="submit">Save Scan Settings</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SettingsPage;