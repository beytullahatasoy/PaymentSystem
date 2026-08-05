import {
    useEffect,
    useState,
} from 'react';

import VisibilityRoundedIcon from
    '@mui/icons-material/VisibilityRounded';

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
import ToggleButton from
    '@mui/material/ToggleButton';
import ToggleButtonGroup from
    '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { getPayments } from
    '../api/paymentApi';

import TransactionDetailDialog from
    '../components/transactions/TransactionDetailDialog';

import type { PaymentTransaction } from
    '../types/payment';

import { formatMoney } from
    '../utils/formatMoney';

type StatusFilter =
    | 'All'
    | 'Approved'
    | 'Declined';

function TransactionsPage() {
    const [
        transactions,
        setTransactions,
    ] = useState<PaymentTransaction[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<StatusFilter>('All');

    const [
        selectedTransactionId,
        setSelectedTransactionId,
    ] = useState<number | null>(null);

    useEffect(() => {
        async function loadTransactions() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const transactionList =
                    await getPayments();

                setTransactions(transactionList);
            } catch {
                setErrorMessage(
                    'Transactions could not be loaded. Make sure the API is running.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadTransactions();
    }, []);

    const filteredTransactions =
        statusFilter === 'All'
            ? transactions
            : transactions.filter(
                (transaction) =>
                    transaction.status ===
                    statusFilter,
            );

    return (
        <Box
            sx={{
                padding: 4,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
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
                        Transactions
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 1,
                            color: 'text.secondary',
                        }}
                    >
                        View approved and declined payment
                        transactions.
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(
                        _event,
                        newFilter: StatusFilter | null,
                    ) => {
                        if (newFilter !== null) {
                            setStatusFilter(newFilter);
                        }
                    }}
                    size="small"
                >
                    <ToggleButton value="All">
                        All
                    </ToggleButton>

                    <ToggleButton value="Approved">
                        Approved
                    </ToggleButton>

                    <ToggleButton value="Declined">
                        Declined
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {isLoading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 5,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            )}

            {!isLoading &&
                !errorMessage &&
                filteredTransactions.length ===
                0 && (
                    <Alert severity="info">
                        No transactions match the selected
                        filter.
                    </Alert>
                )}

            {!isLoading &&
                !errorMessage &&
                filteredTransactions.length > 0 && (
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
                                        Response
                                    </TableCell>

                                    <TableCell>
                                        Created At
                                    </TableCell>

                                    <TableCell align="right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredTransactions.map(
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
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {
                                                        transaction.merchantName
                                                    }
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            'text.secondary',
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {
                                                        transaction.merchantCode
                                                    }
                                                </Typography>
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
                                                {
                                                    transaction.responseCode
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {new Date(
                                                    transaction.createdAt,
                                                ).toLocaleString(
                                                    'tr-TR',
                                                )}
                                            </TableCell>

                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    startIcon={
                                                        <VisibilityRoundedIcon />
                                                    }
                                                    onClick={() =>
                                                        setSelectedTransactionId(
                                                            transaction.paymentTransactionId,
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

            <TransactionDetailDialog
                open={
                    selectedTransactionId !== null
                }
                paymentTransactionId={
                    selectedTransactionId
                }
                onClose={() =>
                    setSelectedTransactionId(null)
                }
            />
        </Box>
    );
}

export default TransactionsPage;