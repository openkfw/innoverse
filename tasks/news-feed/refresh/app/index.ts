import { AzureFunction, Context } from '@azure/functions';
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const credential = new DefaultAzureCredential();

const vaultName = process.env.KEY_VAULT_NAME;
const innoverseUrl = "innoverse-url"
const innoverseCredentials = "innoverse-newsfeed-credential"
const keyVaultUrl = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(keyVaultUrl, credential);

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  const innoverseEndpoint = await client.getSecret(innoverseUrl)
  const innoverseEndpointCredentials = await client.getSecret(innoverseCredentials)

  const refreshUrl = `${innoverseEndpoint.value}/api/full-refresh`
  const options = {
    method:'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${innoverseEndpointCredentials.value}`,
    },
  }

  const startTime = new Date().toISOString();

  context.log(`[ ${startTime} ] Calling URL ${refreshUrl}`);
  const request = await fetch(refreshUrl, options);

  if(!request.ok){
    context.log("Error", JSON.stringify(request.statusText))
  }


  var endTime = new Date().toISOString();

  context.log(`[ ${endTime} ] Function completed`);
};

export default timerTrigger;
