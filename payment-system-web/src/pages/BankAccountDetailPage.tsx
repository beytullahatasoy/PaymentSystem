import {
    useEffect,
    useState,
} from 'react';

import {
    useNavigate,
    useParams,
} from 'react-router';

import AccountBalanceWalletRoundedIcon from
    '@mui/icons-material/AccountBalanceWalletRounded';

import AddCardRoundedIcon from
    '@mui/icons-material/AddCardRounded';

import ArrowBackRoundedIcon from
    '@mui/icons-material/ArrowBackRounded';

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
    getBankAccountById,
} from '../api/bankAccountApi';

import {
    getCardsByBankAccountId,
} from '../api/cardApi';

import AddTestBalanceDialog from
    '../components/bankAccounts/AddTestBalanceDialog';

import CreateCardDialog from
    '../components/cards/CreateCardDialog';

import type {
    BankAccount,
} from '../types/bankAccount';

import type {
    Card,
} from '../types/card';

import {
    formatMoney,
} from '../utils/formatMoney';

function BankAccountDetailPage() {
    const navigate = useNavigate();

    const { bankAccountId } = useParams();

    const [
        bankAccount,
        setBankAccount,
    ] = useState<BankAccount | null>(null);

    const [cards, setCards] =
        useState<Card[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        isDepositDialogOpen,
        setIsDepositDialogOpen,
    ] = useState(false);

    const [
        isCreateCardDialogOpen,
        setIsCreateCardDialogOpen,
    ] = useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    useEffect(() => {
        async function loadBankAccountDetail() {
            const parsedBankAccountId =
                Number(bankAccountId);

            if (
                !bankAccountId ||
                !Number.isInteger(
                    parsedBankAccountId,
                ) ||
                parsedBankAccountId <= 0
            ) {
                setErrorMessage(
                    'A valid bank account ID is required.',
                );

                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);

                const [
                    bankAccountResult,
                    cardResult,
                ] = await Promise.all([
                    getBankAccountById(
                        parsedBankAccountId,
                    ),

                    getCardsByBankAccountId(
                        parsedBankAccountId,
                    ),
                ]);

                setBankAccount(bankAccountResult);
                setCards(cardResult);
            } catch {
                setErrorMessage(
                    'Bank account details could not be loaded.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadBankAccountDetail();
    }, [bankAccountId]);

    function handleBalanceAdded(
        updatedBankAccount: BankAccount,
    ) {
        setBankAccount(updatedBankAccount);

        setSuccessMessage(
            'Test balance added successfully.',
        );
    }

    function handleCardCreated(
        createdCard: Card,
    ) {
        setCards((currentCards) => [
            ...currentCards,
            createdCard,
        ]);

        setSuccessMessage(
            'Card created successfully.',
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

    if (errorMessage || !bankAccount) {
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
                        'Bank account could not be found.'}
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
                    navigate(
                        `/customers/${bankAccount.customerId}`,
                    )
                }
                sx={{
                    marginBottom: 2,
                }}
            >
                Back to Customer
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
                    Bank Account Detail
                </Typography>

                <Typography
                    sx={{
                        marginTop: 1,
                        color: 'text.secondary',
                    }}
                >
                    View account information and
                    registered cards.
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
                            sx={{
                                color: 'text.secondary',
                                fontSize: 14,
                            }}
                        >
                            Account Number
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                marginTop: 0.5,
                                fontWeight: 700,
                            }}
                        >
                            {bankAccount.accountNumber}
                        </Typography>

                        <Typography
                            sx={{
                                marginTop: 2,
                                color: 'text.secondary',
                                fontSize: 14,
                            }}
                        >
                            Created at:{' '}
                            {new Date(
                                bankAccount.createdAt,
                            ).toLocaleDateString(
                                'tr-TR',
                            )}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 1.5,
                        }}
                    >
                        <Chip
                            label={bankAccount.status}
                            color={
                                bankAccount.status ===
                                    'Active'
                                    ? 'success'
                                    : 'default'
                            }
                        />

                        <Button
                            variant="contained"
                            startIcon={
                                <AccountBalanceWalletRoundedIcon />
                            }
                            onClick={() =>
                                setIsDepositDialogOpen(true)
                            }
                        >
                            Add Test Balance
                        </Button>

                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: 12,
                            }}
                        >
                            Simulation only
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(2, minmax(0, 1fr))',
                        gap: 2,
                        marginTop: 3,
                    }}
                >
                    <Box
                        sx={{
                            padding: 2,
                            borderRadius: 2,
                            backgroundColor:
                                'background.default',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: 14,
                            }}
                        >
                            Available Balance
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                marginTop: 0.5,
                                fontWeight: 700,
                            }}
                        >
                            {formatMoney(
                                bankAccount.balanceMinor,
                                bankAccount.currency,
                            )}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            padding: 2,
                            borderRadius: 2,
                            backgroundColor:
                                'background.default',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: 14,
                            }}
                        >
                            Currency
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                marginTop: 0.5,
                                fontWeight: 700,
                            }}
                        >
                            {bankAccount.currency}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

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
                        Cards
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 0.5,
                            color: 'text.secondary',
                        }}
                    >
                        Cards registered for this bank
                        account.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={
                        <AddCardRoundedIcon />
                    }
                    onClick={() =>
                        setIsCreateCardDialogOpen(true)
                    }
                >
                    Create Card
                </Button>
            </Box>

            {cards.length === 0 ? (
                <Alert severity="info">
                    This bank account does not have a
                    card yet.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>

                                <TableCell>
                                    Bank
                                </TableCell>

                                <TableCell>
                                    Card
                                </TableCell>

                                <TableCell>
                                    Expiry Date
                                </TableCell>

                                <TableCell>
                                    Daily Limit
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
                            {cards.map((card) => (
                                <TableRow
                                    key={card.cardId}
                                    hover
                                >
                                    <TableCell>
                                        {card.cardId}
                                    </TableCell>

                                    <TableCell>
                                        {card.cardBank}
                                    </TableCell>

                                    <TableCell>
                                        {'\u2022'.repeat(4)}{' '}
                                        {card.lastFourDigits}
                                    </TableCell>

                                    <TableCell>
                                        {String(
                                            card.expiryMonth,
                                        ).padStart(2, '0')}
                                        /{card.expiryYear}
                                    </TableCell>

                                    <TableCell>
                                        {formatMoney(
                                            card.dailyLimitMinor,
                                            bankAccount.currency,
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={card.status}
                                            color={
                                                card.status ===
                                                    'Active'
                                                    ? 'success'
                                                    : 'default'
                                            }
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {new Date(
                                            card.createdAt,
                                        ).toLocaleDateString(
                                            'tr-TR',
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AddTestBalanceDialog
                open={isDepositDialogOpen}
                bankAccountId={
                    bankAccount.bankAccountId
                }
                currency={bankAccount.currency}
                onClose={() =>
                    setIsDepositDialogOpen(false)
                }
                onBalanceAdded={
                    handleBalanceAdded
                }
            />

            <CreateCardDialog
                open={isCreateCardDialogOpen}
                bankAccountId={
                    bankAccount.bankAccountId
                }
                currency={bankAccount.currency}
                onClose={() =>
                    setIsCreateCardDialogOpen(false)
                }
                onCardCreated={
                    handleCardCreated
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

export default BankAccountDetailPage;