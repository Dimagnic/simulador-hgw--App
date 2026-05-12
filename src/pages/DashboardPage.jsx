import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SecurityScoreGauge from '@/components/SecurityScoreGauge';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import SeverityBadge from '@/components/SeverityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor, Wifi, AlertTriangle, Activity, PieChart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const [devicesData, alertsData] = await Promise.all([
        pb.collection('devices').getFullList({ filter: `userId = "${currentUser.id}"`, $autoCancel: false }),
        pb.collection('alerts').getFullList({ filter: `userId = "${currentUser.id}"`, sort: '-timestamp', $autoCancel: false }),
      ]);

      setDevices(devicesData);
      setAlerts(alertsData);
      calculateSecurityScore(devicesData, alertsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const calculateSecurityScore = (devicesData, alertsData) => {
    let score = 100;
    const criticalAlerts = alertsData.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
    const warningAlerts = alertsData.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
    const highRiskDevices = devicesData.filter(d => d.riskLevel === 'High').length;
    const unknownDevices = devicesData.filter(d => !d.isKnown).length;

    score -= criticalAlerts * 15;
    score -= warningAlerts * 5;
    score -= highRiskDevices * 10;
    score -= unknownDevices * 8;

    setSecurityScore(Math.max(0, Math.min(100, score)));
  };

  const getNetworkStatus = () => {
    if (securityScore >= 80) return 'Secure';
    if (securityScore >= 60) return 'Warning';
    return 'Critical';
  };

  const onlineDevices = devices.filter(d => d.status === 'Online').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const suspiciousActivities = alerts.filter(a => a.alertType === 'Suspicious Activity').length;

  const deviceTypeData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.deviceType);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: device.deviceType, value: 1 });
    }
    return acc;
  }, []);

  const riskDistributionData = [
    { name: 'Low', value: devices.filter(d => d.riskLevel === 'Low').length },
    { name: 'Medium', value: devices.filter(d => d.riskLevel === 'Medium').length },
    { name: 'High', value: devices.filter(d => d.riskLevel === 'High').length },
  ];

  const securityEventsData = [
    { time: '00:00', events: 3 },
    { time: '04:00', events: 1 },
    { time: '08:00', events: 5 },
    { time: '12:00', events: 8 },
    { time: '16:00', events: 6 },
    { time: '20:00', events: 4 },
  ];

  const networkActivityData = [
    { hour: '00-04', activity: 12 },
    { hour: '04-08', activity: 8 },
    { hour: '08-12', activity: 24 },
    { hour: '12-16', activity: 32 },
    { hour: '16-20', activity: 28 },
    { hour: '20-24', activity: 16 },
  ];

  const COLORS = ['hsl(120 100% 50%)', 'hsl(35 100% 50%)', 'hsl(0 85% 60%)', 'hsl(200 100% 50%)'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 bg-muted" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SecurityScan Pro</title>
        <meta name="description" content="Monitor your network security in real-time with SecurityScan Pro dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary neon-text mono-font mb-2">
              Security Operations Center
            </h1>
            <p className="text-muted-foreground">Real-time network monitoring and threat detection</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="cyber-border">
              <CardContent className="p-6 flex justify-center">
                <SecurityScoreGauge score={securityScore} />
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <MetricCard
                title="Total Devices"
                value={devices.length}
                icon={Monitor}
                trend={`${onlineDevices} online`}
                delay={0.1}
              />
              <MetricCard
                title="Online Devices"
                value={onlineDevices}
                icon={Wifi}
                trend={`${devices.length - onlineDevices} offline`}
                delay={0.2}
              />
              <MetricCard
                title="Critical Alerts"
                value={criticalAlerts}
                icon={AlertTriangle}
                trend="Requires attention"
                delay={0.3}
              />
              <MetricCard
                title="Suspicious Activities"
                value={suspiciousActivities}
                icon={Activity}
                trend="Last 24 hours"
                delay={0.4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle className="text-primary mono-font flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SeverityBadge severity={alert.severity} />
                          <span className="text-xs text-muted-foreground mono-font">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.alertType}</p>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No alerts detected</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-border">
              <CardHeader>
                <CardTitle className="text-primary mono-font flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Devices by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle className="text-primary mono-font flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Security Events Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={securityEventsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Line type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="cyber-border">
              <CardHeader>
                <CardTitle className="text-primary mono-font flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Network Activity by Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={networkActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="activity" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;