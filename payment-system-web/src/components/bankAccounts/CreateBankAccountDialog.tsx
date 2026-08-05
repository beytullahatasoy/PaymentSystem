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
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { createBankAccount } from '../../api/bankAccountApi';
import type { BankAccount } from '../../types/bankAccount';

interface CreateBankAccountDialogProps {
    open: boolean;
    customerId: number;
    onClose: () => void;
    onBankAccountCreated: (
        bankAccount: BankAccount,
    ) => void;
}

function CreateBankAccountDialog({
    open,
    customerId,
    onClose,
    onBankAccountCreated,
}: CreateBankAccountDialogProps) {
    const [currency, setCurrency] =
        useState('TRY');

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    function resetForm() {
        setCurrency('TRY');
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

        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            const createdBankAccount =
                await createBankAccount({
                    customerId,
                    currency,
                });

            onBankAccountCreated(createdBankAccount);
            resetForm();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const apiMessage =
                    error.response?.data?.message;

                setErrorMessage(
                    typeof apiMessage === 'string'
                        ? apiMessage
                        : 'Bank account could not be created.',
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
                Create Bank Account
            </DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="create-bank-account-form"
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
                        select
                        label="Currency"
                        value={currency}
                        onChange={(event) =>
                            setCurrency(event.target.value)
                        }
                        fullWidth
                    >
                        <MenuItem value="TRY">TRY</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                    </TextField>

                    <Alert severity="info">
                        The account will be created with a
                        zero balance. Test balance can be
                        added from the account detail page.
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
                    form="create-bank-account-form"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'Creating...'
                        : 'Create Account'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateBankAccountDialog;