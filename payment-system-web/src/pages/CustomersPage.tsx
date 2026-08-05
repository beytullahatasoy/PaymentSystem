import {
    useEffect,
    useState,
} from 'react';

import { useNavigate } from 'react-router';

import PersonAddAltRoundedIcon from
    '@mui/icons-material/PersonAddAltRounded';

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

import { getCustomers } from '../api/customerApi';

import CreateCustomerDialog from
    '../components/customers/CreateCustomerDialog';

import type { Customer } from
    '../types/customer';

function CustomersPage() {
    const navigate = useNavigate();

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [
        isCreateDialogOpen,
        setIsCreateDialogOpen,
    ] = useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    useEffect(() => {
        async function loadCustomers() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const customerList =
                    await getCustomers();

                setCustomers(customerList);
            } catch {
                setErrorMessage(
                    'Customers could not be loaded. Make sure the API is running.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadCustomers();
    }, []);

    function handleCustomerCreated(
        createdCustomer: Customer,
    ) {
        setCustomers((currentCustomers) => [
            ...currentCustomers,
            createdCustomer,
        ]);

        setSuccessMessage(
            'Customer created successfully.',
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
                    justifyContent: 'space-between',
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
                        Customers
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 1,
                            color: 'text.secondary',
                        }}
                    >
                        View and manage customer records.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={
                        <PersonAddAltRoundedIcon />
                    }
                    onClick={() =>
                        setIsCreateDialogOpen(true)
                    }
                >
                    Add Customer
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
                customers.length === 0 && (
                    <Alert severity="info">
                        No customer records were found.
                    </Alert>
                )}

            {!isLoading &&
                !errorMessage &&
                customers.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>
                                        First Name
                                    </TableCell>
                                    <TableCell>
                                        Last Name
                                    </TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>
                                        Created At
                                    </TableCell>
                                    <TableCell align="right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow
                                        key={customer.customerId}
                                        hover
                                    >
                                        <TableCell>
                                            {customer.customerId}
                                        </TableCell>

                                        <TableCell>
                                            {customer.firstName}
                                        </TableCell>

                                        <TableCell>
                                            {customer.lastName}
                                        </TableCell>

                                        <TableCell>
                                            {customer.email}
                                        </TableCell>

                                        <TableCell>
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
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                customer.createdAt,
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
                                                        `/customers/${customer.customerId}`,
                                                    )
                                                }
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

            <CreateCustomerDialog
                open={isCreateDialogOpen}
                onClose={() =>
                    setIsCreateDialogOpen(false)
                }
                onCustomerCreated={
                    handleCustomerCreated
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

export default CustomersPage;