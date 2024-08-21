
# Newsfeed Refresh Function

The application automatically updates the cache during write operations. However, it is recommended to perform a full cache refresh periodically to ensure data consistency and optimal performance. This Azure Function App is designed to run every 24 hours, triggering an endpoint responsible for executing the cache refresh.

## Function Overview

The function is scheduled to execute once every 24 hours and invokes a specific endpoint to perform a complete cache refresh. 

### Key Requirements

- **Azure Key Vault**: The function requires access to two specific keys stored in the Azure Key Vault. These keys must be referenced by the function.
- **Environment Variable**: The name of the Azure Key Vault must be provided to the function via an environment variable named `KEY_VAULT_NAME`.

## Environment Variables

The following environment variables are required for the function to operate correctly:

|              Name              	|         Type         	| Required 	|    Location    	| Default 	| Description                                                                                         	 |
|:-------------------------------:	|:--------------------:	|:--------:	|:--------------:	|:-------:	|-------------------------------------------------------------------------------------------------------|
|     `KEY_VAULT_NAME`            	| Environment Variable 	|    Yes   	| Azure Function 	|    -    	| The name of the Azure Key Vault used to store keys needed by the function.                          	 |
|     `innoverse-url`             	| Azure Key Vault Key  	|    Yes   	| Azure Key Vault 	|    -    	| The URL key set to the innoverse deployment                             	                             |
| `innoverse-newsfeed-credential` 	| Azure Key Vault Key  	|    Yes   	| Azure Key Vault 	|    -    	| The credential key required for authenticating the cache refresh request.                           	 |

---
