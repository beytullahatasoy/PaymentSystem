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

import { createCard } from '../../api/cardApi';
import type { Card } from '../../types/card';

interface CreateCardDialogProps {
  open: boolean;
  bankAccountId: number;
  currency: string;
  onClose: () => void;
  onCardCreated: (card: Card) => void;
}

function CreateCardDialog({
  open,
  bankAccountId,
  currency,
  onClose,
  onCardCreated,
}: CreateCardDialogProps) {
  const [cardBank, setCardBank] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const dailyLimitValue = Number(
    dailyLimit.replace(',', '.'),
  );

  const isFormValid =
    cardBank.trim().length > 0 &&
    Number.isFinite(dailyLimitValue) &&
    dailyLimitValue > 0;

  function resetForm() {
    setCardBank('');
    setDailyLimit('');
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

      const createdCard = await createCard({
        bankAccountId,
        cardBank: cardBank.trim(),
        dailyLimitMinor: Math.round(
          dailyLimitValue * 100,
        ),
      });

      onCardCreated(createdCard);
      resetForm();
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiMessage =
          error.response?.data?.message;

        setErrorMessage(
          typeof apiMessage === 'string'
            ? apiMessage
            : 'Card could not be created.',
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
        Create Card
      </DialogTitle>

      <DialogContent>
        <Stack
          component="form"
          id="create-card-form"
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
            label="Bank Name"
            value={cardBank}
            onChange={(event) =>
              setCardBank(event.target.value)
            }
            placeholder="VakıfBank"
            required
            fullWidth
            autoFocus
          />

          <TextField
            label={`Daily Limit (${currency})`}
            type="number"
            value={dailyLimit}
            onChange={(event) =>
              setDailyLimit(event.target.value)
            }
            required
            fullWidth
            slotProps={{
              htmlInput: {
                min: 0.01,
                step: 0.01,
              },
            }}
          />

          <Alert severity="info">
            No real card number or CVV is
            processed. Card token, last four
            digits and expiry date are generated
            by the simulation backend.
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
          form="create-card-form"
          variant="contained"
          disabled={
            !isFormValid || isSubmitting
          }
        >
          {isSubmitting
            ? 'Creating...'
            : 'Create Card'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateCardDialog;