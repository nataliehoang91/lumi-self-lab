"use client";

import { useEffect, useState } from "react";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type Prefs = {
  reminderEmailEnabled: boolean;
  reminderTimeSlot: string;
};

const TIME_SLOTS = [
  { value: "morning", label: "Morning (8am UTC)" },
  { value: "afternoon", label: "Afternoon (1pm UTC)" },
  { value: "evening", label: "Evening (6pm UTC)" },
];

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/notification-preferences")
      .then((r) => r.json())
      .then((data: Prefs) => setPrefs(data))
      .catch(() => setError("Failed to load preferences"));
  }, []);

  async function save(update: Partial<Prefs>) {
    if (!prefs) return;
    const next = { ...prefs, ...update };
    setPrefs(next);
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/users/notification-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <IndividualContainer>
      <div className="max-w-xl">
        <h1 className="mb-1 text-2xl font-bold">Notification preferences</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Control when and how SelfWithin emails you.
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email reminders</CardTitle>
            <CardDescription>
              Get a daily nudge to check in on your active experiments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {prefs === null ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <label htmlFor="email-toggle" className="text-sm font-medium">
                    Email reminders
                  </label>
                  <Switch
                    id="email-toggle"
                    checked={prefs.reminderEmailEnabled}
                    onCheckedChange={(checked) => save({ reminderEmailEnabled: checked })}
                    disabled={saving}
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium">Reminder time</p>
                  <div className="space-y-2">
                    {TIME_SLOTS.map((slot) => (
                      <label
                        key={slot.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/40 has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-orange-950/20"
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.value}
                          checked={prefs.reminderTimeSlot === slot.value}
                          onChange={() => save({ reminderTimeSlot: slot.value })}
                          disabled={saving || !prefs.reminderEmailEnabled}
                          className="accent-orange-500"
                        />
                        <span className="text-sm">{slot.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {(saving || saved) && (
                  <p className="text-xs text-muted-foreground">
                    {saving ? "Saving…" : "Saved"}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </IndividualContainer>
  );
}
