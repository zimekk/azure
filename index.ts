import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";

import * as azuread from "@pulumi/azuread";
import * as containerinstance from "@pulumi/azure-native/containerinstance";
import * as containerregistry from "@pulumi/azure-native/containerregistry";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";

import { config } from "dotenv";

const env = config();

export const clientConfig = azuread.getClientConfig();

export const REDIRECT_URI = "http://localhost:8080/api/auth";

// Directory (tenant) ID
export const AZURE_AUTHORITY = clientConfig.then(
  ({ tenantId }) => `https://login.microsoftonline.com/${tenantId}`
);

// https://www.pulumi.com/registry/packages/azuread/api-docs/application/
const application = new azuread.Application("azure", {
  displayName: "Azure App",
  owners: [clientConfig.then(({ objectId }) => objectId)],
  web: {
    redirectUris: [REDIRECT_URI],
  },
});

// https://www.pulumi.com/registry/packages/azuread/api-docs/applicationpassword/
const applicationPassword = new azuread.ApplicationPassword("client-secret", {
  applicationObjectId: application.objectId,
  displayName: "App Client Secret",
});

// Application (client) ID
export const AZURE_APP_ID = application.applicationId;
export const AZURE_CLIENT_SECRET = applicationPassword.value;

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourceGroup");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("sa", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: storage.SkuName.Standard_LRS,
  },
  kind: storage.Kind.StorageV2,
});

// Export the primary key of the Storage Account
const storageAccountKeys = pulumi
  .all([resourceGroup.name, storageAccount.name])
  .apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName })
  );

export const primaryStorageKey = storageAccountKeys.keys[0].value;

// https://github.com/pulumi/examples/blob/master/azure-ts-appservice-docker/index.ts
const plan = new web.AppServicePlan("plan", {
  resourceGroupName: resourceGroup.name,
  kind: "Linux",
  reserved: true,
  sku: {
    name: "B1",
    tier: "Basic",
  },
});

const customImage = "node-app";
const registry = new containerregistry.Registry("registry", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: "Basic",
  },
  adminUserEnabled: true,
});

const credentials = containerregistry.listRegistryCredentialsOutput({
  resourceGroupName: resourceGroup.name,
  registryName: registry.name,
});

const adminUsername = credentials.apply((credentials) => credentials.username!);
const adminPassword = credentials.apply(
  (credentials) => credentials.passwords![0].value!
);

const myImage = new docker.Image(customImage, {
  imageName: pulumi.interpolate`${registry.loginServer}/${customImage}:v1.0.0`,
  build: { context: ".", env: env.parsed },
  registry: {
    server: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  },
});

const getStartedApp = new web.WebApp("getStartedApp", {
  resourceGroupName: resourceGroup.name,
  serverFarmId: plan.id,
  siteConfig: {
    appSettings: [
      {
        name: "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
        value: "false",
      },
      {
        name: "DOCKER_REGISTRY_SERVER_URL",
        value: pulumi.interpolate`https://${registry.loginServer}`,
      },
      {
        name: "DOCKER_REGISTRY_SERVER_USERNAME",
        value: adminUsername,
      },
      {
        name: "DOCKER_REGISTRY_SERVER_PASSWORD",
        value: adminPassword,
      },
      {
        name: "WEBSITES_PORT",
        value: "8080", // Our custom image exposes port 80. Adjust for your app as needed.
      },
    ],
    alwaysOn: true,
    linuxFxVersion: pulumi.interpolate`DOCKER|${myImage.imageName}`,
  },
  httpsOnly: true,
});

export const getStartedEndpoint = pulumi.interpolate`https://${getStartedApp.defaultHostName}`;

// https://www.pulumi.com/registry/packages/azure-native/how-to-guides/azure-ts-aci/
// https://github.com/pulumi/examples/blob/master/azure-ts-aci/index.ts
const imageName = "mcr.microsoft.com/azuredocs/aci-helloworld";
const containerGroup = new containerinstance.ContainerGroup("containerGroup", {
  resourceGroupName: resourceGroup.name,
  osType: "Linux",
  containers: [
    {
      name: "acilinuxpublicipcontainergroup",
      image: imageName,
      ports: [{ port: 80 }],
      resources: {
        requests: {
          cpu: 1.0,
          memoryInGB: 1.5,
        },
      },
    },
  ],
  ipAddress: {
    ports: [
      {
        port: 80,
        protocol: "Tcp",
      },
    ],
    type: "Public",
  },
  restartPolicy: "always",
});

export const containerIPv4Address = containerGroup.ipAddress.apply(
  (ip) => ip?.ip
);
