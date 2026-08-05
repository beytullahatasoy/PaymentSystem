import {
    useEffect,
    useState,
} from 'react';

import {
    useNavigate,
    useParams,
} from 'react-router';

import AddRoundedIcon from
    '@mui/icons-material/AddRounded';

import ArrowBackRoundedIcon from
    '@mui/icons-material/ArrowBackRounded';

import VisibilityRoundedIcon from
    '@mui/icons-material/VisibilityRounded';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from
    '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from
    '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
    getBankAccountsByCustomerId,
} from '../api/bankAccountApi';

import {
    getCustomerById,
} from '../api/customerApi';

import CreateBankAccountDialog from
    '../components/bankAccounts/CreateBankAccountDialog';

import type {
    BankAccount,
} from '../types/bankAccount';

import type {
    Customer,
} from '../types/customer';

import {
    formatMoney,
} from '../utils/formatMoney';

function CustomerDetailPage() {
    const navigate = useNavigate();

    const { customerId } = useParams();

    const [customer, setCustomer] =
        useState<Customer | null>(null);

    const [bankAccounts, setBankAccounts] =
        useState<BankAccount[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [
        isCreateAccountDialogOpen,
        setIsCreateAccountDialogOpen,
    ] = useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    useEffect(() => {
        async function loadCustomerDetail() {
            const parsedCustomerId =
                Number(customerId);

            if (
                !customerId ||
                !Number.isInteger(parsedCustomerId) ||
                parsedCustomerId <= 0
            ) {
                setErrorMessage(
                    'A valid customer ID is required.',
                );

                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);

                const [
                    customerResult,
                    bankAccountResult,
                ] = await Promise.all([
                    getCustomerById(parsedCustomerId),

                    getBankAccountsByCustomerId(
                        parsedCustomerId,
                    ),
                ]);

                setCustomer(customerResult);
                setBankAccounts(bankAccountResult);
            } catch {
                setErrorMessage(
                    'Customer details could not be loaded.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadCustomerDetail();
    }, [customerId]);

    function handleBankAccountCreated(
        createdBankAccount: BankAccount,
    ) {
        setBankAccounts(
            (currentBankAccounts) => [
                ...currentBankAccounts,
                createdBankAccount,
            ],
        );

        setSuccessMessage(
            'Bank account created successfully.',
        );
    }

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

    if (errorMessage || !customer) {
        return (
            <Box
                sx={{
                    padding: 4,
                }}
            >
                <Button
                    startIcon={
                        <ArrowBackRoundedIcon />
                    }
                    onClick={() =>
                        navigate('/customers')
                    }
                    sx={{
                        marginBottom: 2,
                    }}
                >
                    Back to Customers
                </Button>

                <Alert severity="error">
                    {errorMessage ??
                        'Customer could not be found.'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: 4,
            }}
        >
            <Button
                startIcon={
                    <ArrowBackRoundedIcon />
                }
                onClick={() =>
                    navigate('/customers')
                }
                sx={{
                    marginBottom: 2,
                }}
            >
                Back to Customers
            </Button>

            <Box
                sx={{
                    marginBottom: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Customer Detail
                </Typography>

                <Typography
                    sx={{
                        marginTop: 1,
                        color: 'text.secondary',
                    }}
                >
                    View customer information and bank
                    accounts.
                </Typography>
            </Box>

            <Paper
                sx={{
                    padding: 3,
                    marginBottom: 4,
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
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {customer.firstName}{' '}
                            {customer.lastName}
                        </Typography>

                        <Typography
                            sx={{
                                marginTop: 1,
                                color: 'text.secondary',
                            }}
                        >
                            {customer.email}
                        </Typography>

                        <Typography
                            sx={{
                                marginTop: 1,
                                color: 'text.secondary',
                                fontSize: 14,
                            }}
                        >
                            Created at:{' '}
                            {new Date(
                                customer.createdAt,
                            ).toLocaleDateString(
                                'tr-TR',
                            )}
                        </Typography>
                    </Box>

                    <Chip
                        label={
                            customer.isActive
                                ? 'Active'
                                : 'Inactive'
                        }
                        color={
                            customer.isActive
                                ? 'success'
                                : 'default'
                        }
                    />
                </Box>
            </Paper>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
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
                        Bank Accounts
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 0.5,
                            color: 'text.secondary',
                        }}
                    >
                        Accounts registered for this
                        customer.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={() =>
                        setIsCreateAccountDialogOpen(
                            true,
                        )
                    }
                >
                    Create Account
                </Button>
            </Box>

            {bankAccounts.length === 0 ? (
                <Alert severity="info">
                    This customer does not have a bank
                    account yet.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>

                                <TableCell>
                                    Account Number
                                </TableCell>

                                <TableCell>
                                    Balance
                                </TableCell>

                                <TableCell>
                                    Currency
                                </TableCell>

                                <TableCell>
                                    Status
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
                            {bankAccounts.map(
                                (account) => (
                                    <TableRow
                                        key={
                                            account.bankAccountId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {
                                                account.bankAccountId
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                account.accountNumber
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {formatMoney(
                                                account.balanceMinor,
                                                account.currency,
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {account.currency}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={account.status}
                                                color={
                                                    account.status ===
                                                        'Active'
                                                        ? 'success'
                                                        : 'default'
                                                }
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                account.createdAt,
                                            ).toLocaleDateString(
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
                                                    navigate(
                                                        `/bank-accounts/${account.bankAccountId}`,
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

            <CreateBankAccountDialog
                open={
                    isCreateAccountDialogOpen
                }
                customerId={customer.customerId}
                onClose={() =>
                    setIsCreateAccountDialogOpen(
                        false,
                    )
                }
                onBankAccountCreated={
                    handleBankAccountCreated
                }
            />

            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                onClose={() =>
                    setSuccessMessage(null)
                }
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSuccessMessage(null)
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default CustomerDetailPage;