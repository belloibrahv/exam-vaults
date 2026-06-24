import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { seedAWSCloudPractitioner } from './seed-aws-cloud-practitioner.js';
import { seedGCPCloudDigitalLeader } from './seed-gcp-cloud-digital-leader.js';

const prisma = new PrismaClient();

type SeedQuestion = {
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[];
  explanation: string;
  category:
    | 'DIGITAL_TRANSFORMATION'
    | 'DATA_AND_AI'
    | 'INFRASTRUCTURE_MODERNIZATION'
    | 'SECURITY_AND_OPERATIONS'
    | 'SCALING_AND_OPERATIONS';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  references?: string[];
};

function loadAdvancedQuestions(): SeedQuestion[] {
  try {
    const questionDir = join(process.cwd(), 'prisma/questions');
    const advancedFiles = readdirSync(questionDir)
      .filter(
        (name) =>
          name.startsWith('gcp-gdl-advanced-') && name.endsWith('.json')
      )
      .sort();

    const merged: SeedQuestion[] = [];

    for (const file of advancedFiles) {
      const path = join(questionDir, file);
      const raw = readFileSync(path, 'utf-8');
      const parsed = JSON.parse(raw) as SeedQuestion[];

      if (!Array.isArray(parsed)) {
        console.warn(`⚠️ Advanced GDL file ${file} is not an array. Skipping.`);
        continue;
      }

      merged.push(...parsed);
    }

    return merged;
  } catch (error) {
    console.warn('⚠️ Could not load advanced GDL question files. Skipping.', error);
    return [];
  }
}

function getGdlSubdomainTag(category: SeedQuestion['category']): string {
  switch (category) {
    case 'DIGITAL_TRANSFORMATION':
      return 'GDL_1_DIGITAL_TRANSFORMATION';
    case 'DATA_AND_AI':
      return 'GDL_2_3_DATA_AND_AI';
    case 'INFRASTRUCTURE_MODERNIZATION':
      return 'GDL_4_INFRA_MODERNIZATION';
    case 'SECURITY_AND_OPERATIONS':
      return 'GDL_5_TRUST_SECURITY';
    case 'SCALING_AND_OPERATIONS':
      return 'GDL_6_SCALING_OPERATIONS';
    default:
      return 'GDL_MISC';
  }
}

async function main() {
  console.log('🌱 Seeding database with users and GCDL questions...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techvaults.com' },
    update: {},
    create: {
      email: 'admin@techvaults.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test admin user
  const testAdminPassword = await hash('testadmin123', 12);
  const testAdmin = await prisma.user.upsert({
    where: { email: 'testadmin@techvaults.com' },
    update: {},
    create: {
      email: 'testadmin@techvaults.com',
      name: 'Test Admin',
      password: testAdminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Test admin user created:', testAdmin.email);

  // Create sample student
  const studentPassword = await hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@techvaults.com' },
    update: {},
    create: {
      email: 'student@techvaults.com',
      name: 'Test Student',
      password: studentPassword,
      role: 'STUDENT',
    },
  });
  console.log('✅ Student user created:', student.email);

  // Create additional test students
  const testStudents = [
    { email: 'john.doe@techvaults.com', name: 'John Doe' },
    { email: 'jane.smith@techvaults.com', name: 'Jane Smith' },
    { email: 'mike.johnson@techvaults.com', name: 'Mike Johnson' },
    { email: 'sarah.williams@techvaults.com', name: 'Sarah Williams' },
    { email: 'david.brown@techvaults.com', name: 'David Brown' },
  ];

  for (const studentData of testStudents) {
    await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        name: studentData.name,
        password: studentPassword, // Same password for all test students
        role: 'STUDENT',
      },
    });
    console.log('✅ Test student created:', studentData.email);
  }

  // Get GCDL certification and domains
  const gcdlCert = await prisma.certification.findUnique({
    where: { code: 'CLOUD-DIGITAL-LEADER' },
    include: { domains: true },
  });

  if (!gcdlCert) {
    console.error('❌ GCDL certification not found. Run seed-migration.ts first!');
    return;
  }

  console.log('📚 Seeding GCDL Learning Modules and Lessons...');

  const modulesData = [
    {
      title: 'Module 1: General Cloud Knowledge, Economics & Digital Transformation',
      description: 'Understand cloud computing fundamentals, strategic business value, organizational change, CapEx vs OpEx, TCO, and cloud-native architecture.',
      order: 1,
      lessons: [
        {
          title: 'Cloud Computing, Strategic Business Value & Total Cost of Ownership (TCO)',
          slug: 'intro-to-cloud-computing',
          order: 1,
          estimatedTime: 12,
          content: `
# Cloud Computing, Strategic Business Value & Total Cost of Ownership (TCO)

## What is Cloud Computing?
Cloud computing is the on-demand delivery of IT resources (compute power, storage, databases, and networking) over the internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, organizations lease these services from cloud providers like Google Cloud.

### NIST Five Essential Characteristics of Cloud Computing
1. **On-demand self-service:** Users can provision computing resources (like server time or network storage) automatically as needed, without requiring human interaction with the cloud provider.
2. **Broad network access:** Capabilities are available over the network and accessed through standard mechanisms (e.g., mobile phones, tablets, laptops, workstations).
3. **Resource pooling:** The provider’s physical and virtual resources are pooled to serve multiple consumers using a multi-tenant model. Resources are dynamically assigned and reassigned based on demand.
4. **Rapid elasticity:** Resources can be elastically provisioned and released—automatically scaling out or in—to match real-time workload fluctuations.
5. **Measured service:** Cloud resource usage is monitored, controlled, and reported. This provides transparency for both the provider and consumer through a metered billing system.

---

## The Strategic Business Value of Cloud

A common misconception is that cloud adoption is a purely technical change. In reality, cloud adoption is a **strategic business driver** that enables:
- **New Business Models:** Speed to deploy allows organizations to enter new markets and create new revenue streams quickly.
- **Faster Experimentation & Innovation:** Low cost of failure allows teams to launch, test, and discard ideas rapidly.
- **Improved Customer Outcomes:** Continuous updates and global deployments mean customer feedback is addressed in days, not quarters.
- **Organizational Agility:** Moving away from static, quarterly product release cycles to weekly or daily updates.

### Digital Transformation Blockers
Digital transformation is organizational as much as it is technical. Major blockers include:
- **People & Process Resistance:** Failure to adapt team structures and workflows.
- **Lack of Change Management:** Not training employees or failing to build a cloud-first culture.
- **Outdated Operating Models:** Applying legacy, ticketing-based procurement processes to high-speed cloud environments.

---

## Financial Shift: CapEx vs. OpEx

Cloud adoption shifts IT spending from a Capital Expenditure model to an Operational Expenditure model.

| Financial Model | Definition | Example in IT | Business Implications |
| :--- | :--- | :--- | :--- |
| **CapEx (Capital Expenditure)** | Upfront spending on physical assets that are depreciated over time. | Building data centers, buying servers, purchasing cooling systems. | **High barriers to entry:** Requires large cash reserves. Predictable but inflexible. Risks over-provisioning (waste) or under-provisioning (lost business). |
| **OpEx (Operational Expenditure)** | Ongoing day-to-day business expenses. Fully tax-deductible in the year spent. | Monthly pay-as-you-go bills for Google Cloud services (VMs, storage). | **Low barriers to entry:** Pay only for what you use. Aligns costs directly with customer demand. Requires continuous cost optimization (FinOps). |

### Total Cost of Ownership (TCO)
Comparing cloud to on-premises requires a holistic evaluation of the **Total Cost of Ownership (TCO)**, which includes:
- **Direct Costs:** Hardware purchase, software licenses, network bandwidth.
- **Indirect Costs:** Server administration salaries, physical security guards, real estate lease, power grid connection, backup generators, and server cooling.
- **Operational Friction:** Time spent waiting for server provisioning (weeks/months on-premises vs. minutes in the cloud) and the cost of idle capacity (servers running at 10% utilization just in case traffic spikes).

### Business Agility, Automation & Self-Service
Cloud economics also values **agility**. By utilizing **managed services** and **automation**, organizations reduce operational friction and eliminate infrastructure bottlenecks.
- **Self-Service with Guardrails:** Developers can provision their own infrastructure instantly using a self-service console or APIs. The central IT team configures automated guardrails (policies) rather than manually reviewing tickets. This allows product teams to move fast without compromising compliance or budget.
          `,
        },
        {
          title: 'Cloud Service Models, Deployment Models & Cloud-Native Design',
          slug: 'cloud-service-deployment-models',
          order: 2,
          estimatedTime: 12,
          content: `
# Cloud Service Models, Deployment Models & Cloud-Native Design

To design a modern IT strategy, you must select the appropriate service and deployment models.

## 1. Cloud Service Models (The Responsibility Spectrum)

There are three primary service models, representing a trade-off between control and management overhead:

### Infrastructure as a Service (IaaS)
The cloud provider manages the physical hardware, virtualization, storage, and networking. You manage the Operating System (OS), middleware, runtime, data, and applications.
- **GCP Example:** Compute Engine (Virtual Machines).
- **Control:** Maximum control. You can configure the OS and install custom software.
- **Use Case:** Migrating legacy applications that require specific OS configurations.

### Platform as a Service (PaaS)
The cloud provider manages everything up to the runtime. You only manage the application code and data. The server infrastructure is completely abstracted.
- **GCP Example:** App Engine, Cloud Run.
- **Control:** Moderate control. No access to the underlying OS.
- **Use Case:** Web development teams who want to deploy code without worrying about server maintenance or scaling.

### Software as a Service (SaaS)
The cloud provider manages the entire stack, including the application interface. You simply consume the software.
- **GCP Example:** Google Workspace (Gmail, Drive, Docs, Meet).
- **Control:** Minimal control. Limited to application settings.
- **Use Case:** Core business applications where writing custom software adds no competitive advantage.

---

## 2. Cloud Deployment Models

### Public Cloud
Infrastructure owned and operated by a third-party cloud provider. Multi-tenancy is standard, meaning physical hardware is shared between multiple customers, though virtual isolation guarantees data security.

### Private Cloud
Infrastructure dedicated exclusively to one organization. It can be hosted on-premises or by a third party. Provides custom control and high security at the cost of high CapEx.

### Hybrid Cloud
Integrates public cloud resources with on-premises infrastructure or private clouds. This allows data and workloads to move seamlessly between the environments.
- **Use Case:** A bank that keeps sensitive core customer databases on-premises for regulatory compliance but runs customer-facing mobile applications on Google Cloud for scalability.

### Multi-Cloud
The strategic deployment of workloads across multiple public cloud providers (e.g., Google Cloud + AWS + Azure). This approach helps avoid vendor lock-in, increases redundancy, and allows you to select best-of-breed features.

---

## 3. Cloud-Native Design and Portability

To maximize the benefits of cloud computing, applications should be built using **cloud-native** patterns.

### Microservices Architecture
Unlike a traditional monolithic application where all functions are tightly coupled in a single codebase, a **microservices architecture** divides the application into small, independent services that communicate via APIs.
- **Adaptability:** Independent services can be updated, scaled, and deployed without redeploying or breaking the entire monolith.
- **Scalability:** You can scale only the services that experience heavy traffic (e.g., the checkout service) rather than scaling the entire application.

### Portability and Open Standards
To avoid vendor lock-in, organizations leverage open standards like containerization (Docker) and container orchestration (Kubernetes).
- **Anthos:** Google Cloud's managed enterprise platform that allows you to run, manage, and secure containerized applications consistently across on-premises data centers, Google Cloud, and other public clouds (like AWS and Azure). It uses open-source technologies (like Kubernetes) to enable hybrid and multi-cloud deployment with zero application modification.
          `,
        },
      ],
    },
    {
      title: 'Module 2: Google Cloud Infrastructure Modernization & Global Footprint',
      description: 'Master Google Cloud’s resource hierarchy, global zones/regions, compute options, global networking, and Cloud Armor security.',
      order: 2,
      lessons: [
        {
          title: 'Google Cloud Hierarchy, Global Infrastructure & Data Sovereignty',
          slug: 'gcp-hierarchy-infrastructure',
          order: 1,
          estimatedTime: 12,
          content: `
# Google Cloud Hierarchy, Global Infrastructure & Data Sovereignty

## The Google Cloud Resource Hierarchy
All Google Cloud resources must be organized within a logical hierarchy. This hierarchy dictates how access permissions (IAM) and organization policies are inherited and how billing is structured.

\`\`\`
          [Organization]           <-- Represents the company (linked to company.com)
             /      \\
        [Folder A]  [Folder B]     <-- Groups by department, region, or environment
           /
       [Project 1]                 <-- Core unit for billing, APIs, and resource isolation
         /      \\
      [VM]     [Bucket]            <-- Resource instances
\`\`\`

1. **Organization:** The root node. Represents your company. Created automatically when you link Google Workspace or Cloud Identity.
2. **Folders:** Optional nodes used to group projects. Folders can contain projects or other folders, allowing you to model departments (e.g., "Engineering", "Marketing") or environments (e.g., "Production", "Staging").
3. **Projects:** The base organizing entity. All resources must belong to a project. Projects are the level at which billing is tracked, APIs are enabled/disabled, and access permissions are typically isolated.
4. **Resources:** The actual service instances (e.g., a Compute Engine virtual machine, a Cloud Storage bucket, a BigQuery dataset).

### Policy Inheritance
Permissions (IAM roles) and guardrails (Organization Policies) flow downwards. If you grant a user the "Editor" role at the Folder level, that user automatically inherits the "Editor" role for every project and resource inside that folder. You cannot revoke inherited permissions at lower levels; you can only grant additional permissions.

---

## Global Infrastructure: Regions and Zones

Google Cloud's physical network is spread across the globe to ensure high availability, low latency, and compliance.

### Regions
Regions are independent geographic locations where Google hosting facilities are located.
- **Example:** \`us-central1\` (Iowa), \`europe-west1\` (Belgium), \`asia-east1\` (Taiwan).
- **Latency Reduction:** By deploying your application resources in a region close to your primary customer base, you reduce network travel distance and optimize user response times.

### Zones
Zones are isolated locations within a region. They represent single physical failure domains (typically one or more separate physical data centers).
- **Example:** \`us-central1-a\`, \`us-central1-b\`, \`us-central1-c\`.
- **High Availability:** Designing applications to run redundantly across multiple zones protects against data center outages.

### Multi-Region
A broad geographic area containing two or more regions. Useful for geo-redundant storage and low-latency global delivery.
- **Example:** \`us\` (multi-region storing data redundantly across multiple states).

---

## Compliance and Data Sovereignty

Organizations must comply with regional data protection regulations (e.g., GDPR in Europe).
- **Data Sovereignty:** The legal principle that digital data is subject to the laws and regulations of the country in which it is physically located or stored.
- **Compliance Control:** Google Cloud allows you to restrict where resources can be created using Organization Policies (e.g., restricting project creators to only deploy resources within EU regions). This ensures customer data never leaves specified borders.
          `,
        },
        {
          title: 'Compute Services, Global VPC Networking & Perimeter Security',
          slug: 'core-compute-networking',
          order: 2,
          estimatedTime: 12,
          content: `
# Compute Services, Global VPC Networking & Perimeter Security

Google Cloud provides modular compute options and a global network backbone.

## 1. Google Cloud Compute Services

Selecting the right compute service depends on how much management you want to delegate:

| Service | Model | Description | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Compute Engine** | IaaS | Highly customizable virtual machines. Full OS control. | Migrating legacy systems, database hosting, custom software. |
| **Google Kubernetes Engine (GKE)** | Hybrid/Containers | Managed Kubernetes for deploying containerized microservices. | High-scale container applications, microservice architectures. |
| **App Engine** | PaaS | Serverless web app hosting. Upload code; Google scales the infrastructure. | Web applications, mobile backends, REST APIs. |
| **Cloud Run** | Serverless | Serverless runtime that runs container images. Scales down to zero when idle. | Event-driven microservices, public web services. |
| **Cloud Functions** | FaaS | Serverless execution of single-purpose code blocks in response to cloud events. | Ingesting webhook data, responding to database modifications. |

---

## 2. Global VPC Networking

A **Virtual Private Cloud (VPC)** is a secure, isolated private network inside Google Cloud.

### Key Characteristics:
- **Global Scope:** Unlike other cloud providers whose VPCs are regional, Google Cloud VPCs are global. You can connect virtual machines in Europe and the US to the same VPC without setting up VPNs.
- **Regional Subnets:** Subnets are regional resources. Each subnet defines a range of private IP addresses within a specific region.
- **Firewall Rules:** Allow you to control which packets can travel to which virtual machines (ingress/egress rules).
- **Cloud DNS:** Fully managed domain name system to resolve internal and external names.
- **Cloud Load Balancing:** Distributes incoming HTTP(S), TCP, or UDP traffic across multiple instances to optimize resource use and guarantee high availability. Google's load balancers are global and run on Google's private global fiber network.

---

## 3. Perimeter Security and Cloud Armor

Web-facing applications are exposed to threats from the public internet.

### What is Cloud Armor?
Cloud Armor is Google Cloud's distributed **Web Application Firewall (WAF)** and **Distributed Denial of Service (DDoS)** protection service. It works directly with HTTP(S) Load Balancing to protect your applications at the edge of Google's network.
- **DDoS Protection:** Absorbs high-volume volumetric DDoS attacks, keeping your backend servers from being overwhelmed.
- **Security Policies:** Blocks common web attacks like SQL Injection (SQLi) and Cross-Site Scripting (XSS) based on OWASP Top 10 rules.
- **IP Rate Limiting:** Restricts traffic from malicious IP ranges while ensuring legitimate users have uninterrupted access.
          `,
        },
      ],
    },
    {
      title: 'Module 3: Data Analytics, Databases & AI/ML in Google Cloud',
      description: 'Explore unstructured storage, relational and NoSQL databases, smart analytics pipelines with BigQuery and Looker, and Vertex AI/AutoML services.',
      order: 3,
      lessons: [
        {
          title: 'Unstructured Storage Classes & Database Services',
          slug: 'databases-storage-services',
          order: 1,
          estimatedTime: 12,
          content: `
# Unstructured Storage Classes & Database Services

Choosing the correct storage or database option is critical for cost-efficiency and performance.

## 1. Unstructured Data: Cloud Storage

Cloud Storage is a serverless, highly durable service for storing unstructured data (images, videos, backups, document files). Data is stored inside **buckets** as **objects**.

### Cloud Storage Classes
To optimize costs, you must select the correct storage class based on access frequency:

| Storage Class | Min Storage Duration | Ideal Use Case | Cost Profile |
| :--- | :--- | :--- | :--- |
| **Standard** | None | Frequently accessed data, active website images, hot data. | High storage cost, zero access fees. |
| **Nearline** | 30 days | Data accessed less than once a month. Monthly backups, report archives. | Lower storage cost, moderate access fees. |
| **Coldline** | 90 days | Data accessed less than once a quarter. Disaster recovery images. | Very low storage cost, higher access fees. |
| **Archive** | 365 days | Data accessed less than once a year. Long-term compliance backups. | Lowest storage cost, highest access fees. |

---

## 2. Google Cloud Database Services

Data with structure is stored in databases, categorized into Relational (SQL) and Non-Relational (NoSQL):

### Relational Databases (SQL)
Relational databases enforce schemas, tables, and relationships. They are ideal for transactional consistency (ACID compliance).
- **Cloud SQL:** Fully managed MySQL, PostgreSQL, and SQL Server. Google handles replication, backups, and patching. Ideal for standard web apps and CRMs.
- **Cloud Spanner:** A unique, enterprise-grade SQL database that offers horizontal scalability (global scale) combined with relational schema consistency and ACID transactions. Ideal for global financial ledgers and reservation engines.

### Non-Relational Databases (NoSQL)
NoSQL databases offer flexible schemas and scale horizontally to handle high throughput.
- **Firestore:** A serverless, document database that stores JSON-like documents. It automatically synchronizes data across client apps (ideal for mobile and web backends).
- **Cloud Bigtable:** A high-performance, wide-column NoSQL database designed for massive write throughput with low-latency reads. Ideal for IoT sensor data streams, financial market time-series, and real-time ad-tech analytics.
          `,
        },
        {
          title: 'Data Pipelines, Data Warehousing (BigQuery), Looker BI & AI/ML',
          slug: 'data-analytics-ai-ml',
          order: 2,
          estimatedTime: 12,
          content: `
# Data Pipelines, Data Warehousing (BigQuery), Looker BI & AI/ML

Data must be ingested, processed, analyzed, and visualized to create business value.

## 1. Google Cloud Analytics Pipeline

\`\`\`
  [Data Sources] ➔ [Pub/Sub] ➔ [Dataflow] ➔ [BigQuery] ➔ [Looker]
                     (Ingest)    (Process)     (Store/Analyze) (Visualize)
\`\`\`

- **Pub/Sub:** A serverless, global event ingestion service. It decouples senders and receivers, acting as a buffer for streaming data.
- **Dataflow:** A serverless processing service that executes stream and batch data pipelines (based on Apache Beam).
- **BigQuery:** Google Cloud's fully managed, serverless enterprise **data warehouse**. It separates storage and compute, allowing you to run SQL queries over petabytes of data in seconds.
  - *BigQuery ML:* Enables data analysts to build, train, and run machine learning models directly inside BigQuery using standard SQL queries, eliminating the need to export data.
- **Looker:** Google Cloud's modern **Business Intelligence (BI)** and data visualization platform. It connects directly with BigQuery, allowing business users to explore data and build interactive dashboards to drive decision-making.

---

## 2. Artificial Intelligence & Machine Learning

Google Cloud provides tools for both machine learning engineers and business developers:

### Vertex AI
Google Cloud’s unified, end-to-end machine learning platform. It manages the entire ML lifecycle, from data prep and model training to deployment and monitoring, including generative AI foundation models (Gemini).

### AutoML
A service within Vertex AI that allows developers with limited machine learning expertise to train high-quality custom models. You simply upload your labeled dataset (e.g., images of defects) and AutoML automatically trains and optimizes the model.

### Pre-trained AI APIs
For developers who want to integrate intelligent features immediately without training any machine learning models:
- **Cloud Vision API:** Extracts text from images (OCR), detects objects, and performs safety moderation.
- **Translation API:** Dynamically translates text between languages.
- **Natural Language API:** Analyzes text to extract entities, sentiment, and categories.
- **Speech-to-Text & Text-to-Speech:** Transcribes audio files to text and synthesizes lifelike spoken audio from text.
          `,
        },
      ],
    },
    {
      title: 'Module 4: Security, Compliance, Operations & FinOps',
      description: 'Master the shared responsibility model, Identity Access Management (IAM), encryption controls, FinOps cost optimization, and sustainability.',
      order: 4,
      lessons: [
        {
          title: 'Security Responsibilities, Cloud IAM & Key Encryption',
          slug: 'security-access-management',
          order: 1,
          estimatedTime: 12,
          content: `
# Security Responsibilities, Cloud IAM & Key Encryption

Cloud security is built on trust, clear boundaries, and the **Principle of Least Privilege**.

## 1. The Shared Responsibility Model

Security is a partnership between the Cloud Provider and the Customer:

- **Google (Security OF the Cloud):** Google is responsible for the physical security of data centers (cameras, biometric scanners), underlying server hardware, networking fiber, and the hypervisor (virtualization layer).
- **Customer (Security IN the Cloud):** The customer is responsible for configuring access permissions (IAM), securing application code, encrypting customer data, patching operating systems on Virtual Machines (IaaS), and configuring network firewalls.

---

## 2. Cloud Identity and Access Management (IAM)

IAM controls **who** (principals) has **what access** (roles) to **which resources**.

### Core Concepts:
- **Principals:** An identity, such as a Google Account, a Google Group, or a **Service Account** (a non-human identity used by applications or virtual machines to authorize API calls).
- **Roles:** A collection of permissions.
  - *Primitive Roles:* Owner, Editor, Viewer (legacy roles with broad, project-wide permissions. Avoid in production).
  - *Predefined Roles:* Fine-grained roles managed by Google (e.g., \`Storage Object Viewer\` has read access only to Cloud Storage objects).
  - *Custom Roles:* User-defined roles containing specific permissions.
- **Principle of Least Privilege:** A security best practice stating that identities should only be granted the minimum permissions necessary to complete their job, minimizing the blast radius of a compromised credential.
- **Identity-Aware Proxy (IAP):** An access control tool that verifies user identity and context (like device security posture) before granting access to applications and VMs, removing the need for traditional corporate VPNs.

---

## 3. Data Encryption & Key Management

Google Cloud encrypts data by default, both at rest and in transit.
- **Default Encryption:** Google automatically encrypts data at rest using keys managed by Google.
- **Customer-Managed Encryption Keys (CMEK):** For advanced compliance, customers can generate, rotate, and control their own encryption keys using **Cloud Key Management Service (KMS)**. This gives the customer full control over who has access to read the encrypted data.
          `,
        },
        {
          title: 'FinOps, Cost Management & Google Cloud Sustainability',
          slug: 'finops-cost-management',
          order: 2,
          estimatedTime: 11,
          content: `
# FinOps, Cost Management & Google Cloud Sustainability

Cloud financial management (FinOps) aligns spending with business value.

## 1. Cost Optimization & Discount Models

Google Cloud pricing is structured around a pay-as-you-go model with no upfront fees. To optimize costs, organizations utilize:

- **Sustained Use Discounts (SUD):** Automatic discounts applied when you run Compute Engine virtual machines for a significant portion (more than 25%) of a billing month. No commitment required.
- **Committed Use Discounts (CUD):** Deep discounts (up to 70%) in exchange for committing to purchase a specific amount of compute resources or database capacity for a 1-year or 3-year period. Ideal for predictable, stable workloads.
- **Spot / Preemptible VMs:** Excess compute capacity sold at a steep discount (up to 91%). The trade-off is that Google can reclaim (terminate) these virtual machines with a 30-second notice if it needs the capacity. Ideal for fault-tolerant, batch-processing workloads.

---

## 2. Cost Control and Management Tools

- **Google Cloud Pricing Calculator:** A web tool used to estimate the cost of architecture footprints before deploying them.
- **Billing Reports:** Visualization dashboards used to analyze, filter, and forecast cloud spend by service, project, or label.
- **Budgets and Billing Alerts:** Budgets allow you to set monthly spending targets. Billing Alerts notify administrators via email when actual or forecasted spending exceeds specified thresholds (e.g., 50%, 90% of budget). *Important: Budgets and Alerts do not automatically shut down resources; they only notify.*
- **Resource Quotas:** Administrative limits on resource creation (e.g., limiting a project to a maximum of 5 virtual machines). This protects against accidental cost spikes or runaway billing during security incidents.
- **Labels:** Key-value metadata tags (e.g., \`department:marketing\`, \`environment:production\`) attached to resources to group and categorize expenses in billing reports.

---

## 3. Google Cloud's Commitment to Sustainability

Google Cloud operates the cleanest cloud in the industry, which directly supports customer sustainability goals:
- **Carbon-Neutral Data Centers:** Google data centers are highly energy-efficient and operate with net-zero carbon emissions.
- **Renewable Energy Match:** Google matches 100% of its global annual electricity consumption with renewable energy purchases.
- **24/7 Carbon-Free Energy Goal:** Google aims to operate all its data centers on carbon-free energy 24 hours a day, 7 days a week, by the year 2030.
- **Sustainability Reporting:** Google Cloud provides carbon footprint dashboards to allow organizations to track and report the carbon impact of their cloud workloads.
          `,
        },
      ],
    },
  ];

  for (const modData of modulesData) {
    const mod = await prisma.learningModule.upsert({
      where: {
        id: `mod-${modData.order}-${gcdlCert.id}`,
      },
      update: {
        title: modData.title,
        description: modData.description,
        order: modData.order,
      },
      create: {
        id: `mod-${modData.order}-${gcdlCert.id}`,
        title: modData.title,
        description: modData.description,
        order: modData.order,
        certificationId: gcdlCert.id,
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

  console.log('✅ GCDL Learning Modules and Lessons seeded successfully');

  // Map domains by name for easy access
  const domainMap = {
    DIGITAL_TRANSFORMATION: gcdlCert.domains.find(d => d.name.includes('Digital Transformation'))?.id,
    DATA_AND_AI: gcdlCert.domains.find(d => d.name.includes('Data'))?.id,
    INFRASTRUCTURE_MODERNIZATION: gcdlCert.domains.find(d => d.name.includes('Infrastructure'))?.id,
    SECURITY_AND_OPERATIONS: gcdlCert.domains.find(d => d.name.includes('Security'))?.id,
    SCALING_AND_OPERATIONS: gcdlCert.domains.find(d => d.name.includes('Scaling'))?.id,
  };

  console.log('📚 Found GCDL certification with domains');

  // Comprehensive GCDL Questions - baseline questions covering all exam topics
  // Based on official GCDL exam guide research
  const baselineQuestions: SeedQuestion[] = [
    // Digital Transformation
    {
      question: 'What is the primary benefit of cloud computing for digital transformation?',
      options: [
        { id: 'a', text: 'Reduced need for IT staff' },
        { id: 'b', text: 'Ability to scale resources on-demand and pay only for what you use' },
        { id: 'c', text: 'Elimination of all security concerns' },
        { id: 'd', text: 'Guaranteed 100% uptime' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud computing enables organizations to scale resources dynamically based on demand and follow a pay-as-you-go model, which is fundamental to digital transformation.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'EASY',
    },
    {
      question: 'Which of the following are characteristics of cloud computing? (Select all that apply)',
      options: [
        { id: 'a', text: 'On-demand self-service' },
        { id: 'b', text: 'Broad network access' },
        { id: 'c', text: 'Resource pooling' },
        { id: 'd', text: 'Requires physical server management' },
      ],
      correctAnswers: ['a', 'b', 'c'],
      explanation: 'The five essential characteristics of cloud computing are: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service. Physical server management is handled by the cloud provider.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is the difference between CapEx and OpEx in cloud computing?',
      options: [
        { id: 'a', text: 'CapEx is ongoing operational costs, OpEx is upfront capital investment' },
        { id: 'b', text: 'CapEx is upfront capital investment, OpEx is ongoing operational costs' },
        { id: 'c', text: 'They are the same thing' },
        { id: 'd', text: 'CapEx applies only to software, OpEx only to hardware' },
      ],
      correctAnswers: ['b'],
      explanation: 'CapEx (Capital Expenditure) refers to upfront investments in physical infrastructure, while OpEx (Operational Expenditure) refers to ongoing costs for services. Cloud computing shifts spending from CapEx to OpEx.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'EASY',
    },
    {
      question: 'Which Google Cloud service is best suited for running containerized applications?',
      options: [
        { id: 'a', text: 'Cloud Storage' },
        { id: 'b', text: 'Google Kubernetes Engine (GKE)' },
        { id: 'c', text: 'BigQuery' },
        { id: 'd', text: 'Cloud SQL' },
      ],
      correctAnswers: ['b'],
      explanation: 'Google Kubernetes Engine (GKE) is a managed Kubernetes service designed specifically for deploying, managing, and scaling containerized applications.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is the shared responsibility model in cloud computing?',
      options: [
        { id: 'a', text: 'The cloud provider is responsible for everything' },
        { id: 'b', text: 'The customer is responsible for everything' },
        { id: 'c', text: 'Security and compliance responsibilities are shared between the cloud provider and customer' },
        { id: 'd', text: 'Only the customer is responsible for security' },
      ],
      correctAnswers: ['c'],
      explanation: 'The shared responsibility model defines which security and compliance tasks are handled by the cloud provider (security OF the cloud) and which are handled by the customer (security IN the cloud).',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },

    // Data and AI
    {
      question: 'Which Google Cloud service is designed for data warehousing and analytics?',
      options: [
        { id: 'a', text: 'Cloud Storage' },
        { id: 'b', text: 'BigQuery' },
        { id: 'c', text: 'Cloud SQL' },
        { id: 'd', text: 'Firestore' },
      ],
      correctAnswers: ['b'],
      explanation: 'BigQuery is Google Cloud\'s fully managed, serverless data warehouse that enables scalable analysis over petabytes of data.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },
    {
      question: 'What is the purpose of Cloud Storage in Google Cloud?',
      options: [
        { id: 'a', text: 'To run virtual machines' },
        { id: 'b', text: 'To store and retrieve unstructured data like images, videos, and backups' },
        { id: 'c', text: 'To manage relational databases' },
        { id: 'd', text: 'To deploy containerized applications' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Storage is an object storage service for storing and accessing unstructured data. It offers different storage classes for various use cases.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },
    {
      question: 'Which Google Cloud AI service can be used to add vision capabilities to applications?',
      options: [
        { id: 'a', text: 'Natural Language API' },
        { id: 'b', text: 'Vision AI' },
        { id: 'c', text: 'Speech-to-Text' },
        { id: 'd', text: 'Translation API' },
      ],
      correctAnswers: ['b'],
      explanation: 'Vision AI (Cloud Vision API) enables developers to understand image content through machine learning models, including image labeling, face detection, and OCR.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },
    {
      question: 'What is Vertex AI in Google Cloud?',
      options: [
        { id: 'a', text: 'A database service' },
        { id: 'b', text: 'A unified platform for building, deploying, and scaling ML models' },
        { id: 'c', text: 'A networking service' },
        { id: 'd', text: 'A storage service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Vertex AI is Google Cloud\'s unified ML platform that brings together Google Cloud services for building ML under one unified UI and API.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which of the following are benefits of using BigQuery? (Select all that apply)',
      options: [
        { id: 'a', text: 'Serverless architecture' },
        { id: 'b', text: 'Built-in machine learning capabilities' },
        { id: 'c', text: 'Requires manual scaling' },
        { id: 'd', text: 'Real-time analytics' },
      ],
      correctAnswers: ['a', 'b', 'd'],
      explanation: 'BigQuery is serverless, includes BigQuery ML for machine learning, and supports real-time analytics. It automatically scales without manual intervention.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },

    // Infrastructure Modernization
    {
      question: 'What is the primary purpose of Compute Engine in Google Cloud?',
      options: [
        { id: 'a', text: 'To store data' },
        { id: 'b', text: 'To run virtual machines' },
        { id: 'c', text: 'To manage databases' },
        { id: 'd', text: 'To deploy serverless functions' },
      ],
      correctAnswers: ['b'],
      explanation: 'Compute Engine is Google Cloud\'s Infrastructure as a Service (IaaS) offering that provides virtual machines running on Google\'s infrastructure.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },
    {
      question: 'Which service allows you to run code without managing servers?',
      options: [
        { id: 'a', text: 'Compute Engine' },
        { id: 'b', text: 'Cloud Functions' },
        { id: 'c', text: 'Cloud Storage' },
        { id: 'd', text: 'Cloud SQL' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Functions is a serverless execution environment that allows you to run code in response to events without provisioning or managing servers.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is App Engine in Google Cloud?',
      options: [
        { id: 'a', text: 'A virtual machine service' },
        { id: 'b', text: 'A fully managed platform for building and deploying applications' },
        { id: 'c', text: 'A database service' },
        { id: 'd', text: 'A storage service' },
      ],
      correctAnswers: ['b'],
      explanation: 'App Engine is a fully managed, serverless platform for developing and hosting web applications at scale. It handles infrastructure management automatically.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which of the following are compute options in Google Cloud? (Select all that apply)',
      options: [
        { id: 'a', text: 'Compute Engine' },
        { id: 'b', text: 'Google Kubernetes Engine' },
        { id: 'c', text: 'Cloud Functions' },
        { id: 'd', text: 'BigQuery' },
      ],
      correctAnswers: ['a', 'b', 'c'],
      explanation: 'Compute Engine (VMs), GKE (containers), and Cloud Functions (serverless) are all compute services. BigQuery is a data warehouse service.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is the benefit of using managed services in Google Cloud?',
      options: [
        { id: 'a', text: 'More control over infrastructure' },
        { id: 'b', text: 'Reduced operational overhead and automatic updates' },
        { id: 'c', text: 'Lower costs always' },
        { id: 'd', text: 'Complete customization of all components' },
      ],
      correctAnswers: ['b'],
      explanation: 'Managed services reduce operational overhead by handling infrastructure management, patching, updates, and scaling automatically, allowing teams to focus on application development.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },

    // Security and Operations
    {
      question: 'What is Cloud Identity and Access Management (IAM) used for?',
      options: [
        { id: 'a', text: 'Storing data' },
        { id: 'b', text: 'Managing who has access to which resources' },
        { id: 'c', text: 'Running virtual machines' },
        { id: 'd', text: 'Analyzing data' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud IAM allows you to manage access control by defining who (identity) has what access (role) for which resource, following the principle of least privilege.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'Which Google Cloud service provides DDoS protection?',
      options: [
        { id: 'a', text: 'Cloud Armor' },
        { id: 'b', text: 'Cloud Storage' },
        { id: 'c', text: 'BigQuery' },
        { id: 'd', text: 'Compute Engine' },
      ],
      correctAnswers: ['a'],
      explanation: 'Cloud Armor provides DDoS protection and web application firewall (WAF) capabilities to protect applications from attacks.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is the principle of least privilege in IAM?',
      options: [
        { id: 'a', text: 'Give everyone admin access' },
        { id: 'b', text: 'Grant only the minimum permissions necessary to perform a task' },
        { id: 'c', text: 'Remove all permissions' },
        { id: 'd', text: 'Give read-only access to everyone' },
      ],
      correctAnswers: ['b'],
      explanation: 'The principle of least privilege means granting users only the permissions they need to perform their job functions, reducing security risks.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'Which service helps monitor and log Google Cloud resources?',
      options: [
        { id: 'a', text: 'Cloud Monitoring (formerly Stackdriver)' },
        { id: 'b', text: 'Cloud Storage' },
        { id: 'c', text: 'Compute Engine' },
        { id: 'd', text: 'Cloud Functions' },
      ],
      correctAnswers: ['a'],
      explanation: 'Cloud Monitoring provides visibility into the performance, uptime, and health of cloud-powered applications through metrics, logs, and traces.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'What are the three main components of the CIA triad in security?',
      options: [
        { id: 'a', text: 'Confidentiality, Integrity, Availability' },
        { id: 'b', text: 'Compliance, Integration, Authentication' },
        { id: 'c', text: 'Cloud, Infrastructure, Applications' },
        { id: 'd', text: 'Cost, Innovation, Agility' },
      ],
      correctAnswers: ['a'],
      explanation: 'The CIA triad consists of Confidentiality (protecting data from unauthorized access), Integrity (ensuring data accuracy), and Availability (ensuring systems are accessible when needed).',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which of the following are security best practices in Google Cloud? (Select all that apply)',
      options: [
        { id: 'a', text: 'Use service accounts for applications' },
        { id: 'b', text: 'Enable multi-factor authentication' },
        { id: 'c', text: 'Share passwords among team members' },
        { id: 'd', text: 'Regularly audit IAM permissions' },
      ],
      correctAnswers: ['a', 'b', 'd'],
      explanation: 'Security best practices include using service accounts, enabling MFA, and regular audits. Sharing passwords violates security principles.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },

    // Additional questions for comprehensive coverage
    {
      question: 'What is the purpose of VPC (Virtual Private Cloud) in Google Cloud?',
      options: [
        { id: 'a', text: 'To store files' },
        { id: 'b', text: 'To provide isolated network environments for resources' },
        { id: 'c', text: 'To run machine learning models' },
        { id: 'd', text: 'To manage databases' },
      ],
      correctAnswers: ['b'],
      explanation: 'VPC provides networking functionality for Google Cloud resources, allowing you to create isolated network environments with custom IP ranges, subnets, and firewall rules.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which database service is best for globally distributed, strongly consistent data?',
      options: [
        { id: 'a', text: 'Cloud SQL' },
        { id: 'b', text: 'Cloud Spanner' },
        { id: 'c', text: 'Firestore' },
        { id: 'd', text: 'BigQuery' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Spanner is a fully managed, globally distributed relational database that offers strong consistency, high availability, and horizontal scalability.',
      category: 'DATA_AND_AI',
      difficulty: 'HARD',
    },
    {
      question: 'What is the difference between Cloud SQL and Cloud Spanner?',
      options: [
        { id: 'a', text: 'Cloud SQL is for NoSQL, Cloud Spanner is for SQL' },
        { id: 'b', text: 'Cloud SQL is regional, Cloud Spanner is globally distributed' },
        { id: 'c', text: 'They are the same service' },
        { id: 'd', text: 'Cloud SQL is for analytics, Cloud Spanner is for storage' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud SQL is a regional managed relational database service, while Cloud Spanner is a globally distributed relational database with unlimited scale and strong consistency.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which Google Cloud service provides a content delivery network (CDN)?',
      options: [
        { id: 'a', text: 'Cloud CDN' },
        { id: 'b', text: 'Cloud Storage' },
        { id: 'c', text: 'Load Balancing' },
        { id: 'd', text: 'Cloud DNS' },
      ],
      correctAnswers: ['a'],
      explanation: 'Cloud CDN uses Google\'s globally distributed edge points of presence to cache content close to users, reducing latency and improving performance.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },

    // Additional Digital Transformation Questions
    {
      question: 'What is a public cloud?',
      options: [
        { id: 'a', text: 'Cloud infrastructure available only to a single organization' },
        { id: 'b', text: 'Cloud services available to the general public over the internet' },
        { id: 'c', text: 'Cloud infrastructure hosted on-premises' },
        { id: 'd', text: 'Cloud services that are free to use' },
      ],
      correctAnswers: ['b'],
      explanation: 'A public cloud is a cloud computing model where services are delivered over the public internet and shared across multiple organizations.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'EASY',
    },
    {
      question: 'Which of the following are benefits of cloud computing? (Select all that apply)',
      options: [
        { id: 'a', text: 'Scalability and elasticity' },
        { id: 'b', text: 'Reduced time to market' },
        { id: 'c', text: 'Guaranteed zero downtime' },
        { id: 'd', text: 'Global reach' },
      ],
      correctAnswers: ['a', 'b', 'd'],
      explanation: 'Cloud computing offers scalability, faster deployment, and global reach. However, it doesn\'t guarantee zero downtime - that depends on architecture and SLAs.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What does TCO stand for in cloud computing?',
      options: [
        { id: 'a', text: 'Technical Cloud Operations' },
        { id: 'b', text: 'Total Cost of Ownership' },
        { id: 'c', text: 'Time to Cloud Optimization' },
        { id: 'd', text: 'Tactical Computing Operations' },
      ],
      correctAnswers: ['b'],
      explanation: 'TCO (Total Cost of Ownership) includes all costs associated with owning and operating IT infrastructure, including hardware, software, maintenance, and personnel.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is serverless computing?',
      options: [
        { id: 'a', text: 'Computing without any servers' },
        { id: 'b', text: 'A cloud computing model where the provider manages server infrastructure' },
        { id: 'c', text: 'Computing that requires no internet connection' },
        { id: 'd', text: 'A type of on-premises computing' },
      ],
      correctAnswers: ['b'],
      explanation: 'Serverless computing is a cloud model where the provider automatically manages the infrastructure, allowing developers to focus on code without managing servers.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which Google Cloud benefit focuses on using data and AI to gain insights?',
      options: [
        { id: 'a', text: 'Freedom' },
        { id: 'b', text: 'Intelligence' },
        { id: 'c', text: 'Collaboration' },
        { id: 'd', text: 'Trust' },
      ],
      correctAnswers: ['b'],
      explanation: 'Intelligence is Google Cloud\'s benefit that focuses on leveraging data analytics and AI/ML to gain actionable insights and make better decisions.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is lift-and-shift migration?',
      options: [
        { id: 'a', text: 'Rebuilding applications from scratch for the cloud' },
        { id: 'b', text: 'Moving applications to the cloud with minimal changes' },
        { id: 'c', text: 'Refactoring applications to be cloud-native' },
        { id: 'd', text: 'Retiring old applications' },
      ],
      correctAnswers: ['b'],
      explanation: 'Lift-and-shift (also called rehosting) involves moving applications to the cloud with minimal or no modifications to take advantage of cloud infrastructure.',
      category: 'DIGITAL_TRANSFORMATION',
      difficulty: 'MEDIUM',
    },

    // Additional Data & AI Questions
    {
      question: 'What is Dataflow in Google Cloud?',
      options: [
        { id: 'a', text: 'A data visualization tool' },
        { id: 'b', text: 'A fully managed service for stream and batch data processing' },
        { id: 'c', text: 'A database service' },
        { id: 'd', text: 'A data transfer service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Dataflow is a fully managed service for executing Apache Beam pipelines for batch and stream data processing.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is Pub/Sub used for?',
      options: [
        { id: 'a', text: 'Publishing websites' },
        { id: 'b', text: 'Asynchronous messaging between applications' },
        { id: 'c', text: 'Database replication' },
        { id: 'd', text: 'File storage' },
      ],
      correctAnswers: ['b'],
      explanation: 'Pub/Sub is a messaging service for asynchronous communication between applications, enabling event-driven architectures and real-time analytics.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },
    {
      question: 'Which Cloud Storage class is best for data accessed less than once a year?',
      options: [
        { id: 'a', text: 'Standard' },
        { id: 'b', text: 'Nearline' },
        { id: 'c', text: 'Coldline' },
        { id: 'd', text: 'Archive' },
      ],
      correctAnswers: ['d'],
      explanation: 'Archive storage is the lowest-cost option, designed for data accessed less than once a year, such as long-term backups and archives.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is Looker in Google Cloud?',
      options: [
        { id: 'a', text: 'A monitoring tool' },
        { id: 'b', text: 'A business intelligence and data visualization platform' },
        { id: 'c', text: 'A machine learning service' },
        { id: 'd', text: 'A database service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Looker is a business intelligence platform that helps organizations explore, analyze, and share real-time business analytics.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },
    {
      question: 'What is AutoML in Vertex AI?',
      options: [
        { id: 'a', text: 'Automatic machine learning that requires no coding' },
        { id: 'b', text: 'A tool for automating database queries' },
        { id: 'c', text: 'Automatic scaling for ML models' },
        { id: 'd', text: 'A service for automated testing' },
      ],
      correctAnswers: ['a'],
      explanation: 'AutoML enables developers with limited ML expertise to train high-quality custom models with minimal effort and coding.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },
    {
      question: 'Which Google Cloud service is best for NoSQL document database?',
      options: [
        { id: 'a', text: 'Cloud SQL' },
        { id: 'b', text: 'Cloud Spanner' },
        { id: 'c', text: 'Firestore' },
        { id: 'd', text: 'BigQuery' },
      ],
      correctAnswers: ['c'],
      explanation: 'Firestore is a flexible, scalable NoSQL document database for mobile, web, and server development.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },
    {
      question: 'What is Bigtable designed for?',
      options: [
        { id: 'a', text: 'Relational data with complex queries' },
        { id: 'b', text: 'Large-scale, low-latency NoSQL data' },
        { id: 'c', text: 'Data warehousing and analytics' },
        { id: 'd', text: 'Object storage' },
      ],
      correctAnswers: ['b'],
      explanation: 'Bigtable is a fully managed, scalable NoSQL database service designed for large analytical and operational workloads with low latency.',
      category: 'DATA_AND_AI',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is the Speech-to-Text API used for?',
      options: [
        { id: 'a', text: 'Converting text to speech' },
        { id: 'b', text: 'Converting audio to text transcriptions' },
        { id: 'c', text: 'Translating languages' },
        { id: 'd', text: 'Analyzing sentiment' },
      ],
      correctAnswers: ['b'],
      explanation: 'Speech-to-Text API converts audio to text using Google\'s powerful neural network models, supporting over 125 languages.',
      category: 'DATA_AND_AI',
      difficulty: 'EASY',
    },

    // Additional Infrastructure Questions
    {
      question: 'What is Cloud Run?',
      options: [
        { id: 'a', text: 'A VM management service' },
        { id: 'b', text: 'A fully managed platform for running containerized applications' },
        { id: 'c', text: 'A database service' },
        { id: 'd', text: 'A monitoring service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Run is a fully managed serverless platform that automatically scales your containerized applications.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is the difference between GKE Autopilot and Standard?',
      options: [
        { id: 'a', text: 'Autopilot is fully managed, Standard requires more configuration' },
        { id: 'b', text: 'Standard is fully managed, Autopilot requires more configuration' },
        { id: 'c', text: 'They are the same' },
        { id: 'd', text: 'Autopilot is only for development environments' },
      ],
      correctAnswers: ['a'],
      explanation: 'GKE Autopilot is a fully managed mode where Google manages the cluster infrastructure, while Standard mode gives you more control and configuration options.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What are preemptible VMs?',
      options: [
        { id: 'a', text: 'VMs that run forever' },
        { id: 'b', text: 'Short-lived, cost-effective VMs that can be terminated by Google Cloud' },
        { id: 'c', text: 'VMs with guaranteed uptime' },
        { id: 'd', text: 'VMs that cannot be stopped' },
      ],
      correctAnswers: ['b'],
      explanation: 'Preemptible VMs are highly affordable, short-lived compute instances suitable for batch jobs and fault-tolerant workloads. They can run for up to 24 hours.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is Cloud Load Balancing?',
      options: [
        { id: 'a', text: 'A service for storing data' },
        { id: 'b', text: 'A service that distributes traffic across multiple instances' },
        { id: 'c', text: 'A database service' },
        { id: 'd', text: 'A monitoring service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Load Balancing distributes incoming traffic across multiple instances to ensure high availability and reliability.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is Cloud Interconnect?',
      options: [
        { id: 'a', text: 'A service for connecting VPCs' },
        { id: 'b', text: 'A service for connecting on-premises networks to Google Cloud' },
        { id: 'c', text: 'A service for internet connectivity' },
        { id: 'd', text: 'A service for connecting databases' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Interconnect provides low-latency, highly available connections between on-premises networks and Google Cloud.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is Cloud VPN?',
      options: [
        { id: 'a', text: 'A service for browsing anonymously' },
        { id: 'b', text: 'A service for securely connecting networks over the internet' },
        { id: 'c', text: 'A service for storing passwords' },
        { id: 'd', text: 'A service for email encryption' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud VPN securely connects your on-premises network to your Google Cloud VPC network through an IPsec VPN connection.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'EASY',
    },
    {
      question: 'What is Anthos?',
      options: [
        { id: 'a', text: 'A database service' },
        { id: 'b', text: 'A platform for managing applications across hybrid and multi-cloud environments' },
        { id: 'c', text: 'A monitoring service' },
        { id: 'd', text: 'A storage service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Anthos is a modern application management platform that provides a consistent development and operations experience for cloud and on-premises environments.',
      category: 'INFRASTRUCTURE_MODERNIZATION',
      difficulty: 'HARD',
    },

    // Additional Security Questions
    {
      question: 'What is a service account in Google Cloud?',
      options: [
        { id: 'a', text: 'An account for human users' },
        { id: 'b', text: 'A special account used by applications and VMs' },
        { id: 'c', text: 'An account for billing' },
        { id: 'd', text: 'An account for support tickets' },
      ],
      correctAnswers: ['b'],
      explanation: 'Service accounts are special Google accounts that belong to applications or VMs instead of individual end users.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'What is Cloud KMS?',
      options: [
        { id: 'a', text: 'Cloud Kubernetes Management Service' },
        { id: 'b', text: 'Cloud Key Management Service' },
        { id: 'c', text: 'Cloud Knowledge Management System' },
        { id: 'd', text: 'Cloud Kernel Management Service' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud KMS (Key Management Service) allows you to create, import, and manage cryptographic keys for encrypting data.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'What is Secret Manager?',
      options: [
        { id: 'a', text: 'A service for managing passwords and API keys' },
        { id: 'b', text: 'A service for managing VMs' },
        { id: 'c', text: 'A service for managing databases' },
        { id: 'd', text: 'A service for managing networks' },
      ],
      correctAnswers: ['a'],
      explanation: 'Secret Manager is a secure and convenient storage system for API keys, passwords, certificates, and other sensitive data.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'What is Security Command Center?',
      options: [
        { id: 'a', text: 'A centralized security and risk management platform' },
        { id: 'b', text: 'A firewall service' },
        { id: 'c', text: 'A VPN service' },
        { id: 'd', text: 'An encryption service' },
      ],
      correctAnswers: ['a'],
      explanation: 'Security Command Center is Google Cloud\'s centralized vulnerability and threat reporting service that helps you identify and remediate security risks.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is VPC Service Controls?',
      options: [
        { id: 'a', text: 'A service for controlling VM instances' },
        { id: 'b', text: 'A service for creating security perimeters around Google Cloud resources' },
        { id: 'c', text: 'A service for managing VPC networks' },
        { id: 'd', text: 'A service for load balancing' },
      ],
      correctAnswers: ['b'],
      explanation: 'VPC Service Controls allows you to define security perimeters around Google Cloud resources to constrain data within a VPC and help mitigate data exfiltration risks.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'HARD',
    },
    {
      question: 'What is Cloud Audit Logs?',
      options: [
        { id: 'a', text: 'A service for monitoring application performance' },
        { id: 'b', text: 'A service that records administrative activities and data access' },
        { id: 'c', text: 'A service for managing user accounts' },
        { id: 'd', text: 'A service for billing reports' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Audit Logs maintains audit trails that record administrative activities and data access within your Google Cloud resources.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is the purpose of Cloud Trace?',
      options: [
        { id: 'a', text: 'To track billing costs' },
        { id: 'b', text: 'To collect latency data from applications' },
        { id: 'c', text: 'To trace network packets' },
        { id: 'd', text: 'To track user logins' },
      ],
      correctAnswers: ['b'],
      explanation: 'Cloud Trace is a distributed tracing system that collects latency data from applications and displays it in the Google Cloud Console.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },
    {
      question: 'What is Error Reporting?',
      options: [
        { id: 'a', text: 'A service for reporting bugs to Google' },
        { id: 'b', text: 'A service that aggregates and displays errors from cloud services' },
        { id: 'c', text: 'A service for reporting security incidents' },
        { id: 'd', text: 'A service for reporting billing issues' },
      ],
      correctAnswers: ['b'],
      explanation: 'Error Reporting counts, analyzes, and aggregates crashes in your running cloud services in real-time.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'What does SLA stand for?',
      options: [
        { id: 'a', text: 'Service Level Agreement' },
        { id: 'b', text: 'System Load Average' },
        { id: 'c', text: 'Security Level Assessment' },
        { id: 'd', text: 'Software License Agreement' },
      ],
      correctAnswers: ['a'],
      explanation: 'SLA (Service Level Agreement) is a commitment between a service provider and a client about the expected level of service.',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'EASY',
    },
    {
      question: 'What is a committed use discount?',
      options: [
        { id: 'a', text: 'A discount for using multiple services' },
        { id: 'b', text: 'A discount for committing to use resources for 1 or 3 years' },
        { id: 'c', text: 'A discount for new customers' },
        { id: 'd', text: 'A discount for paying annually' },
      ],
      correctAnswers: ['b'],
      explanation: 'Committed use discounts provide discounted prices in exchange for your commitment to use a minimum level of resources for a specified term (1 or 3 years).',
      category: 'SECURITY_AND_OPERATIONS',
      difficulty: 'MEDIUM',
    },
  ];

  const advancedQuestions = loadAdvancedQuestions();
  const questions = [...baselineQuestions, ...advancedQuestions];

  console.log(`🧠 Loaded ${advancedQuestions.length} advanced GCDL questions`);
  console.log('📝 Creating GCDL questions...');
  let createdCount = 0;
  for (const q of questions) {
    const domainId = domainMap[q.category as keyof typeof domainMap];
    if (!domainId) {
      console.warn(`⚠️ Skipping question - domain not found for category: ${q.category}`);
      continue;
    }

    const existing = await prisma.question.findFirst({
      where: {
        certificationId: gcdlCert.id,
        question: q.question,
      },
      select: { id: true },
    });

    if (existing) {
      continue;
    }

    const subdomainTag = getGdlSubdomainTag(q.category);
    const combinedTags = Array.from(new Set([...(q.tags ?? []), subdomainTag]));

    await prisma.question.create({
      data: {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        difficulty: q.difficulty,
        questionType: q.correctAnswers.length > 1 ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE',
        certificationId: gcdlCert.id,
        domainId: domainId,
        category: q.category, // Keep for backward compatibility
        tags: combinedTags,
        references: q.references ?? [],
      },
    });
    createdCount++;
  }
  
  console.log(`✅ Created ${createdCount} GCDL questions`);
  console.log(`✅ Created ${questions.length} questions`);

  // Add real exam content for AWS and other certifications
  console.log('\n📚 Seeding comprehensive exam content...');
  try {
    await seedAWSCloudPractitioner();
    await seedGCPCloudDigitalLeader();
    console.log('✅ Real exam content seeded successfully');
  } catch (error) {
    console.warn('⚠️ Some exam content seeding failed:', error);
  }

  console.log('🎉 Seeding completed successfully!');
  console.log('\n� Question Bank Summary:');
  console.log(`Total Questions: ${questions.length}`);
  console.log('Target: 500+ questions');
  console.log('See HOW_TO_ADD_MORE_QUESTIONS.md for guidance on adding more');
  console.log('\n�📋 Login credentials:');
  console.log('Admin: admin@techvaults.com / admin123');
  console.log('Student: student@techvaults.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
