"use client";

import { track } from "@vercel/analytics/react";

export type FunnelEvent =
  | "landing_view"
  | "demo_opened"
  | "create_started"
  | "create_step_completed"
  | "advanced_customization_opened"
  | "rakhi_generated"
  | "generation_failed"
  | "whatsapp_share_clicked"
  | "native_share_clicked"
  | "gift_loaded"
  | "gift_opened"
  | "gift_revealed"
  | "gift_accepted"
  | "shagun_clicked"
  | "wrist_photo_started"
  | "recipient_create_clicked";

export type FunnelProperties = Partial<{
  recipient_type: "brother" | "sister" | "cousin" | "chosen-sibling";
  template: string;
  source: string;
  step: number;
  has_song: boolean;
  has_upi: boolean;
  is_recipient_loop: boolean;
  storage_mode: "firebase" | "embedded";
  error_code: "validation" | "storage" | "share";
}>;

export function trackFunnel(event: FunnelEvent, properties: FunnelProperties = {}) {
  try {
    track(event, properties);
  } catch {
    // Analytics must never interrupt the gift flow.
  }
}

