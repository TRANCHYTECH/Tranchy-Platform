
az ad sp create-for-rbac --name "tranchy-platform-github" --role contributor --scopes /subscriptions/ec4dddda-f3cb-4c93-a2f1-4f3c705dfc88/resourceGroups/rg-vg-tn-dev-sa-001 --sdk-auth

### Step 2
Init environments:
Run bicep 
Custom domain registrations: Could replace by bicep script
