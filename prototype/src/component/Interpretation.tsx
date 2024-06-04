import {Paper, TextField, Typography} from '@mui/material';

export default function Interpretation() {
    return <Paper style={{padding: '15px'}} >
        <Typography variant="h5" gutterBottom>
            Interpretation
        </Typography>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </Paper>
}