import {
    useEffect,
    useState,
} from 'react';

import { useNavigate } from 'react-router';

import AccountBalanceRoundedIcon from
    '@mui/icons-material/AccountBalanceRounded';

import AddCardRoundedIcon from
    '@mui/icons-material/AddCardRounded';

import CheckCircleRoundedIcon from
    '@mui/icons-material/CheckCircleRounded';

import GroupsRoundedIcon from
    '@mui/icons-material/GroupsRounded';

import PaymentsRoundedIcon from
    '@mui/icons-material/PaymentsRounded';

import PointOfSaleRoundedIcon from
    '@mui/icons-material/PointOfSaleRounded';

import ReceiptLongRoundedIcon from
    '@mui/icons-material/ReceiptLongRounded';

import StorefrontRoundedIcon from
    '@mui/icons-material/StorefrontRounded';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from
    '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from
    '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
    getDashboardSummary,
} from '../api/dashboardApi';

import type {
    DashboardSummary,
} from '../types/dashboard';

import {
    formatMoney,
} from '../utils/formatMoney';

function DashboardPage() {
    const navigate = useNavigate();

    const [
        summary,
        setSummary,
    ] = useState<DashboardSummary | null>(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const result =
                    await getDashboardSummary();

                setSummary(result);
            } catch {
                setErrorMessage(
                    'Dashboard data could not be loaded. Make sure the API is running.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadDashboard();
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 8,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (errorMessage || !summary) {
        return (
            <Box
                sx={{
                    padding: 4,
                }}
            >
                <Alert severity="error">
                    {errorMessage ??
                        'Dashboard data could not be found.'}
                </Alert>
            </Box>
        );
    }

    const summaryCards = [
        {
            title: 'Total Customers',
            value: summary.totalCustomers,
            icon: <GroupsRoundedIcon />,
        },
        {
            title: 'Bank Accounts',
            value: summary.totalBankAccounts,
            icon: <AccountBalanceRoundedIcon />,
        },
        {
            title: 'Active Cards',
            value: summary.activeCards,
            icon: <AddCardRoundedIcon />,
        },
        {
            title: 'Merchants',
            value: summary.totalMerchants,
            icon: <StorefrontRoundedIcon />,
        },
        {
            title: 'Total Transactions',
            value: summary.totalTransactions,
            icon: <ReceiptLongRoundedIcon />,
        },
        {
            title: 'Approved',
            value: summary.approvedTransactions,
            icon: <CheckCircleRoundedIcon />,
        },
        {
            title: 'Declined',
            value: summary.declinedTransactions,
            icon: <PointOfSaleRoundedIcon />,
        },
    ];

    return (
        <Box
            sx={{
                padding: 4,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    marginBottom: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Dashboard
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 1,
                            color: 'text.secondary',
                        }}
                    >
                        Monitor the current state of the
                        payment simulation environment.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={
                        <PaymentsRoundedIcon />
                    }
                    onClick={() =>
                        navigate('/payments/new')
                    }
                >
                    New Payment
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(4, minmax(0, 1fr))',
                    },
                    gap: 2,
                    marginBottom: 4,
                }}
            >
                {summaryCards.map((card) => (
                    <Paper
                        key={card.title}
                        sx={{
                            padding: 2.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'flex-start',
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    {card.title}
                                </Typography>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        marginTop: 1,
                                        fontWeight: 700,
                                    }}
                                >
                                    {card.value}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    display: 'grid',
                                    placeItems: 'center',
                                    borderRadius: 2,
                                    color: 'primary.main',
                                    backgroundColor:
                                        'rgba(244, 96, 30, 0.10)',
                                }}
                            >
                                {card.icon}
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    marginBottom: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Recent Transactions
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 0.5,
                            color: 'text.secondary',
                        }}
                    >
                        The five most recent payment
                        transactions.
                    </Typography>
                </Box>

                <Button
                    onClick={() =>
                        navigate('/transactions')
                    }
                >
                    View All Transactions
                </Button>
            </Box>

            {summary.recentTransactions.length === 0 ? (
                <Alert severity="info">
                    No payment transactions were found.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Reference
                                </TableCell>

                                <TableCell>
                                    Merchant
                                </TableCell>

                                <TableCell>
                                    Card
                                </TableCell>

                                <TableCell>
                                    Amount
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Created At
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {summary.recentTransactions.map(
                                (transaction) => (
                                    <TableRow
                                        key={
                                            transaction.paymentTransactionId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                }}
                                            >
                                                {
                                                    transaction.transactionReference
                                                }
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {
                                                transaction.merchantName
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {transaction.cardBank}{' '}
                                            {'\u2022'.repeat(4)}{' '}
                                            {
                                                transaction.lastFourDigits
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {formatMoney(
                                                transaction.amountMinor,
                                                transaction.currency,
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    transaction.status
                                                }
                                                color={
                                                    transaction.status ===
                                                        'Approved'
                                                        ? 'success'
                                                        : 'warning'
                                                }
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                transaction.createdAt,
                                            ).toLocaleString(
                                                'tr-TR',
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ),
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default DashboardPage;