# Sentia Assessment
The purpose of this repository is to provide a solution that will highlight my strengths required by a cloud systems consultant in public cloud consultancy workforce.

## Client's components
- customer facing *Node.js* web application
- NGINX reverse proxy front of the web application
- MongoDB cluster
- FTP document storage
- Cron server for Bash and Python scripts
  - small amount of jobs that need to be executed a few times per day (no more than once per hour)
- old infra's had 3 environments and the components are hosted on several virtual machines.
  - Test, Acceptance and Production
## Client needs:
- azure environment
- infrastructure logs to an ElasticSearch Cluster
- Kibana access cluster/dashboard should not be publically accessible
- be scalable and flexible
- utilize managed services as much as possible.

## Migration plan
- *FTP Server*: As Azure has no managed FTP server we have to deploy one
- *MongoDB*: As mongodb-as-a-service can run also in azure cloud I will choose that option. This does not mean that azure provide this solution. It is provided by mongo.
- *Log*: Azure offers ELK stack as a service
- *Orchestrator*: I will choose AKS, because we will have multiple environment and also cost saving is a point. AKS cluster is cheaper solution than deploy a VM for each service: Node applicatiom, Cron server and FTP server.
- *NGINX*: Follow [azure documentation](https://docs.microsoft.com/en-us/azure/aks/ingress-basic)

