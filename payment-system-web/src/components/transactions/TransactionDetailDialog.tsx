import {
    useEffect,
    useState,
} from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from
    '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from
    '@mui/material/DialogActions';
import DialogContent from
    '@mui/material/DialogContent';
import DialogTitle from
    '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { getPaymentById } from
    '../../api/paymentApi';

import type { PaymentTransaction } from
    '../../types/payment';

import { formatMoney } from
    '../../utils/formatMoney';

interface TransactionDetailDialogProps {
    open: boolean;
    paymentTransactionId: number | null;
    onClose: () => void;
}

function TransactionDetailDialog({
    open,
    paymentTransactionId,
    onClose,
}: TransactionDetailDialogProps) {
    const [
        transaction,
        setTransaction,
    ] = useState<PaymentTransaction | null>(
        null,
    );

    const [isLoading, setIsLoading] =
        useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    useEffect(() => {
        async function loadTransaction() {
            if (
                !open ||
                paymentTransactionId === null
            ) {
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);
                setTransaction(null);

                const result = await getPaymentById(
                    paymentTransactionId,
                );

                setTransaction(result);
            } catch {
                setErrorMessage(
                    'Transaction details could not be loaded.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadTransaction();
    }, [open, paymentTransactionId]);

    function handleClose() {
        setTransaction(null);
        setErrorMessage(null);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Transaction Detail
            </DialogTitle>

            <DialogContent>
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
                    transaction && (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(2, minmax(0, 1fr))',
                                gap: 3,
                                paddingTop: 1,
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
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {
                                        transaction.transactionReference
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
                                    Status
                                </Typography>

                                <Chip
                                    label={transaction.status}
                                    color={
                                        transaction.status ===
                                            'Approved'
                                            ? 'success'
                                            : 'warning'
                                    }
                                    sx={{
                                        marginTop: 0.5,
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Merchant
                                </Typography>

                                <Typography
                                    sx={{
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {transaction.merchantName}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 13,
                                    }}
                                >
                                    {transaction.merchantCode}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Card
                                </Typography>

                                <Typography
                                    sx={{
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {transaction.cardBank}{' '}
                                    {'\u2022'.repeat(4)}{' '}
                                    {transaction.lastFourDigits}
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
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {formatMoney(
                                        transaction.amountMinor,
                                        transaction.currency,
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
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {transaction.responseCode}
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
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {transaction.description}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Created At
                                </Typography>

                                <Typography
                                    sx={{
                                        marginTop: 0.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {new Date(
                                        transaction.createdAt,
                                    ).toLocaleString('tr-TR')}
                                </Typography>
                            </Box>
                        </Box>
                    )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="inherit"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TransactionDetailDialog;