# purecloud-node-connector
Purecloud web services datadip connector using NodeJS to retrieve Account info from SQL database

Installation is pretty straightforward as it is a standard Node application. I assume you have a working Node installation; from there setup a new node project. Include following packages:
- express
- bodyparser
- mssql

## PureCloud configuration
Also the PureCloud setup is very standard.
- Add a Web Services Data Dip Connector as described here: https://help.mypurecloud.com/articles/add-web-services-data-dip-connector/ and enter a name, e.g. NodeJS_WS_Connector, choose the connector 'webservices-datadip' and click Save.
- Configure the connector as described here: https://help.mypurecloud.com/articles/configure-web-services-data-dip-connector/ and put as PluginName e.g. webservices-NodeJS-datadip and as EndpointAddress http://localhost:8081/. The port is defined in the Node application.
- Add a bridge action as described here: https://help.mypurecloud.com/articles/add-bridge-actions-web-services-data-dip-connector/. Select 'NodeJS_WS_Connector' group and 'GetAccountByAccountNumber' action and click next button. Name the action as e.g. 'Node_GetAccByAccNr' and add category name e.g. 'WStoNode'. Check 'Flatten metadata' and click add action. Publish the action.

## How do I use it?
- Please check these instructions first: https://help.mypurecloud.com/articles/use-bridge-actions-architect-web-services-data-dip-connector/. Add a new bridge action in Architect. Select category as 'WStoNode' and select action 'Node_GetAccByAccNr'.
- For the Inputs you have to provide the AccountNumber you want to lookup in the database. This is most likely a variable that was assigned to user input at the beginning of the call flow, so you enter it here.
- If the request was successful it will have returned the correct information and have it made available in the different relevant output fields. After this the values can be used in the call flow or can be assigned to variables in a script.

## Database model
The database to connect to in the example code is "CRM" and the table is dbo.customers. The structure is very simple and has following columns (all as varchars):
- AccountNumber
- Name
- StreetName
- StreetNumber
- ZIP
- City
- Phone
- Email
The example code is very clear and straightforward so adopt to your own needs and setup.
