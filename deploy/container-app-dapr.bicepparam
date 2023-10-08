using './container-app-dapr.bicep'

param location = ''
param containerAppName = ''
param env = []
param targetPort = 80
param containerImage = 'mcr.microsoft.com/k8se/quickstart:latest'
param cpuCore = '0.25'
param memorySize = '0.5'
param minReplicas = 1
param maxReplicas = 3
param environmentName = ''
param revisionMode = 'Single'
param containerRegistry = ''
param subDomainCertificate = ''
param azureClientId = 'ab25b142-2288-4372-97c1-80b60b52e92e'
