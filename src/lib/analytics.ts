'use client';

/**
 * @fileoverview
 * This file contains a placeholder for an analytics tracking service.
 * In a real application, this would be replaced with an integration like
 * Mixpanel, Google Analytics 4, PostHog, etc.
 */

// Define the types for the events as per the user's request.
type AnalyticsEvent =
  | {
      eventName: 'dashboard_viewed';
      properties: {
        userId: string;
        role: string;
        timestamp: string;
        filters?: Record<string, any>;
      };
    }
  | {
      eventName: 'kpi_card_clicked';
      properties: {
        kpi_name: string;
        userId: string;
        timestamp: string;
      };
    }
  | {
      eventName: 'report_opened';
      properties: {
        report_id: string;
        patient_id?: string;
        opened_from: 'dashboard_evolutions_card' | 'dashboard_activity_feed' | 'patient_profile';
      };
    }
  | {
      eventName: 'task_marked_done';
      properties: {
        task_id: string;
        userId: string;
        old_status: string;
        new_status: string;
      };
    }
  | {
      eventName: 'quick_action';
      properties: {
        action: string;
        target_type: string;
        target_id?: string;
      };
    }
  | {
      eventName: 'filter_changed';
      properties: {
        page: 'dashboard_activity_feed';
        new_filters: Record<string, any>;
      };
    }
  | {
      eventName: 'notification_clicked';
      properties: {
        notification_id: string;
        type: string;
        target_url: string;
      };
    };

/**
 * Placeholder function to track analytics events.
 * This simulates sending data to an analytics service.
 * @param event - The event object containing the event name and properties.
 */
export function trackEvent(event: AnalyticsEvent): void {
  // In a real implementation, you would use your analytics library here.
  // For example: `mixpanel.track(event.eventName, event.properties);`
  console.log(`[Analytics] Event: ${event.eventName}`, event.properties);
}
