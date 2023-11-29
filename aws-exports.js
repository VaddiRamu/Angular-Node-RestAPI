awsconfig = {   
    Auth: {     
        identityPoolId: 'us-east-1:80e97e62-0a9f-4375-93f0-995aade3c94a',     
        region: 'us-east-1'   
    },   
    Interactions: {     
        bots: {       
            "BookCab": {         
                "name": "BookCab",         
                "alias": "$LATEST",         
                "region": "us-east-1",       
            },     
        }   
    } 
};
module.exports = awsconfig;