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

import { createCustomer } from '../../api/customerApi';

import type {
    Customer,
} from '../../types/customer';

interface CreateCustomerDialogProps {
    open: boolean;
    onClose: () => void;
    onCustomerCreated: (customer: Customer) => void;
}

function CreateCustomerDialog({
    open,
    onClose,
    onCustomerCreated,
}: CreateCustomerDialogProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const isFormValid = Boolean(
        firstName.trim() &&
        lastName.trim() &&
        email.trim(),
    );

    function resetForm() {
        setFirstName('');
        setLastName('');
        setEmail('');
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

            const createdCustomer = await createCustomer({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
            });

            onCustomerCreated(createdCustomer);
            resetForm();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const apiMessage =
                    error.response?.data?.message;

                setErrorMessage(
                    typeof apiMessage === 'string'
                        ? apiMessage
                        : 'Customer could not be created.',
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
                Add Customer
            </DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="create-customer-form"
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
                        label="First Name"
                        value={firstName}
                        onChange={(event) =>
                            setFirstName(event.target.value)
                        }
                        required
                        fullWidth
                        autoFocus
                    />

                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(event.target.value)
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                        fullWidth
                    />
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
                    form="create-customer-form"
                    variant="contained"
                    disabled={
                        !isFormValid || isSubmitting
                    }
                >
                    {isSubmitting
                        ? 'Creating...'
                        : 'Create Customer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateCustomerDialog;