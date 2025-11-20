'use client';

import * as React from 'react';
import { mockTasks, patients as mockPatients, professionals, mockShiftReports, mockNotifications, initialShifts } from '@/lib/data';
import { trackEvent } from '@/lib/analytics';

/**
 * Simulates fetching dashboard summary data.
 * Corresponds to GET /dashboard/summary
 */
async function fetchDashboardSummary() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const openShiftsCount = initialShifts.filter(s => s.status === 'scheduled').length;
  const lateShiftsCount = initialShifts.filter(s => s.status === 'cancelled').length;
  const urgentTasksCount = mockTasks.filter(t => t.priority === 'Urgente' && t.status !== 'done').length;
  const pendingCommunicationsCount = mockNotifications.filter(n => !n.read).length;
  
  return {
    kpis: {
      vagasAbertas: openShiftsCount,
      plantoesComAlerta: lateShiftsCount,
      tarefasUrgentes: urgentTasksCount,
      comunicacoesPendentes: pendingCommunicationsCount,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Simulates fetching recent evolutions (reports).
 * Corresponds to GET /dashboard/recent-reports
 */
async function fetchRecentEvolutions() {
   await new Promise(resolve => setTimeout(resolve, 500));
   return mockShiftReports;
}

/**
 * Simulates fetching tasks.
 * Corresponds to GET /dashboard/tasks
 */
async function fetchTasks() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTasks;
}

/**
 * Simulates fetching all dashboard data in parallel.
 */
async function fetchAllDashboardData() {
    const [summary, evolutions, tasks] = await Promise.all([
        fetchDashboardSummary(),
        fetchRecentEvolutions(),
        fetchTasks(),
    ]);

    const allEvents = [...evolutions, ...mockNotifications, ...tasks]
        .sort((a, b) => new Date('reportDate' in a ? a.reportDate : 'timestamp' in a ? a.timestamp : a.dueDate || 0).getTime() - new Date('reportDate' in b ? b.reportDate : 'timestamp' in b ? b.timestamp : b.dueDate || 0).getTime());

    return {
        summary,
        evolutions,
        tasks,
        notifications: mockNotifications,
        activityEvents: allEvents.reverse(),
        patients: mockPatients,
        professionals,
        shifts: initialShifts, // Included for KPI calculation
    };
}


export function useDashboardData() {
    const [data, setData] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        setIsRefreshing(true);
        try {
            const dashboardData = await fetchAllDashboardData();
            setData(dashboardData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            // Handle error state if necessary
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        setIsLoading(true);
        fetchData();
        
        trackEvent({
            eventName: 'dashboard_viewed',
            properties: {
                userId: 'user-123', // Placeholder
                role: 'admin', // Placeholder
                timestamp: new Date().toISOString(),
            }
        })
    }, [fetchData]);

    return {
        data,
        isLoading,
        isRefreshing,
        refetch: fetchData,
    };
}
