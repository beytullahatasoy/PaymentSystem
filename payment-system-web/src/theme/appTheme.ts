import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
    palette: {
        mode: 'light',

        primary: {
            main: '#F4601E',
        },

        secondary: {
            main: '#0B1E2E',
        },

        background: {
            default: '#F5F6F8',
            paper: '#FFFFFF',
        },

        text: {
            primary: '#17212B',
            secondary: '#667085',
        },
    },

    typography: {
        fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});