import {
    type FormEvent,
    useState,
} from 'react';

import axios from 'axios';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { depositBankAccount } from '../../api/bankAccountApi';
import type { BankAccount } from '../../types/bankAccount';

interface AddTestBalanceDialogProps {
    open: boolean;
    bankAccountId: number;
    currency: string;
    onClose: () => void;
    onBalanceAdded: (
        bankAccount: BankAccount,
    ) => void;
}

function AddTestBalanceDialog({
    open,
    bankAccountId,
    currency,
    onClose,
    onBalanceAdded,
}: AddTestBalanceDialogProps) {
    const [amount, setAmount] = useState('');

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const amountValue = Number(
        amount.replace(',', '.'),
    );

    const isFormValid =
        Number.isFinite(amountValue) &&
        amountValue > 0;

    function resetForm() {
        setAmount('');
        setErrorMessage(null);
    }

    function handleClose() {
        if (isSubmitting) {
            return;
        }

        resetForm();
        onClose();
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!isFormValid) {
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            const updatedBankAccount =
                await depositBankAccount(
                    bankAccountId,
                    {
                        amountMinor: Math.round(
                            amountValue * 100,
                        ),
                    },
                );

            onBalanceAdded(updatedBankAccount);
            resetForm();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const apiMessage =
                    error.response?.data?.message;

                setErrorMessage(
                    typeof apiMessage === 'string'
                        ? apiMessage
                        : 'Test balance could not be added.',
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

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Add Test Balance
            </DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="add-test-balance-form"
                    onSubmit={handleSubmit}
                    sx={{
                        gap: 2,
                        paddingTop: 1,
                    }}
                >
                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}

                    <TextField
                        label={`Amount (${currency})`}
                        type="number"
                        value={amount}
                        onChange={(event) =>
                            setAmount(event.target.value)
                        }
                        required
                        fullWidth
                        autoFocus
                        slotProps={{
                            htmlInput: {
                                min: 0.01,
                                step: 0.01,
                            },
                        }}
                    />

                    <Alert severity="warning">
                        Simulation only. This operation does
                        not represent a real bank transfer.
                    </Alert>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    color="inherit"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form="add-test-balance-form"
                    variant="contained"
                    disabled={
                        !isFormValid || isSubmitting
                    }
                >
                    {isSubmitting
                        ? 'Adding...'
                        : 'Add Balance'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddTestBalanceDialog;