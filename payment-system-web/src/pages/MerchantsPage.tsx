import {
    useEffect,
    useState,
} from 'react';

import StorefrontRoundedIcon from
    '@mui/icons-material/StorefrontRounded';

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
    getMerchants,
} from '../api/merchantApi';

import CreateMerchantDialog from
    '../components/merchants/CreateMerchantDialog';

import type {
    Merchant,
} from '../types/merchant';

function MerchantsPage() {
    const [merchants, setMerchants] =
        useState<Merchant[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        isCreateDialogOpen,
        setIsCreateDialogOpen,
    ] = useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    useEffect(() => {
        async function loadMerchants() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const merchantList =
                    await getMerchants();

                setMerchants(merchantList);
            } catch {
                setErrorMessage(
                    'Merchants could not be loaded. Make sure the API is running.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadMerchants();
    }, []);

    function handleMerchantCreated(
        createdMerchant: Merchant,
    ) {
        setMerchants((currentMerchants) => [
            ...currentMerchants,
            createdMerchant,
        ]);

        setSuccessMessage(
            'Merchant created successfully.',
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
                        Merchants
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 1,
                            color: 'text.secondary',
                        }}
                    >
                        View and manage merchant records.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={
                        <StorefrontRoundedIcon />
                    }
                    onClick={() =>
                        setIsCreateDialogOpen(true)
                    }
                >
                    Add Merchant
                </Button>
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
                merchants.length === 0 && (
                    <Alert severity="info">
                        No merchant records were found.
                    </Alert>
                )}

            {!isLoading &&
                !errorMessage &&
                merchants.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>

                                    <TableCell>
                                        Merchant Code
                                    </TableCell>

                                    <TableCell>
                                        Merchant Name
                                    </TableCell>

                                    <TableCell>
                                        MCC
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
                                {merchants.map((merchant) => (
                                    <TableRow
                                        key={merchant.merchantId}
                                        hover
                                    >
                                        <TableCell>
                                            {merchant.merchantId}
                                        </TableCell>

                                        <TableCell>
                                            {merchant.merchantCode}
                                        </TableCell>

                                        <TableCell>
                                            {merchant.merchantName}
                                        </TableCell>

                                        <TableCell>
                                            {
                                                merchant.merchantCategoryCode
                                            }
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    merchant.isActive
                                                        ? 'Active'
                                                        : 'Inactive'
                                                }
                                                color={
                                                    merchant.isActive
                                                        ? 'success'
                                                        : 'default'
                                                }
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                merchant.createdAt,
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

            <CreateMerchantDialog
                open={isCreateDialogOpen}
                onClose={() =>
                    setIsCreateDialogOpen(false)
                }
                onMerchantCreated={
                    handleMerchantCreated
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

export default MerchantsPage;