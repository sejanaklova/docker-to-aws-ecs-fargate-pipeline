const express = require('express');
const AWS = require('aws-sdk');

// Create a Systems Manager object
const ssm = new AWS.SSM();
// AWS region set dynamically, default remains eu-central-1
const region = process.env.AWS_REGION || 'eu-central-1';
AWS.config.update({ region });

// AWS.config.update({ region: 'us-east-1' });
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.all('/parameter1', (req, res) => {
    const parameterValue = process.env.PARAMETER_1_VALUE || 'Parameter not found';
    res.send(`The value of the static parameter is: ${parameterValue}`);
});

app.all('/parameter2', async (req, res) => {
    try {
        const data = await ssm.getParameter({
            Name: process.env.PARAMETER_2_NAME,
            WithDecryption: true,
        }).promise();

        const parameterValue = data.Parameter.Value;

        res.send(`The value of the parameter fetched from SSM Parameter Store is: ${parameterValue}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving the parameter.');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
