
const https = require('https'); //make sure it's httpS not plain http
const fs = require('fs');
const path = require('path');
//require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) 

const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const vaultName = process.env.KEY_VAULT_NAME_DEV;
const url = `https://${vaultName}.vault.azure.net`;
const secretClient = new SecretClient(url, credential);

async function getCertKey() { 
    certificateName = process.env.KEY_VAULT_CERT_NAME_DEV;
    fetchedCertificate = await secretClient.getSecret(certificateName); //to pass certificate as a buffer needs getSecret not getCertificate.
    return fetchedCertificate.value;
};

getCertKey().then((res)=> {
    const options = {
        pfx: new Buffer(res, 'base64'), // use Buffer.from on node.js version 10.0.0 or higher. this code works well with node.js version 8.9.4.
        passphrase : '', //Azure Key Vault does not provide password so you have to leave it blank for it to work. if you specify a password, you get mac verify failure error.
    }
    
    const server = https.createServer(options, (request, response) => {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Hello World!");
    });
    
    const port = process.env.PORT || 1337;
    server.listen(port);
    
    console.log("Server running at https://localhost:%d", port);
});

getCertKey().catch((err) => {
    console.log("error code: ", err.code);
    console.log("error message: ", err.message);
    console.log("error stack: ", err.stack);
});
