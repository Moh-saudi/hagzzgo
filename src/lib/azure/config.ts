// src/lib/azure/config.ts
import { BlobServiceClient } from '@azure/storage-blob';

export const azureStorageConfig = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
  sasToken: process.env.AZURE_STORAGE_SAS_TOKEN || '',
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'uploads'
};

// التحقق من متغيرات البيئة
if (!azureStorageConfig.accountName || !azureStorageConfig.sasToken) {
  throw new Error("🚨 تأكد من ضبط متغيرات البيئة الخاصة بـ Azure بشكل صحيح!");
}

const blobServiceClient = new BlobServiceClient(
  `https://${azureStorageConfig.accountName}.blob.core.windows.net?${azureStorageConfig.sasToken}`
);

const getContainerClient = () => blobServiceClient.getContainerClient(azureStorageConfig.containerName);

export { blobServiceClient, getContainerClient };