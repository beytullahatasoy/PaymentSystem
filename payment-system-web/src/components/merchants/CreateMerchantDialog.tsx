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

import { createMerchant } from '../../api/merchantApi';

import type {
    Merchant,
} from '../../types/merchant';

interface CreateMerchantDialogProps {
    open: boolean;
    onClose: () => void;
    onMerchantCreated: (
        merchant: Merchant,
    ) => void;
}

function CreateMerchantDialog({
    open,
    onClose,
    onMerchantCreated,
}: CreateMerchantDialogProps) {
    const [
        merchantName,
        setMerchantName,
    ] = useState('');

    const [
        merchantCategoryCode,
        setMerchantCategoryCode,
    ] = useState('');

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const isCategoryCodeValid =
        /^\d{4}$/.test(merchantCategoryCode);

    const isFormValid =
        merchantName.trim().length > 0 &&
        isCategoryCodeValid;

    function resetForm() {
        setMerchantName('');
        setMerchantCategoryCode('');
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

            const createdMerchant =
                await createMerchant({
                    merchantName:
                        merchantName.trim(),

                    merchantCategoryCode,
                });

            onMerchantCreated(createdMerchant);
            resetForm();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const apiMessage =
                    error.response?.data?.message;

                setErrorMessage(
                    typeof apiMessage === 'string'
                        ? apiMessage
                        : 'Merchant could not be created.',
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
                Add Merchant
            </DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="create-merchant-form"
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
                        label="Merchant Name"
                        value={merchantName}
                        onChange={(event) =>
                            setMerchantName(
                                event.target.value,
                            )
                        }
                        placeholder="Demo Market"
                        required
                        fullWidth
                        autoFocus
                    />

                    <TextField
                        label="Merchant Category Code (MCC)"
                        value={merchantCategoryCode}
                        onChange={(event) => {
                            const numericValue =
                                event.target.value.replace(
                                    /\D/g,
                                    '',
                                );

                            setMerchantCategoryCode(
                                numericValue.slice(0, 4),
                            );
                        }}
                        error={
                            merchantCategoryCode.length > 0 &&
                            !isCategoryCodeValid
                        }
                        helperText={
                            merchantCategoryCode.length > 0 &&
                                !isCategoryCodeValid
                                ? 'MCC must contain exactly 4 digits.'
                                : 'Example: 5411 for grocery stores.'
                        }
                        required
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                inputMode: 'numeric',
                                maxLength: 4,
                            },
                        }}
                    />

                    <Alert severity="info">
                        The merchant code will be generated
                        automatically by the backend.
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
                    form="create-merchant-form"
                    variant="contained"
                    disabled={
                        !isFormValid || isSubmitting
                    }
                >
                    {isSubmitting
                        ? 'Creating...'
                        : 'Create Merchant'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateMerchantDialog;