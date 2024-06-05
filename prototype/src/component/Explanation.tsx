
import {Paper, Typography} from '@mui/material';
import shap_diabetes from '../assets/shap_diabetes.json'

import Swarm from './Swarm';
import Scatter from './Scatter';

export default function Explanation() {
    const featureName = 'bmi', 
    featureIndex = shap_diabetes['feature_names'].indexOf(featureName),
    featureValues = shap_diabetes['feature_values'].map((row) => row[featureIndex]),
    shapValues = shap_diabetes['shap_values'].map((row) => row[featureIndex]);
    return <Paper style={{padding: '15px'}}>
        <Typography variant="h5" gutterBottom>
            Visual Explanation
        </Typography>
        <svg className="swarm" width={800} height={500}>
            <Swarm xValues={shapValues} colorValues={featureValues} width={400} height={100} id='bmi'/>
            <Scatter yValues={shapValues} xValues={featureValues} width={400} height={300} id='bmi-scatter' offsets={[0, 150]}/>
        </svg>
    </Paper>
}