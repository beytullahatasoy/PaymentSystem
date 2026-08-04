import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PagePlaceholderProps {
    title: string;
    description: string;
}

function PagePlaceholder({
    title,
    description,
}: PagePlaceholderProps) {
    return (
        <Box
            sx={{
                padding: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    marginBottom: 1,
                }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    color: 'text.secondary',
                }}
            >
                {description}
            </Typography>
        </Box>
    );
}

export default PagePlaceholder;