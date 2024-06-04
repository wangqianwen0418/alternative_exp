import {Button, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import './Interpretation.css'

function getSelection (label:string, value:string, handleChange: (k:string)=>void, options: string[]) {
    return <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: 'block' }}>
    {/* <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel> */}
    <Select
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
      value={value}
      onChange={(e)=>handleChange(e.target.value)}
      label="Age"
    >
        {options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
    </Select>
  </FormControl>
}

function formatText (text:string, entityType: 'feature' | 'relation' | 'prediction') {
    if (entityType === 'feature') {
        return <span className='label' style={{backgroundColor: '#6bbcff'}}>{text}</span>
    } else if (entityType === 'relation') {
        return <span className='label' style={{backgroundColor: 'green'}}>{text}</span>
    } else if (entityType === 'prediction') {
        return <span className='label' style={{backgroundColor: '#ffc760' }}>{text}</span>
    }
    
}

export default function Interpretation() {
    return <Paper style={{padding: '15px'}} >
        <Typography variant="h5" gutterBottom>
            Interpretation
        </Typography>
        <TextField 
            id="outlined-basic" 
            label="original input" 
            defaultValue='Input your interpretation here' 
            multiline
            rows={4} 
            fullWidth
        />
        <Button variant="contained" color="primary" style={{marginTop: '10px'}} fullWidth>Submit for checking</Button>
        <Paper className='parse-input' elevation={1}>
         
            {formatText('Diabete Progression', 'prediction')}
            {getSelection('relation', 'increase with the increase of', (k)=>{}, ['increase with the increase of', 'decrease with the increase of', 'increase with the decrease of', 'decrease with the decrease of'])} 
            {formatText('bmi', 'feature')}
            {getSelection('condition', 'when bmi >25', (k)=>{}, ['when bmi >25', 'when bmi <25'])}
         
        </Paper>
    </Paper>
}