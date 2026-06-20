import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting additional certification learning content seed...');

  // Add content for Azure Administrator Associate (AZ-104)
  const azureAdmin = await prisma.certification.findUnique({
    where: { code: 'AZ-104' },
  });

  if (azureAdmin) {
    console.log('📚 Seeding Azure Administrator Associate Learning Modules...');

    const azureAdminModules = [
      {
        title: 'Module 1: Manage Azure Identities and Governance',
        description: 'Master Azure Active Directory, users, groups, and governance policies.',
        order: 1,
        lessons: [
          {
            title: 'Azure Active Directory Fundamentals',
            slug: 'azure-ad-fundamentals',
            order: 1,
            estimatedTime: 20,
            content: `
# Azure Active Directory Fundamentals

## What is Azure Active Directory (Azure AD)?

Azure Active Directory is Microsoft's cloud-based identity and access management service. It helps your employees sign in and access resources in:
- External resources (Microsoft 365, Azure portal, SaaS applications)
- Internal resources (corporate network, intranet, cloud apps)

### Azure AD vs. On-Premises Active Directory

| Feature | On-Premises AD | Azure AD |
|---------|---------------|----------|
| **Protocol** | LDAP, Kerberos | REST APIs, SAML, OAuth 2.0, OpenID Connect |
| **Structure** | Forest, Domain, OU | Tenant, Directory |
| **Query** | LDAP | Microsoft Graph API |
| **Authentication** | NTLM, Kerberos | SAML, OAuth 2.0, OpenID Connect |
| **Location** | On-premises servers | Microsoft cloud |
| **Management** | Group Policy | Conditional Access policies |

---

## Azure AD Core Components

### Tenants
- **Definition**: Dedicated instance of Azure AD for an organization
- **Automatic Creation**: Created when you sign up for Azure, Microsoft 365, etc.
- **Isolation**: Each tenant is separate and distinct
- **Custom Domain**: Add your own domain names (contoso.com)

### Users
Types of user accounts in Azure AD:
- **Cloud Identity**: User accounts that exist only in Azure AD
- **Directory-Synchronized**: User accounts from on-premises AD synced to Azure AD
- **Guest Users**: External users invited to collaborate (B2B)

### Groups
Organize users to simplify permission management:
- **Security Groups**: Control access to resources
- **Microsoft 365 Groups**: Collaboration groups with shared mailbox, calendar, files
- **Assignment Types**: Assigned (manual) or Dynamic (rule-based)

### Applications
Register applications to enable authentication:
- **Enterprise Applications**: Pre-integrated SaaS apps
- **App Registrations**: Custom applications you develop
- **Application Proxy**: Publish on-premises apps securely

---

## Azure AD Editions

### Free Edition
- **User/Group Management**: Basic user and group management
- **SSO**: Up to 10 applications
- **Self-Service Password Reset**: Cloud users only
- **Company Branding**: Basic customization
- **User Limit**: 500,000 users

### Premium P1
- **Advanced Group Management**: Dynamic groups, self-service group management
- **Hybrid Identity**: Azure AD Connect Health, password writeback
- **Conditional Access**: Location-based policies
- **Self-Service Password Reset**: On-premises users
- **Advanced Reporting**: Usage and audit reports

### Premium P2
- **Identity Protection**: Risk-based conditional access
- **Privileged Identity Management**: Just-in-time access to privileged roles
- **Access Reviews**: Regular review of user access
- **Advanced Investigation**: Security reports and alerts

---

## Authentication Methods

### Password-Based Authentication
- Traditional username/password combination
- Vulnerable to password attacks
- Should be combined with MFA

### Multi-Factor Authentication (MFA)
Additional verification beyond password:
- **Something you know**: Password, PIN
- **Something you have**: Phone, hardware token
- **Something you are**: Biometric (fingerprint, face)

**MFA Methods in Azure AD:**
- Microsoft Authenticator app
- SMS text messages
- Voice calls
- Hardware OATH tokens
- FIDO2 security keys

### Passwordless Authentication
- **Windows Hello for Business**: Biometric or PIN-based
- **Microsoft Authenticator**: Phone sign-in
- **FIDO2 Security Keys**: Hardware-based authentication

---

## Single Sign-On (SSO)

### Benefits of SSO
- **User Experience**: One set of credentials for multiple applications
- **Security**: Reduced password fatigue, better compliance
- **Administration**: Centralized access management
- **Cost Reduction**: Lower help desk costs

### SSO Methods
- **Password-based SSO**: Store credentials in Azure AD
- **SAML-based SSO**: Security Assertion Markup Language
- **OpenID Connect**: Modern authentication protocol
- **Header-based SSO**: For applications that use headers for authentication

### Application Integration
Azure AD supports thousands of pre-integrated applications:
- **SaaS Applications**: Salesforce, ServiceNow, Dropbox
- **On-Premises Apps**: Via Application Proxy
- **Custom Applications**: Your own developed apps

---

## Conditional Access

### Overview
Conditional Access policies are if-then statements: if a user wants to access a resource, then they must complete an action.

### Policy Components

**Assignments (Who and What):**
- **Users and Groups**: Who the policy applies to
- **Cloud Apps**: Which applications are covered
- **Conditions**: When the policy applies (location, device, etc.)

**Access Controls (Then):**
- **Grant Controls**: Allow access with requirements (MFA, compliant device)
- **Session Controls**: Limit the session (sign-in frequency, app restrictions)

### Common Conditional Access Scenarios

**Require MFA for Administrators**
- Users: Global administrators
- Cloud apps: All cloud apps
- Grant: Require MFA

**Block Access from Untrusted Locations**
- Users: All users
- Conditions: Locations outside corporate network
- Grant: Block access

**Require Compliant Device for Sensitive Apps**
- Cloud apps: Financial applications
- Grant: Require device to be compliant
- Session: Persistent browser session disabled
            `,
          },
        ],
      },
    ];

    // Create Azure Admin modules
    for (const modData of azureAdminModules) {
      const mod = await prisma.learningModule.upsert({
        where: {
          id: `azure-admin-mod-${modData.order}-${azureAdmin.id}`,
        },
        update: {
          title: modData.title,
          description: modData.description,
          order: modData.order,
        },
        create: {
          id: `azure-admin-mod-${modData.order}-${azureAdmin.id}`,
          title: modData.title,
          description: modData.description,
          order: modData.order,
          certificationId: azureAdmin.id,
        },
      });
      for (const lesData of modData.lessons) {
        await prisma.learningLesson.upsert({
          where: {
            moduleId_slug: {
              moduleId: mod.id,
              slug: lesData.slug,
            },
          },
          update: {
            title: lesData.title,
            content: lesData.content,
            order: lesData.order,
            estimatedTime: lesData.estimatedTime,
          },
          create: {
            title: lesData.title,
            slug: lesData.slug,
            content: lesData.content,
            order: lesData.order,
            estimatedTime: lesData.estimatedTime,
            moduleId: mod.id,
          },
        });
      }
    }

    console.log('✅ Azure Administrator Associate learning content seeded successfully');
  }

  // Add content for GCP Associate Cloud Engineer
  const gcpAce = await prisma.certification.findUnique({
    where: { code: 'ASSOCIATE-CLOUD-ENGINEER' },
  });

  if (gcpAce) {
    console.log('📚 Seeding GCP Associate Cloud Engineer Learning Modules...');

    const gcpAceModules = [
      {
        title: 'Module 1: Setting Up Google Cloud Environment',
        description: 'Learn Google Cloud fundamentals, projects, billing, and basic resource management.',
        order: 1,
        lessons: [
          {
            title: 'Google Cloud Platform Overview and Setup',
            slug: 'gcp-overview-setup',
            order: 1,
            estimatedTime: 18,
            content: `
# Google Cloud Platform Overview and Setup

## Google Cloud Platform Architecture

### Global Infrastructure
Google Cloud Platform operates one of the world's largest and most advanced computer networks. This network is designed for:
- **Performance**: Low latency, high bandwidth
- **Reliability**: Redundant systems and failover capabilities  
- **Security**: Multiple layers of security controls
- **Scalability**: Elastic scaling based on demand

### Physical Infrastructure Hierarchy

**Data Centers**
- Physical facilities housing servers and networking equipment
- Geographically distributed across the globe
- Advanced cooling, power, and security systems
- Environmental sustainability focus

**Points of Presence (PoPs)**
- Network connection points for users to access Google's network
- 140+ PoPs worldwide
- Reduce latency by bringing services closer to users
- Support Cloud CDN and other edge services

**Regions**
- Independent geographic areas consisting of zones
- 35+ regions worldwide (and growing)
- Examples: us-central1, europe-west1, asia-east1
- Each region has multiple zones for fault tolerance

**Zones** 
- Deployment areas within regions for resources
- Isolated fault domains within regions
- Typically 3+ zones per region
- Examples: us-central1-a, us-central1-b, us-central1-c

---

## Resource Hierarchy

### Organization
- **Root node** of the Google Cloud resource hierarchy
- **Represents a company or organization**
- **Linked to a Google Workspace or Cloud Identity domain**
- **Provides centralized control** over all Google Cloud resources

### Folders
- **Optional grouping mechanism** between organization and projects
- **Organize projects** by department, environment, team, or application
- **Inherit IAM policies** from organization and pass to projects
- **Examples**: Production folder, Development folder, Marketing folder

### Projects
- **Core organizing entity** in Google Cloud
- **Required for all resource usage**
- **Billing boundary** - costs are tracked per project
- **Provide resource isolation**
- **Have unique project ID** (globally unique across Google Cloud)

**Project Properties:**
- **Project Name**: Human-readable display name
- **Project ID**: Unique identifier (cannot be changed after creation)
- **Project Number**: Automatically assigned numeric identifier

### Resources
- **Services and APIs** available within projects
- **Examples**: Virtual machines, databases, storage buckets
- **Managed through Google Cloud Console, CLI, or APIs**
- **Subject to project quotas and limits**

---

## Identity and Access Management (IAM)

### IAM Policy Structure
IAM policies bind **members** to **roles** at various levels of the resource hierarchy.

**Members (Who):**
- Google Accounts (user@example.com)
- Service Accounts (service@project.iam.gserviceaccount.com)
- Google Groups (group@example.com)
- Google Workspace domains (example.com)
- Cloud Identity domains

**Roles (What permissions):**
- **Basic Roles**: Owner, Editor, Viewer (legacy, avoid in production)
- **Predefined Roles**: Curated by Google for specific services
- **Custom Roles**: User-defined roles with specific permissions

### Permission Inheritance
- **Policies are inherited** down the hierarchy
- **Organization** → **Folder** → **Project** → **Resource**
- **Child resources inherit** permissions from parent resources
- **Cannot restrict inherited permissions** (only grant additional ones)

### Service Accounts
- **Non-human identities** for applications and services
- **Used for server-to-server authentication**
- **Two types**:
  - **Google-managed**: Created automatically by Google services
  - **User-managed**: Created and managed by you

**Service Account Keys:**
- **JSON key files**: Can be downloaded and used for authentication
- **Security risk**: Should be avoided when possible
- **Better alternatives**: IAM roles for service accounts, Workload Identity

---

## Billing and Cost Management

### Billing Accounts
- **Payment instrument** for Google Cloud usage
- **Required to use paid Google Cloud services**
- **Types**:
  - **Individual**: Personal credit card billing
  - **Invoiced**: Monthly invoicing for organizations

### Budget and Alerts
- **Budget**: Set spending limits for projects or billing accounts  
- **Budget Alerts**: Email notifications when spending thresholds are reached
- **Programmatic Budgets**: Automated responses to budget alerts via Cloud Functions

### Cost Management Best Practices
- **Resource Labeling**: Tag resources for cost allocation
- **Right-sizing**: Choose appropriate machine types and sizes
- **Committed Use Discounts**: Save money with 1-year or 3-year commitments
- **Sustained Use Discounts**: Automatic discounts for long-running workloads
- **Preemptible Instances**: Up to 80% savings for fault-tolerant workloads

### Cloud Billing API
- **Programmatic access** to billing information
- **Export billing data** to BigQuery for analysis
- **Create custom billing reports** and dashboards
- **Integrate with existing business intelligence tools**

---

## Google Cloud Console and Tools

### Google Cloud Console
- **Web-based interface** for managing Google Cloud resources
- **Dashboard view** of resource utilization and costs
- **Cloud Shell**: Browser-based command line with pre-installed tools
- **Activity logs**: Track actions performed in your projects

### Command Line Tools

**gcloud CLI**
- **Primary command-line tool** for Google Cloud
- **Manage compute, storage, networking, and other services**
- **Authentication**: gcloud auth login
- **Configuration**: gcloud config set project [PROJECT-ID]

**gsutil**
- **Command-line tool** for Cloud Storage
- **Copy files**: gsutil cp local-file gs://bucket-name/
- **Sync directories**: gsutil rsync -r local-dir gs://bucket-name/

**kubectl** 
- **Kubernetes command-line tool**
- **Manage GKE clusters** and containerized applications
- **Deploy applications**: kubectl apply -f deployment.yaml

### APIs and Client Libraries
- **REST APIs**: HTTP-based APIs for all Google Cloud services
- **Client Libraries**: Language-specific libraries (Python, Java, Node.js, etc.)
- **Authentication**: OAuth 2.0, service account keys, Application Default Credentials
- **API Keys**: For public APIs that don't access private data
            `,
          },
        ],
      },
    ];

    // Create GCP ACE modules  
    for (const modData of gcpAceModules) {
      const mod = await prisma.learningModule.upsert({
        where: {
          id: `gcp-ace-mod-${modData.order}-${gcpAce.id}`,
        },
        update: {
          title: modData.title,
          description: modData.description,
          order: modData.order,
        },
        create: {
          id: `gcp-ace-mod-${modData.order}-${gcpAce.id}`,
          title: modData.title,
          description: modData.description,
          order: modData.order,
          certificationId: gcpAce.id,
        },
      });

      for (const lesData of modData.lessons) {
        await prisma.learningLesson.upsert({
          where: {
            moduleId_slug: {
              moduleId: mod.id,
              slug: lesData.slug,
            },
          },
          update: {
            title: lesData.title,
            content: lesData.content,
            order: lesData.order,
            estimatedTime: lesData.estimatedTime,
          },
          create: {
            title: lesData.title,
            slug: lesData.slug,
            content: lesData.content,
            order: lesData.order,
            estimatedTime: lesData.estimatedTime,
            moduleId: mod.id,
          },
        });
      }
    }

    console.log('✅ GCP Associate Cloud Engineer learning content seeded successfully');
  }

  console.log('✅ All additional learning content seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding additional content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });