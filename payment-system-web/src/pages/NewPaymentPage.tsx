import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import PaymentsRoundedIcon from
    '@mui/icons-material/PaymentsRounded';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from
    '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
    getBankAccountsByCustomerId,
} from '../api/bankAccountApi';

import {
    getCardsByBankAccountId,
} from '../api/cardApi';

import {
    getCustomers,
} from '../api/customerApi';

import {
    getMerchants,
} from '../api/merchantApi';

import {
    processPayment,
} from '../api/paymentApi';

import type {
    BankAccount,
} from '../types/bankAccount';

import type {
    Card,
} from '../types/card';

import type {
    Customer,
} from '../types/customer';

import type {
    Merchant,
} from '../types/merchant';

import type {
    PaymentResult,
} from '../types/payment';

import {
    formatMoney,
} from '../utils/formatMoney';

function NewPaymentPage() {
    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [bankAccounts, setBankAccounts] =
        useState<BankAccount[]>([]);

    const [cards, setCards] =
        useState<Card[]>([]);

    const [merchants, setMerchants] =
        useState<Merchant[]>([]);

    const [
        selectedCustomerId,
        setSelectedCustomerId,
    ] = useState('');

    const [
        selectedBankAccountId,
        setSelectedBankAccountId,
    ] = useState('');

    const [
        selectedCardId,
        setSelectedCardId,
    ] = useState('');

    const [
        selectedMerchantId,
        setSelectedMerchantId,
    ] = useState('');

    const [amount, setAmount] =
        useState('');

    const [isInitialLoading, setIsInitialLoading] =
        useState(true);

    const [isAccountsLoading, setIsAccountsLoading] =
        useState(false);

    const [isCardsLoading, setIsCardsLoading] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        paymentResult,
        setPaymentResult,
    ] = useState<PaymentResult | null>(null);

    useEffect(() => {
        async function loadInitialData() {
            try {
                setIsInitialLoading(true);
                setErrorMessage(null);

                const [
                    customerList,
                    merchantList,
                ] = await Promise.all([
                    getCustomers(),
                    getMerchants(),
                ]);

                setCustomers(customerList);
                setMerchants(merchantList);
            } catch {
                setErrorMessage(
                    'Customers and merchants could not be loaded.',
                );
            } finally {
                setIsInitialLoading(false);
            }
        }

        void loadInitialData();
    }, []);

    const selectedBankAccount =
        bankAccounts.find(
            (bankAccount) =>
                bankAccount.bankAccountId ===
                Number(selectedBankAccountId),
        ) ?? null;

    const selectedCard =
        cards.find(
            (card) =>
                card.cardId ===
                Number(selectedCardId),
        ) ?? null;

    const selectedMerchant =
        merchants.find(
            (merchant) =>
                merchant.merchantId ===
                Number(selectedMerchantId),
        ) ?? null;

    const amountValue = Number(
        amount.replace(',', '.'),
    );

    const isAmountValid =
        Number.isFinite(amountValue) &&
        amountValue > 0;

    const isFormValid =
        Boolean(selectedCustomerId) &&
        Boolean(selectedBankAccount) &&
        Boolean(selectedCard) &&
        Boolean(selectedMerchant) &&
        isAmountValid;

    async function handleCustomerChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) {
        const newCustomerId =
            event.target.value;

        setSelectedCustomerId(newCustomerId);
        setSelectedBankAccountId('');
        setSelectedCardId('');
        setBankAccounts([]);
        setCards([]);
        setPaymentResult(null);
        setErrorMessage(null);

        const parsedCustomerId =
            Number(newCustomerId);

        if (
            !Number.isInteger(parsedCustomerId) ||
            parsedCustomerId <= 0
        ) {
            return;
        }

        try {
            setIsAccountsLoading(true);

            const accountList =
                await getBankAccountsByCustomerId(
                    parsedCustomerId,
                );

            setBankAccounts(accountList);
        } catch {
            setErrorMessage(
                'Bank accounts could not be loaded.',
            );
        } finally {
            setIsAccountsLoading(false);
        }
    }

    async function handleBankAccountChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) {
        const newBankAccountId =
            event.target.value;

        setSelectedBankAccountId(
            newBankAccountId,
        );

        setSelectedCardId('');
        setCards([]);
        setPaymentResult(null);
        setErrorMessage(null);

        const parsedBankAccountId =
            Number(newBankAccountId);

        if (
            !Number.isInteger(
                parsedBankAccountId,
            ) ||
            parsedBankAccountId <= 0
        ) {
            return;
        }

        try {
            setIsCardsLoading(true);

            const cardList =
                await getCardsByBankAccountId(
                    parsedBankAccountId,
                );

            setCards(cardList);
        } catch {
            setErrorMessage(
                'Cards could not be loaded.',
            );
        } finally {
            setIsCardsLoading(false);
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            !isFormValid ||
            !selectedBankAccount ||
            !selectedCard ||
            !selectedMerchant
        ) {
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage(null);
            setPaymentResult(null);

            const result = await processPayment({
                cardToken:
                    selectedCard.cardToken,

                merchantCode:
                    selectedMerchant.merchantCode,

                amountMinor: Math.round(
                    amountValue * 100,
                ),

                currency:
                    selectedBankAccount.currency,
            });

            setPaymentResult(result);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const apiMessage =
                    error.response?.data?.message;

                setErrorMessage(
                    typeof apiMessage === 'string'
                        ? apiMessage
                        : 'Payment could not be processed.',
                );
            } else {
                setErrorMessage(
                    'An unexpected error occurred.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isInitialLoading) {
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

    return (
        <Box
            sx={{
                padding: 4,
            }}
        >
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
                    New Payment
                </Typography>

                <Typography
                    sx={{
                        marginTop: 1,
                        color: 'text.secondary',
                    }}
                >
                    Process a payment in the simulation
                    environment.
                </Typography>
            </Box>

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    padding: 3,
                    maxWidth: 950,
                }}
            >
                <Alert
                    severity="info"
                    sx={{
                        marginBottom: 3,
                    }}
                >
                    Simulation only. No real card or
                    banking data is processed.
                </Alert>

                {errorMessage && (
                    <Alert
                        severity="error"
                        sx={{
                            marginBottom: 3,
                        }}
                    >
                        {errorMessage}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(2, minmax(0, 1fr))',
                        gap: 2,
                    }}
                >
                    <TextField
                        select
                        label="Customer"
                        value={selectedCustomerId}
                        onChange={handleCustomerChange}
                        required
                        fullWidth
                    >
                        {customers.map((customer) => (
                            <MenuItem
                                key={customer.customerId}
                                value={customer.customerId}
                            >
                                {customer.firstName}{' '}
                                {customer.lastName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Bank Account"
                        value={selectedBankAccountId}
                        onChange={
                            handleBankAccountChange
                        }
                        disabled={
                            !selectedCustomerId ||
                            isAccountsLoading ||
                            bankAccounts.length === 0
                        }
                        required
                        fullWidth
                    >
                        {bankAccounts.map(
                            (bankAccount) => (
                                <MenuItem
                                    key={
                                        bankAccount.bankAccountId
                                    }
                                    value={
                                        bankAccount.bankAccountId
                                    }
                                >
                                    {bankAccount.accountNumber}
                                    {' — '}
                                    {formatMoney(
                                        bankAccount.balanceMinor,
                                        bankAccount.currency,
                                    )}
                                </MenuItem>
                            ),
                        )}
                    </TextField>

                    <TextField
                        select
                        label="Card"
                        value={selectedCardId}
                        onChange={(event) => {
                            setSelectedCardId(
                                event.target.value,
                            );

                            setPaymentResult(null);
                        }}
                        disabled={
                            !selectedBankAccountId ||
                            isCardsLoading ||
                            cards.length === 0
                        }
                        required
                        fullWidth
                    >
                        {cards.map((card) => (
                            <MenuItem
                                key={card.cardId}
                                value={card.cardId}
                            >
                                {card.cardBank}{' '}
                                {'\u2022'.repeat(4)}{' '}
                                {card.lastFourDigits}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Merchant"
                        value={selectedMerchantId}
                        onChange={(event) => {
                            setSelectedMerchantId(
                                event.target.value,
                            );

                            setPaymentResult(null);
                        }}
                        required
                        fullWidth
                    >
                        {merchants.map((merchant) => (
                            <MenuItem
                                key={merchant.merchantId}
                                value={merchant.merchantId}
                            >
                                {merchant.merchantName}
                                {' — '}
                                {merchant.merchantCode}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label={
                            selectedBankAccount
                                ? `Amount (${selectedBankAccount.currency})`
                                : 'Amount'
                        }
                        type="number"
                        value={amount}
                        onChange={(event) => {
                            setAmount(event.target.value);
                            setPaymentResult(null);
                        }}
                        disabled={!selectedBankAccount}
                        required
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                min: 0.01,
                                step: 0.01,
                            },
                        }}
                    />

                    <TextField
                        label="Currency"
                        value={
                            selectedBankAccount?.currency ??
                            ''
                        }
                        disabled
                        fullWidth
                    />
                </Box>

                {selectedBankAccount && (
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
                                sx={{
                                    marginTop: 0.5,
                                    fontWeight: 700,
                                }}
                            >
                                {formatMoney(
                                    selectedBankAccount.balanceMinor,
                                    selectedBankAccount.currency,
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
                                Card Daily Limit
                            </Typography>

                            <Typography
                                sx={{
                                    marginTop: 0.5,
                                    fontWeight: 700,
                                }}
                            >
                                {selectedCard
                                    ? formatMoney(
                                        selectedCard.dailyLimitMinor,
                                        selectedBankAccount.currency,
                                    )
                                    : 'Select a card'}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {selectedCustomerId &&
                    !isAccountsLoading &&
                    bankAccounts.length === 0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                marginTop: 3,
                            }}
                        >
                            This customer does not have a bank
                            account.
                        </Alert>
                    )}

                {selectedBankAccountId &&
                    !isCardsLoading &&
                    cards.length === 0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                marginTop: 3,
                            }}
                        >
                            This bank account does not have a
                            card.
                        </Alert>
                    )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: 3,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={
                            <PaymentsRoundedIcon />
                        }
                        disabled={
                            !isFormValid ||
                            isSubmitting
                        }
                    >
                        {isSubmitting
                            ? 'Processing...'
                            : 'Process Payment'}
                    </Button>
                </Box>
            </Paper>

            {paymentResult && (
                <Paper
                    sx={{
                        padding: 3,
                        maxWidth: 950,
                        marginTop: 3,
                        borderLeft: '5px solid',
                        borderLeftColor:
                            paymentResult.status ===
                                'Approved'
                                ? 'success.main'
                                : 'warning.main',
                    }}
                >
                    <Stack
                        spacing={2}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Payment Result
                            </Typography>

                            <Chip
                                label={paymentResult.status}
                                color={
                                    paymentResult.status ===
                                        'Approved'
                                        ? 'success'
                                        : 'warning'
                                }
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(2, minmax(0, 1fr))',
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
                                    Transaction Reference
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {
                                        paymentResult.transactionReference
                                    }
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Amount
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {formatMoney(
                                        paymentResult.amountMinor,
                                        paymentResult.currency,
                                    )}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Response Code
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {paymentResult.responseCode}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Description
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {paymentResult.description}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>
            )}
        </Box>
    );
}

export default NewPaymentPage;