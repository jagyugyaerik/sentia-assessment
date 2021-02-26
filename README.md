# Sentia Assessment
The purpose of this repository is to provide a solution that will highlight my strengths required by a cloud systems consultant in public cloud consultancy workforce.

## Client needs:
- azure environment
- infrastructure logs to an ElasticSearch Cluster
- Kibana access cluster/dashboard should not be publically accessible
- be scalable and flexible
- utilize managed services as much as possible.

## Migration plan
The next section summarizes which solutions could have been chosen for the migration, which ones I chose, and why.

**Environment isolation**: Currently the customer has 3 different environments: prod, acceptance and test. Azure has different levels of isolation:
- level of resource groups
- level of virtual virtualnetworks
- level of orchestration
  
*Chosen solution*: I will isolate envs by resource groups.

*Reason*: I will make a template infrastucture code which will need a parameter what will tell the script which environment will be.

**Orchestration**: The customer has multiple server applications (CRON server, NodeJs applicationm, Kibana) what could be orchastrated differently in azure:
- Azure Virtualmachines: Basiest way of host an application.
- WebApp: Host scaleable application without managing infrastucture.
- Azure kubernetes services: Managed kubernetes cluster.

*Chosen solution*: AKS

*Reason*: It could be much cheaper the than the other two because aks provision virtualmachines for the nodes not for the application.

**Database**: The main application uses a Mongo database. Azure has no pure mongodb-as-a-service they provide a api for mongo in cosmosdb.

*Chosen solution*: I will choose MongoAtlas which is a MongoDB-as-a-service.

*Reason*: Cosmosdb extremly expensive, supports only mongo version 3.2 and 3.6 and still not a mongo database.

**Elasticsearch for logging**: The client would like to store the logs in a elasticsearch document store instead of the default mssql database which is provided by the LogAnalytics workespace. Currently microsoft has 2 options for elastic:
- managed elasticseach cluster
- self-managed elasticstack: This is a elasticsearch, logstash and kibana solution. The user needs to install and manage this stack.

*Chosen solution*: managed elasticsearch cluster

*Reason*: No management is a big plus. We can install Kibana with our orchestration and much easier to manage a kibana server. We can reuse the omsagents to send the logs into elasticsearch.

**Traffic routing**: Azure provide a Application Gateway which is L7 Loadbalancer and L4 load balancers. We can set firewall and ingress rules which enough for criterias. The app gateway can be installed with arm template or as an app gateway controller which is a kubernetes solution. Custom ssl issuer can be installed like letsencrypt.

*Chosen solution*: Application Gateway Ingress Controller with letsencrypt issuer.

*Reason*: As we will have a AKS cluster I think we can relay on the azure resource manager to deploy the app gateway automaticaly. If this not secure enough we can change the solution.

## Deploy the solution
Steps of the installation:

First we will need a service principal who has the necsessary right to run the github action:
```bash
az ad sp create-for-rbac --name github --role contributor --scopes /subscriptions/{subscription-id}--sdk-auth
```
Then you have to set AZURE_CREDENTIALS at github settings as a secret:
```JSON
{
    "clientId": "APP_ID",
    "clientSecret": "APP_SECRET",
    "tenantId": "TENANT",
    "subscriptionId": "SUBSCRIPTION_ID"
}
```
Then you have to make a service principal for the kubernetes cluster, who will need network contributor role to make the load balancers for the app gateway controller.
 ```bash
az ad sp create-for-rbac --skip-assignment --name myAKSClusterServicePrincipal
az role assignment create --assignee myAKSClusterServicePrincipal --role "Network Contributor"
```
Then you have to run CICD github action to provision the infrastucture.

After it is finished you can deploy the application with the next script:
```bash
az login
./deploy_apps.sh
```

## Repo information
- apps: You can find the applications here.
  - star-wars-quotes: This is the main application which is a containerized nodejs express project with mongo access.