import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import SeverityBadge from './SeverityBadge';

const AlertDetailModal = ({ alert, open, onOpenChange, onUpdate }) => {
  const handleMarkAsRead = async () => {
    try {
      const updated = await pb.collection('alerts').update(
        alert.id,
        { status: 'Read' },
        { $autoCancel: false }
      );
      toast.success('Alert marked as read');
      onUpdate(updated);
    } catch (error) {
      toast.error('Failed to update alert');
      console.error(error);
    }
  };

  const handleResolve = async () => {
    try {
      const updated = await pb.collection('alerts').update(
        alert.id,
        { status: 'Resolved' },
        { $autoCancel: false }
      );
      toast.success('Alert resolved');
      onUpdate(updated);
    } catch (error) {
      toast.error('Failed to resolve alert');
      console.error(error);
    }
  };

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary mono-font">Alert Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mono-font">Alert Type</Label>
              <p className="text-foreground font-medium mt-1">{alert.alertType}</p>
            </div>
            <div>
              <Label className="text-muted-foreground mono-font">Severity</Label>
              <div className="mt-1">
                <SeverityBadge severity={alert.severity} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mono-font">Device Name</Label>
              <p className="text-foreground font-medium mt-1">{alert.deviceName || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground mono-font">Status</Label>
              <p className="text-foreground font-medium mt-1">{alert.status}</p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground mono-font">Description</Label>
            <p className="text-foreground mt-1">{alert.description}</p>
          </div>

          <div>
            <Label className="text-muted-foreground mono-font">Timestamp</Label>
            <p className="text-foreground font-medium mono-font mt-1">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>

          <div>
            <Label className="text-muted-foreground mono-font">Alert ID</Label>
            <p className="text-foreground font-medium mono-font mt-1">{alert.id}</p>
          </div>
        </div>

        <DialogFooter>
          {alert.status === 'Unread' && (
            <Button variant="outline" onClick={handleMarkAsRead}>
              Mark as Read
            </Button>
          )}
          {alert.status !== 'Resolved' && (
            <Button onClick={handleResolve}>Resolve Alert</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailModal;