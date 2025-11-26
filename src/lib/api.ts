export interface DashboardData {
    totalMembers: number;
    totalMerchants: number;
    totalApiRequests: number;
    totalTransactions: number;
    dailyTransactions: { date: string; amount: number }[];
    monthlyTransactions: { month: string; amount: number }[];
    categoryRatio: { name: string; value: number }[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
    // Assuming the backend is running on localhost:8080 and proxy is set up or CORS is allowed
    // If you have a specific base URL, replace 'http://localhost:8080'
    const response = await fetch('http://localhost:8000/api/v1/dashboard', {
        cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
};
