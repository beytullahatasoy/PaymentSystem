import {
    Navigate,
    Route,
    Routes,
} from 'react-router';

import BankAccountDetailPage from '../pages/BankAccountDetailPage';
import CustomerDetailPage from '../pages/CustomerDetailPage';
import CustomersPage from '../pages/CustomersPage';
import DashboardPage from '../pages/DashboardPage';
import MerchantsPage from '../pages/MerchantsPage';
import NewPaymentPage from '../pages/NewPaymentPage';
import NotFoundPage from '../pages/NotFoundPage';
import TransactionsPage from '../pages/TransactionsPage';

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="/dashboard"
                element={<DashboardPage />}
            />

            <Route
                path="/customers"
                element={<CustomersPage />}
            />

            <Route
                path="/customers/:customerId"
                element={<CustomerDetailPage />}
            />

            <Route
                path="/bank-accounts/:bankAccountId"
                element={<BankAccountDetailPage />}
            />

            <Route
                path="/merchants"
                element={<MerchantsPage />}
            />

            <Route
                path="/payments/new"
                element={<NewPaymentPage />}
            />

            <Route
                path="/transactions"
                element={<TransactionsPage />}
            />

            <Route
                path="*"
                element={<NotFoundPage />}
            />
        </Routes>
    );
}

export default AppRoutes;