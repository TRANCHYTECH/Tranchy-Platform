@description('Specifies the location for resource.')
param location string

@description('Specifies the name of the container app.')
param containerAppName string

param aspNetEnv string = 'Production'

@description('Specifies the docker container image to deploy.')
param containerImage string = 'mcr.microsoft.com/k8se/quickstart:latest'

@description('Number of CPU cores the container can use. Can be with a maximum of two decimals.')
@allowed([
  '0.25'
  '0.5'
  '0.75'
  '1'
  '1.25'
  '1.5'
  '1.75'
  '2'
])
param cpuCore string = '0.25'

@description('Amount of memory (in gibibytes, GiB) allocated to the container up to 4GiB. Can be with a maximum of two decimals. Ratio with CPU cores must be equal to 2.')
@allowed([
  '0.5'
  '1'
  '1.5'
  '2'
  '3'
  '3.5'
  '4'
])
param memorySize string = '0.5'

@description('Minimum number of replicas that will be deployed')
@minValue(0)
@maxValue(25)
param minReplicas int = 1

@description('Maximum number of replicas that will be deployed')
@minValue(0)
@maxValue(25)
param maxReplicas int = 3

param environmentName string
param revisionMode string = 'Single'
param containerRegistry string
param userAssignedIdentity string

resource environment 'Microsoft.App/managedEnvironments@2023-04-01-preview' existing = {
  name: environmentName
}
// var serviceBusNameSpaceName = 'vgtrunnerdev'

// resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' existing = {
//   name: serviceBusNameSpaceName
// }
resource uai 'Microsoft.ManagedIdentity/userAssignedIdentities@2022-01-31-preview' existing = {
  name: userAssignedIdentity
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: containerAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${uai.id}': {}
    }
  }
  properties: {
    environmentId: environment.id
    configuration: {
      activeRevisionsMode: revisionMode
      registries: [
        {
          identity: uai.id
          server: containerRegistry
        }
      ]
      ingress: {
        external: false
      }
      dapr: {
        enabled: false
      }
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: containerImage
          env: [
            {
              name: 'DOTNET_ENVIRONMENT'
              value: aspNetEnv
            }
          ]
          resources: {
            cpu: json(cpuCore)
            memory: '${memorySize}Gi'
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'cpu-scale-rule'
            custom: {
              type: 'cpu'
              metadata: {
                metricType : 'Utilization'
                value: '70'
              }
            }
          }
          {
            name: 'memory-scale-rule'
            custom: {
              type: 'memory'
              metadata: {
                metricType : 'AverageValue'
                value: '70'
              }
            }
          }
        ]
      }
    }
  }
}
