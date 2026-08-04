import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router';

const drawerWidth = 260;

const menuItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardRoundedIcon />,
    },
    {
        label: 'Customers',
        path: '/customers',
        icon: <PeopleAltRoundedIcon />,
    },
    {
        label: 'Merchants',
        path: '/merchants',
        icon: <StorefrontRoundedIcon />,
    },
    {
        label: 'New Payment',
        path: '/payments/new',
        icon: <PaymentsRoundedIcon />,
    },
    {
        label: 'Transactions',
        path: '/transactions',
        icon: <ReceiptLongRoundedIcon />,
    },
];

function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const isMenuItemActive = (path: string) => {
        if (path === '/customers') {
            return (
                location.pathname.startsWith('/customers') ||
                location.pathname.startsWith('/bank-accounts')
            );
        }

        return location.pathname === path;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'background.default',
            }}
        >
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'secondary.main',
                        color: '#FFFFFF',
                        borderRight: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        padding: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        PaymentSystem
                    </Typography>

                    <Typography
                        sx={{
                            marginTop: 0.5,
                            color: 'rgba(255, 255, 255, 0.65)',
                            fontSize: 13,
                        }}
                    >
                        Operations Dashboard
                    </Typography>

                    <Chip
                        label="Simulation"
                        size="small"
                        sx={{
                            marginTop: 2,
                            color: '#FFFFFF',
                            borderColor: 'rgba(255, 255, 255, 0.35)',
                        }}
                        variant="outlined"
                    />
                </Box>

                <Divider
                    sx={{
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                    }}
                />

                <List
                    sx={{
                        padding: 2,
                    }}
                >
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            selected={isMenuItemActive(item.path)}
                            onClick={() => navigate(item.path)}
                            sx={{
                                marginBottom: 0.75,
                                borderRadius: 2,
                                color: 'rgba(255, 255, 255, 0.78)',

                                '& .MuiListItemIcon-root': {
                                    color: 'inherit',
                                    minWidth: 42,
                                },

                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    color: '#FFFFFF',
                                },

                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: '#FFFFFF',
                                },

                                '&.Mui-selected:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>

                            <ListItemText
                                primary={item.label}
                                slotProps={{
                                    primary: {
                                        sx: {
                                            fontWeight: 600,
                                        },
                                    },
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    marginLeft: `${drawerWidth}px`,
                    backgroundColor: '#FFFFFF',
                    color: 'text.primary',
                    borderBottom: '1px solid #E4E7EC',
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Payment Operations
                    </Typography>

                    <Chip
                        label="Internal Simulation"
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Toolbar>
            </AppBar>

            <Box
                component="main"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    minHeight: '100vh',
                }}
            >
                <Toolbar />

                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout;