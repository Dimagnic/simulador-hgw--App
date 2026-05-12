import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import StatusBadge from './StatusBadge';

const DeviceDetailModal = ({ device, open, onOpenChange, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    deviceName: device?.deviceName || '',
    riskLevel: device?.riskLevel || 'Low',
    notes: device?.notes || '',
    isKnown: device?.isKnown || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await pb.collection('devices').update(device.id, formData, { $autoCancel: false });
      toast.success('Device updated successfully');
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update device');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary mono-font">Device Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mono-font">Device Name</Label>
              {isEditing ? (
                <Input
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  className="mt-1 bg-background text-foreground"
                />
              ) : (
                <p className="text-foreground font-medium mt-1">{device.deviceName}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground mono-font">Status</Label>
              <div className="mt-1">
                <StatusBadge status={device.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mono-font">IP Address</Label>
              <p className="text-foreground font-medium mono-font mt-1">{device.ipAddress}</p>
            </div>
            <div>
              <Label className="text-muted-foreground mono-font">MAC Address</Label>
              <p className="text-foreground font-medium mono-font mt-1">{device.macAddress}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mono-font">Device Type</Label>
              <p className="text-foreground font-medium mt-1">{device.deviceType}</p>
            </div>
            <div>
              <Label className="text-muted-foreground mono-font">Manufacturer</Label>
              <p className="text-foreground font-medium mt-1">{device.manufacturer || 'Unknown'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mono-font">Risk Level</Label>
              {isEditing ? (
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                >
                  <SelectTrigger className="mt-1 bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-foreground font-medium mt-1">{device.riskLevel}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground mono-font">Known Device</Label>
              {isEditing ? (
                <Select
                  value={formData.isKnown ? 'true' : 'false'}
                  onValueChange={(value) => setFormData({ ...formData, isKnown: value === 'true' })}
                >
                  <SelectTrigger className="mt-1 bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-foreground font-medium mt-1">{device.isKnown ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground mono-font">Notes</Label>
            {isEditing ? (
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 bg-background text-foreground"
                rows={3}
              />
            ) : (
              <p className="text-foreground mt-1">{device.notes || 'No notes'}</p>
            )}
          </div>

          <div>
            <Label className="text-muted-foreground mono-font">Last Seen</Label>
            <p className="text-foreground font-medium mono-font mt-1">
              {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Device</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceDetailModal;