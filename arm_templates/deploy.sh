#!/bin/bash

set -x

az deployment group create \
  --name sentia \
  --resource-group testEjaSentia \
  --template-file ./azuredeploy.json \
  --parameters ./azuredeploy.parameters.json
