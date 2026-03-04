"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

interface Organisation {
  id: string;
  name: string;
}

interface PrivacyReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  organisations: Organisation[];
  selectedOrgId: string | null;
  onOrgSelect: (orgId: string) => void;
}

export function PrivacyReminderDialog({
  open,
  onOpenChange,
  onConfirm,
  organisations,
  selectedOrgId,
  onOrgSelect,
}: PrivacyReminderDialogProps) {
  const handleConfirm = () => {
    if (organisations.length > 1 && !selectedOrgId) {
      return; // Require org selection if multiple
    }
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="text-primary h-5 w-5" />
            Privacy Protected
          </DialogTitle>
          <DialogDescription>
            Before you link this experiment to an organisation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organisation Selection (if multiple) */}
          {organisations.length > 1 && (
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Select Organisation
              </label>
              <Select value={selectedOrgId || ""} onValueChange={onOrgSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organisations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* What Org Will See */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Your organisation will see:
            </h3>
            <ul className="text-muted-foreground ml-6 space-y-2 text-sm">
              <li>• Aggregate patterns (e.g., &quot;Team mood averages 7.2/10&quot;)</li>
              <li>• Participation rates</li>
              <li>
                • Trend insights (e.g., &quot;Focus scores are 15% higher on
                Tuesdays&quot;)
              </li>
            </ul>
          </div>

          {/* What Org Will NOT See */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2 font-semibold">
              <XCircle className="h-4 w-4 text-red-600" />
              Your organisation will NOT see:
            </h3>
            <ul className="text-muted-foreground ml-6 space-y-2 text-sm">
              <li>• Your personal reflections</li>
              <li>• Your text responses</li>
              <li>• Your individual check-in data</li>
              <li>• Your name attached to specific data points</li>
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="bg-muted/50 border-border rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">
              Think of it like a weather report: useful patterns emerge, but no one knows
              if it rained on your specific street.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={organisations.length > 1 && !selectedOrgId}
              className="flex-1"
            >
              I understand, continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
