# ENV=$(git branch --show-current)
ENV=test
ACR_NAME="$ENV"ejasentia
RESOURCE_GROUP="$ENV"EjaSentia
AKS_CLUSTER_NAME="$ENV"EjaSentia

# az acr login --name $ACR_NAME
# az aks get-credentials -n $AKS_CLUSTER_NAME -g $RESOURCE_GROUP
# az aks update -n $AKS_CLUSTER_NAME -g $RESOURCE_GROUP --attach-acr $ACR_NAME
# az acr build -t star-wars-quotes:latest -r $ACR_NAME -f apps/star-wars-quotes/Dockerfile apps/star-wars-quotes

kubectl create ns star-wars-quotes
helm install star-wars-quotes charts/star-wars-quotes \
  --namespace star-wars-quotes \
  --set image.repository="$ACR_NAME".azurecr.io/star-wars-quotes \
  --set mongoDB.url=$(cat mongo-access.txt) \
  --set mongoDB.dbName=$ENV \
  --set mongoDB.collectionName="star-wars-quotes"

kubectl create ns sftp-server
helm install sftp-server charts/sftp-server \
  --namespace sftp-server