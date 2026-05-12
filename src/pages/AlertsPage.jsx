import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeverityBadge from '@/components/SeverityBadge';
import AlertDetailModal from '@/components/AlertDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AlertsPage = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlerts();
  }, [currentUser]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchQuery, severityFilter, statusFilter]);

  const fetchAlerts = async () => {
    try {
      const data = await pb.collection('alerts').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-timestamp',
        $autoCancel: false,
      });
      setAlerts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.deviceName && a.deviceName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((a) => a.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAlerts(filtered);
    setCurrentPage(1);
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setModalOpen(true);
  };

  const handleAlertUpdate = (updatedAlert) => {
    setAlerts(alerts.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)));
    setSelectedAlert(updatedAlert);
  };

  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

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
        <title>Alerts - SecurityScan Pro</title>
        <meta name="description" content="View and manage security alerts for your network" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary neon-text mono-font mb-2">
              Security Alerts
            </h1>
            <p className="text-muted-foreground">Monitor and respond to security events</p>
          </div>

          <Card className="cyber-border mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background text-foreground"
                    />
                  </div>
                </div>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-background text-foreground">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background text-foreground">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Unread">Unread</SelectItem>
                    <SelectItem value="Read">Read</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="text-primary mono-font">
                {filteredAlerts.length} Alerts Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Timestamp</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Type</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Severity</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Device</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Description</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground mono-font text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-border hover:bg-muted transition-colors duration-200">
                        <td className="py-3 px-4 text-foreground mono-font text-sm">
                          {new Date(alert.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-foreground text-sm">{alert.alertType}</td>
                        <td className="py-3 px-4">
                          <SeverityBadge severity={alert.severity} />
                        </td>
                        <td className="py-3 px-4 text-foreground text-sm">{alert.deviceName || 'N/A'}</td>
                        <td className="py-3 px-4 text-foreground text-sm max-w-xs truncate">
                          {alert.description}
                        </td>
                        <td className="py-3 px-4 text-foreground text-sm">{alert.status}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAlertClick(alert)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredAlerts.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No alerts found matching your filters</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground mono-font">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />

        <AlertDetailModal
          alert={selectedAlert}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onUpdate={handleAlertUpdate}
        />
      </div>
    </>
  );
};

export default AlertsPage;