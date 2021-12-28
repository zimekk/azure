import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as azuread from "@pulumi/azuread";

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
