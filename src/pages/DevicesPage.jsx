import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import DeviceDetailModal from '@/components/DeviceDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DevicesPage = () => {
  const { currentUser } = useAuth();
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, [currentUser]);

  useEffect(() => {
    filterDevices();
  }, [devices, searchQuery, deviceTypeFilter, riskLevelFilter]);

  const fetchDevices = async () => {
    try {
      const data = await pb.collection('devices').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false,
      });
      setDevices(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      setLoading(false);
    }
  };

  const filterDevices = () => {
    let filtered = [...devices];

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.ipAddress.includes(searchQuery)
      );
    }

    if (deviceTypeFilter !== 'all') {
      filtered = filtered.filter((d) => d.deviceType === deviceTypeFilter);
    }

    if (riskLevelFilter !== 'all') {
      filtered = filtered.filter((d) => d.riskLevel === riskLevelFilter);
    }

    setFilteredDevices(filtered);
  };

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setModalOpen(true);
  };

  const handleDeviceUpdate = (updatedDevice) => {
    setDevices(devices.map((d) => (d.id === updatedDevice.id ? updatedDevice : d)));
    setSelectedDevice(updatedDevice);
  };

  const getRiskColor = (level) => {
    if (level === 'High') return 'text-destructive';
    if (level === 'Medium') return 'text-warning';
    return 'text-success';
  };

  const deviceTypes = [...new Set(devices.map((d) => d.deviceType))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Skeleton className="h-12 w-64 mb-8 bg-muted" />
          <Skeleton className="h-96 bg-muted" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Devices - SecurityScan Pro</title>
        <meta name="description" content="Manage and monitor all devices on your network" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary neon-text mono-font mb-2">
              Network Devices
            </h1>
            <p className="text-muted-foreground">Monitor and manage all devices on your network</p>
          </div>

          <Card className="cyber-border mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or IP address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background text-foreground"
                    />
                  </div>
                </div>

                <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
                  <SelectTrigger className="bg-background text-foreground">
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                  <SelectTrigger className="bg-background text-foreground">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="text-primary mono-font">
                {filteredDevices.length} Devices Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Device Name</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">IP Address</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">MAC Address</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Type</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Risk</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.map((device) => (
                      <tr key={device.id} className="border-b border-border hover:bg-muted transition-colors duration-200">
                        <td className="py-3 px-4 text-foreground font-medium">{device.deviceName}</td>
                        <td className="py-3 px-4 text-foreground mono-font text-sm">{device.ipAddress}</td>
                        <td className="py-3 px-4 text-foreground mono-font text-sm">{device.macAddress}</td>
                        <td className="py-3 px-4 text-foreground text-sm">{device.deviceType}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={device.status} />
                        </td>
                        <td className={`py-3 px-4 font-semibold ${getRiskColor(device.riskLevel)}`}>
                          {device.riskLevel}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeviceClick(device)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredDevices.length === 0 && (
                  <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No devices found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />

        <DeviceDetailModal
          device={selectedDevice}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onUpdate={handleDeviceUpdate}
        />
      </div>
    </>
  );
};

export default DevicesPage;