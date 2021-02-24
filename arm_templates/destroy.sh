#!/bin/bash

set -x

az deployment group delete \
  --name sentia \
  --resource-group ejaSentia
