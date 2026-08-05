import apiClient from './apiClient';

import type {
    DashboardSummary,
} from '../types/dashboard';

export async function getDashboardSummary():
    Promise<DashboardSummary> {
    const response =
        await apiClient.get<DashboardSummary>(
            '/api/dashboard/summary',
        );

    return response.data;
}