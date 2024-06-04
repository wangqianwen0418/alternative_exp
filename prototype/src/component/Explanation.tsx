
import {Paper, Typography} from '@mui/material';
import shap_diabetes from '../assets/shap_diabetes.json'

import Swarm from './Swarm';

export default function Explanation() {
    const featureName = 'bmi', 
    featureIndex = shap_diabetes['feature_names'].indexOf(featureName),
    featureValues = shap_diabetes['feature_values'].map((row) => row[featureIndex]),
    shapValues = shap_diabetes['shap_values'].map((row) => row[featureIndex]);
    return <Paper style={{padding: '15px'}}>
        <Typography variant="h5" gutterBottom>
            Explanation
        </Typography>
        <Swarm xValues={shapValues} colorValues={featureValues} width={400} height={100} id='bmi'/>
       
    </Paper>
}