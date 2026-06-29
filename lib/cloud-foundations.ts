export type FoundationLevel = 'Beginner' | 'Builder' | 'Architect' | 'Exam Ready';

export type FoundationQuestion = {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
  source: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type FoundationTopic = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  imagePrompt: string;
  sourceNote: string;
  sources: Array<{ label: string; url: string }>;
  keyIdeas: string[];
  deepDive: Array<{ heading: string; body: string }>;
  visual: {
    title: string;
    layers: string[];
  };
  questions: FoundationQuestion[];
};

export const FOUNDATION_LEVELS: FoundationLevel[] = [
  'Beginner',
  'Builder',
  'Architect',
  'Exam Ready',
];

export function getQuestionCountForLevel(level: number, available: number) {
  return Math.min(available, 10 + Math.max(level - 1, 0) * 2);
}

export const cloudFoundationTopics: FoundationTopic[] = [
  {
    slug: 'cloud-computing-fundamentals',
    title: 'Cloud Computing Fundamentals',
    summary:
      'Build the neutral mental model behind every provider exam: on-demand access, pooled resources, elasticity, measured usage, and why cloud changes business speed.',
    estimatedMinutes: 18,
    imagePrompt:
      'Educational infographic showing users requesting cloud resources from a shared provider pool, with labels for self-service, elasticity, metering, and broad network access.',
    sourceNote:
      'Core definitions are adapted from NIST SP 800-145 and expanded with provider-neutral examples.',
    sources: [
      {
        label: 'NIST SP 800-145: The NIST Definition of Cloud Computing',
        url: 'https://csrc.nist.gov/pubs/sp/800/145/final',
      },
      {
        label: 'IBM: What is cloud computing?',
        url: 'https://www.ibm.com/think/topics/cloud-computing',
      },
    ],
    keyIdeas: [
      'Cloud is a service model, not just someone else computer.',
      'The five NIST characteristics explain why cloud feels different from traditional IT.',
      'Pay-as-you-go only creates value when teams monitor, right-size, and automate.',
      'Elasticity handles changing demand; scalability is the design ability to grow.',
    ],
    deepDive: [
      {
        heading: 'A precise definition',
        body:
          'NIST defines cloud computing as convenient, on-demand network access to a shared pool of configurable resources that can be rapidly provisioned and released with low management effort. In practice, a learner should hear three ideas: resources are requested through APIs or consoles, they come from a provider-managed pool, and usage is measured so cost can track consumption.',
      },
      {
        heading: 'The five characteristics',
        body:
          'On-demand self-service means users can provision resources without a manual ticket for every server. Broad network access means services are reachable through standard networks and devices. Resource pooling lets the provider serve many customers from shared capacity while isolating tenants. Rapid elasticity means capacity can expand or shrink quickly. Measured service means usage is metered, reported, and billed.',
      },
      {
        heading: 'Why this matters for exam prep',
        body:
          'Certification questions often describe a business problem: slow procurement, seasonal demand, idle infrastructure, global users, or unpredictable cost. The correct cloud answer usually maps back to one of the core characteristics. For example, sudden traffic spikes point to elasticity; teams waiting weeks for servers point to self-service and automation.',
      },
      {
        heading: 'Business value and tradeoffs',
        body:
          'Cloud can reduce upfront capital spend, increase delivery speed, and unlock managed services, but it does not remove architecture responsibility. Poor tagging, always-on oversized resources, weak identity controls, and untested recovery plans can erase the benefit. Treat cloud as an operating model: automation, governance, security, reliability, and cost management move together.',
      },
    ],
    visual: {
      title: 'Cloud Value Loop',
      layers: ['Request', 'Provision', 'Run', 'Measure', 'Optimize'],
    },
    questions: [
      {
        id: 'fund-001',
        question: 'Which description best matches cloud computing according to the NIST model?',
        options: [
          { id: 'a', text: 'Owning servers in a private data center' },
          { id: 'b', text: 'On-demand network access to a shared pool of configurable resources' },
          { id: 'c', text: 'A backup copy of a local application' },
          { id: 'd', text: 'Any application that uses the internet' },
        ],
        correctAnswer: 'b',
        explanation:
          'NIST centers the definition on on-demand network access, shared configurable resources, rapid provisioning, and minimal provider interaction.',
        source: 'NIST SP 800-145',
        difficulty: 'easy',
      },
      {
        id: 'fund-002',
        question: 'A team creates test environments through an API without opening IT tickets. Which cloud characteristic is most visible?',
        options: [
          { id: 'a', text: 'On-demand self-service' },
          { id: 'b', text: 'Measured service' },
          { id: 'c', text: 'Private cloud' },
          { id: 'd', text: 'Vendor lock-in' },
        ],
        correctAnswer: 'a',
        explanation:
          'Self-service is the ability to provision resources automatically as needed without human interaction from the provider or central operations team.',
        source: 'NIST SP 800-145',
        difficulty: 'easy',
      },
      {
        id: 'fund-003',
        question: 'What does measured service enable?',
        options: [
          { id: 'a', text: 'Unlimited free capacity' },
          { id: 'b', text: 'Usage visibility, reporting, and consumption-based billing' },
          { id: 'c', text: 'Elimination of all security tasks' },
          { id: 'd', text: 'Manual hardware procurement' },
        ],
        correctAnswer: 'b',
        explanation:
          'Measured service means cloud systems meter resource usage so both provider and consumer can monitor, control, report, and bill consumption.',
        source: 'NIST SP 800-145',
        difficulty: 'easy',
      },
      {
        id: 'fund-004',
        question: 'A retailer needs extra capacity during a flash sale, then wants to scale back after demand drops. Which concept is most relevant?',
        options: [
          { id: 'a', text: 'Rapid elasticity' },
          { id: 'b', text: 'Data sovereignty' },
          { id: 'c', text: 'Cold storage' },
          { id: 'd', text: 'Static provisioning' },
        ],
        correctAnswer: 'a',
        explanation:
          'Rapid elasticity is the cloud characteristic that lets capacity expand and contract quickly to match workload demand.',
        source: 'NIST SP 800-145',
        difficulty: 'easy',
      },
      {
        id: 'fund-005',
        question: 'Why can cloud adoption shift spending from CapEx toward OpEx?',
        options: [
          { id: 'a', text: 'Cloud always removes every operating cost' },
          { id: 'b', text: 'Teams rent metered services instead of buying physical assets upfront' },
          { id: 'c', text: 'Software licenses disappear' },
          { id: 'd', text: 'Networking is no longer required' },
        ],
        correctAnswer: 'b',
        explanation:
          'Cloud commonly replaces upfront infrastructure purchase with ongoing consumption-based service charges.',
        source: 'IBM cloud computing overview',
        difficulty: 'medium',
      },
      {
        id: 'fund-006',
        question: 'Which scenario is the clearest example of broad network access?',
        options: [
          { id: 'a', text: 'Only one local server can reach the application' },
          { id: 'b', text: 'Users access a service over standard networks from laptops and phones' },
          { id: 'c', text: 'A team manually installs a server in a rack' },
          { id: 'd', text: 'A database is printed for audit review' },
        ],
        correctAnswer: 'b',
        explanation:
          'Broad network access means capabilities are available over the network through standard client platforms and mechanisms.',
        source: 'NIST SP 800-145',
        difficulty: 'easy',
      },
      {
        id: 'fund-007',
        question: 'What is the most practical difference between scalability and elasticity?',
        options: [
          { id: 'a', text: 'Scalability is the ability to grow; elasticity is automatic growth and shrinkage with demand' },
          { id: 'b', text: 'Elasticity applies only to storage, scalability applies only to compute' },
          { id: 'c', text: 'Scalability is always cheaper than elasticity' },
          { id: 'd', text: 'There is no meaningful difference in cloud architecture' },
        ],
        correctAnswer: 'a',
        explanation:
          'Scalability describes capacity to handle growth. Elasticity emphasizes dynamic expansion and contraction as demand changes.',
        source: 'NIST SP 800-145 and IBM cloud overview',
        difficulty: 'medium',
      },
      {
        id: 'fund-008',
        question: 'Which behavior most often destroys the cost benefit of pay-as-you-go cloud?',
        options: [
          { id: 'a', text: 'Using resource tags and budgets' },
          { id: 'b', text: 'Leaving oversized always-on resources running without monitoring' },
          { id: 'c', text: 'Automating shutdown of test environments' },
          { id: 'd', text: 'Reviewing usage reports weekly' },
        ],
        correctAnswer: 'b',
        explanation:
          'Metered billing rewards active cost management. Idle or oversized resources keep generating charges.',
        source: 'IBM cloud computing overview',
        difficulty: 'medium',
      },
      {
        id: 'fund-009',
        question: 'Resource pooling mainly helps providers do what?',
        options: [
          { id: 'a', text: 'Serve multiple consumers from shared physical and virtual capacity' },
          { id: 'b', text: 'Give every customer a permanently dedicated building' },
          { id: 'c', text: 'Avoid measuring resource usage' },
          { id: 'd', text: 'Remove the need for identity controls' },
        ],
        correctAnswer: 'a',
        explanation:
          'Resource pooling uses a multi-tenant model where physical and virtual resources are dynamically assigned and reassigned according to demand.',
        source: 'NIST SP 800-145',
        difficulty: 'medium',
      },
      {
        id: 'fund-010',
        question: 'A certification question mentions a company waiting months to procure hardware. Which cloud benefit should you think of first?',
        options: [
          { id: 'a', text: 'Speed and agility through self-service provisioning' },
          { id: 'b', text: 'No need for backup planning' },
          { id: 'c', text: 'Guaranteed lowest cost for every workload' },
          { id: 'd', text: 'Automatic data classification' },
        ],
        correctAnswer: 'a',
        explanation:
          'Cloud can reduce procurement delays because teams can provision managed resources in minutes through consoles, APIs, and automation.',
        source: 'IBM cloud computing overview',
        difficulty: 'easy',
      },
      {
        id: 'fund-011',
        question: 'Which statement is the best exam-safe way to talk about cloud cost?',
        options: [
          { id: 'a', text: 'Cloud is always cheaper than on-premises' },
          { id: 'b', text: 'Cloud aligns cost with usage, but savings require governance and optimization' },
          { id: 'c', text: 'Cloud has no operational expenses' },
          { id: 'd', text: 'Cloud cost cannot be forecast' },
        ],
        correctAnswer: 'b',
        explanation:
          'Consumption pricing can be powerful, but the learner must account for monitoring, budgets, right-sizing, commitments, and architecture choices.',
        source: 'IBM cloud computing overview',
        difficulty: 'hard',
      },
      {
        id: 'fund-012',
        question: 'Which set contains only NIST essential characteristics?',
        options: [
          { id: 'a', text: 'On-demand self-service, broad network access, resource pooling, rapid elasticity, measured service' },
          { id: 'b', text: 'IaaS, PaaS, SaaS, public cloud, hybrid cloud' },
          { id: 'c', text: 'Compute, storage, networking, identity, billing' },
          { id: 'd', text: 'Regions, zones, VPCs, containers, functions' },
        ],
        correctAnswer: 'a',
        explanation:
          'NIST separates essential characteristics from service models and deployment models. This distinction appears often in foundational exams.',
        source: 'NIST SP 800-145',
        difficulty: 'hard',
      },
    ],
  },
  {
    slug: 'service-and-deployment-models',
    title: 'Service and Deployment Models',
    summary:
      'Understand IaaS, PaaS, SaaS, serverless, public, private, hybrid, and multicloud through the lens of responsibility, control, and operational overhead.',
    estimatedMinutes: 22,
    imagePrompt:
      'Layered educational visual comparing on-premises, IaaS, PaaS, SaaS, and serverless responsibility from customer-managed to provider-managed.',
    sourceNote:
      'Definitions combine NIST service/deployment models with Microsoft and IBM responsibility examples.',
    sources: [
      {
        label: 'NIST SP 800-145: Service and deployment models',
        url: 'https://csrc.nist.gov/pubs/sp/800/145/final',
      },
      {
        label: 'Microsoft Learn: Shared responsibility in the cloud',
        url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility',
      },
      {
        label: 'IBM: Cloud computing service and deployment models',
        url: 'https://www.ibm.com/think/topics/cloud-computing',
      },
    ],
    keyIdeas: [
      'The more managed the service, the less infrastructure you operate.',
      'Customer data, identities, and access decisions remain customer responsibilities.',
      'Hybrid means connected environments; multicloud means using more than one cloud provider.',
      'Serverless reduces server management, not application design responsibility.',
    ],
    deepDive: [
      {
        heading: 'The responsibility spectrum',
        body:
          'IaaS gives the customer the most control: virtual machines, operating systems, applications, and data remain largely customer-managed while the provider manages physical facilities and core infrastructure. PaaS removes operating system and runtime maintenance so teams focus on code and data. SaaS provides a complete application where customers configure usage, identity, data, and governance.',
      },
      {
        heading: 'Serverless as an operating model',
        body:
          'Serverless is not the absence of servers. It means the provider handles provisioning, scaling, scheduling, and much of the platform operation. Learners should connect serverless to event-driven systems, per-request execution, automatic scaling, and reduced idle capacity. They should also remember that application logic, permissions, data protection, and observability still matter.',
      },
      {
        heading: 'Deployment models',
        body:
          'Public cloud is provider-owned infrastructure consumed over the internet or private connectivity. Private cloud is dedicated to one organization and may run on-premises or hosted. Hybrid cloud combines environments with operational integration. Multicloud uses services from multiple cloud providers, often for resilience, negotiation leverage, specialized services, or regulatory reasons.',
      },
      {
        heading: 'How to answer scenario questions',
        body:
          'Look for the tradeoff. If a team needs OS-level control, IaaS is likely. If a team wants to deploy code without patching servers, PaaS or serverless fits. If the need is a finished business application like email or CRM, SaaS is the answer. If a workload must keep sensitive data on-premises while bursting public capacity, think hybrid.',
      },
    ],
    visual: {
      title: 'Responsibility Moves Up the Stack',
      layers: ['On-prem: you manage all', 'IaaS: you manage OS and app', 'PaaS: you manage app and data', 'SaaS: you configure and govern', 'Serverless: you ship event logic'],
    },
    questions: [
      {
        id: 'models-001',
        question: 'Which service model gives customers the most control over the operating system?',
        options: [
          { id: 'a', text: 'SaaS' },
          { id: 'b', text: 'PaaS' },
          { id: 'c', text: 'IaaS' },
          { id: 'd', text: 'Managed email' },
        ],
        correctAnswer: 'c',
        explanation:
          'IaaS exposes virtualized infrastructure while leaving operating system configuration and application management to the customer.',
        source: 'Microsoft shared responsibility and IBM cloud overview',
        difficulty: 'easy',
      },
      {
        id: 'models-002',
        question: 'A team wants to deploy code without managing virtual machines or operating system patches. Which model fits best?',
        options: [
          { id: 'a', text: 'PaaS' },
          { id: 'b', text: 'On-premises' },
          { id: 'c', text: 'Colocation only' },
          { id: 'd', text: 'Tape archive' },
        ],
        correctAnswer: 'a',
        explanation:
          'PaaS abstracts infrastructure and operating system management so developers focus on application code and data.',
        source: 'Microsoft shared responsibility',
        difficulty: 'easy',
      },
      {
        id: 'models-003',
        question: 'Which responsibility does Microsoft identify as always retained by the customer across cloud models?',
        options: [
          { id: 'a', text: 'Physical datacenter security' },
          { id: 'b', text: 'Physical host maintenance' },
          { id: 'c', text: 'Data and identities' },
          { id: 'd', text: 'Hypervisor patching for SaaS' },
        ],
        correctAnswer: 'c',
        explanation:
          'Shared responsibility guidance consistently keeps customer data, identities, accounts, endpoints, and access decisions with the customer.',
        source: 'Microsoft shared responsibility',
        difficulty: 'medium',
      },
      {
        id: 'models-004',
        question: 'What is SaaS?',
        options: [
          { id: 'a', text: 'A complete cloud-hosted application consumed by users' },
          { id: 'b', text: 'A raw virtual network only' },
          { id: 'c', text: 'A physical datacenter owned by the customer' },
          { id: 'd', text: 'A backup generator for cloud regions' },
        ],
        correctAnswer: 'a',
        explanation:
          'SaaS delivers ready-to-use application software; users usually manage configuration, access, and data rather than infrastructure.',
        source: 'NIST SP 800-145 and IBM cloud overview',
        difficulty: 'easy',
      },
      {
        id: 'models-005',
        question: 'Which statement about serverless is most accurate?',
        options: [
          { id: 'a', text: 'No servers are involved anywhere' },
          { id: 'b', text: 'The provider handles much of the server provisioning and scaling' },
          { id: 'c', text: 'It only works for databases' },
          { id: 'd', text: 'It removes the need for IAM' },
        ],
        correctAnswer: 'b',
        explanation:
          'Serverless shifts infrastructure operations to the provider, but developers still design code, permissions, data flows, and monitoring.',
        source: 'IBM cloud computing overview',
        difficulty: 'medium',
      },
      {
        id: 'models-006',
        question: 'A company uses AWS for analytics and Azure for identity-integrated business apps. What is this pattern called?',
        options: [
          { id: 'a', text: 'Single tenant' },
          { id: 'b', text: 'Multicloud' },
          { id: 'c', text: 'Cold standby' },
          { id: 'd', text: 'Vertical scaling' },
        ],
        correctAnswer: 'b',
        explanation:
          'Multicloud means using services from more than one cloud provider. It may or may not be integrated with on-premises systems.',
        source: 'IBM cloud computing overview',
        difficulty: 'easy',
      },
      {
        id: 'models-007',
        question: 'Which scenario best describes hybrid cloud?',
        options: [
          { id: 'a', text: 'A connected architecture spanning on-premises/private resources and public cloud' },
          { id: 'b', text: 'Using only one SaaS application' },
          { id: 'c', text: 'Buying more servers for a local data center without cloud connectivity' },
          { id: 'd', text: 'Running all workloads in one public region' },
        ],
        correctAnswer: 'a',
        explanation:
          'Hybrid cloud connects public cloud with private cloud or on-premises environments as one operating architecture.',
        source: 'IBM cloud computing overview',
        difficulty: 'medium',
      },
      {
        id: 'models-008',
        question: 'In IaaS, who usually patches the guest operating system?',
        options: [
          { id: 'a', text: 'The customer' },
          { id: 'b', text: 'The cloud provider in all cases' },
          { id: 'c', text: 'The internet service provider' },
          { id: 'd', text: 'The hardware vendor only' },
        ],
        correctAnswer: 'a',
        explanation:
          'In IaaS, the provider manages physical infrastructure and virtualization, while customers usually manage guest OS patching and application layers.',
        source: 'Microsoft shared responsibility',
        difficulty: 'medium',
      },
      {
        id: 'models-009',
        question: 'Which deployment model is dedicated to a single organization?',
        options: [
          { id: 'a', text: 'Private cloud' },
          { id: 'b', text: 'Public cloud' },
          { id: 'c', text: 'SaaS' },
          { id: 'd', text: 'Measured service' },
        ],
        correctAnswer: 'a',
        explanation:
          'A private cloud is dedicated to one organization, whether it is hosted on-premises or by a third party.',
        source: 'NIST SP 800-145 and IBM cloud overview',
        difficulty: 'easy',
      },
      {
        id: 'models-010',
        question: 'Which choice is a common SaaS responsibility for customers?',
        options: [
          { id: 'a', text: 'Replacing physical disks in provider data centers' },
          { id: 'b', text: 'Managing user access and data governance' },
          { id: 'c', text: 'Maintaining hypervisors' },
          { id: 'd', text: 'Cooling server rooms' },
        ],
        correctAnswer: 'b',
        explanation:
          'Even with SaaS, customers must manage identities, access, data classification, and configuration decisions.',
        source: 'Microsoft shared responsibility',
        difficulty: 'medium',
      },
      {
        id: 'models-011',
        question: 'Which model is usually best for a legacy application that requires a custom operating system agent?',
        options: [
          { id: 'a', text: 'IaaS' },
          { id: 'b', text: 'SaaS' },
          { id: 'c', text: 'Finished CRM application' },
          { id: 'd', text: 'Static website hosting only' },
        ],
        correctAnswer: 'a',
        explanation:
          'OS-level agents usually require control of the virtual machine, which points toward IaaS unless the app can be modernized.',
        source: 'Microsoft shared responsibility',
        difficulty: 'hard',
      },
      {
        id: 'models-012',
        question: 'What is the main exam trap in shared responsibility questions?',
        options: [
          { id: 'a', text: 'Assuming the provider handles all security because the workload is in cloud' },
          { id: 'b', text: 'Remembering that physical hosts are provider-managed in public cloud' },
          { id: 'c', text: 'Separating IaaS from PaaS' },
          { id: 'd', text: 'Using managed services for undifferentiated work' },
        ],
        correctAnswer: 'a',
        explanation:
          'Cloud shifts some duties to the provider, but customer data, identities, access, and configurations remain critical customer responsibilities.',
        source: 'Microsoft shared responsibility',
        difficulty: 'hard',
      },
    ],
  },
  {
    slug: 'reliability-security-and-operations',
    title: 'Reliability, Security, and Operations',
    summary:
      'Connect regions, zones, redundancy, observability, IAM, encryption, backup, recovery, and governance into an exam-ready operating mindset.',
    estimatedMinutes: 25,
    imagePrompt:
      'Cloud architecture learning visual with a global region, multiple zones, load balancer, redundant app instances, database replication, monitoring, IAM, and backup.',
    sourceNote:
      'Reliability framing follows AWS and Google Cloud Well-Architected guidance, with security responsibility grounded in Microsoft guidance.',
    sources: [
      {
        label: 'AWS Well-Architected Framework: Reliability Pillar',
        url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html',
      },
      {
        label: 'Google Cloud Architecture Framework: Reliability pillar',
        url: 'https://docs.cloud.google.com/architecture/framework/reliability',
      },
      {
        label: 'Microsoft Learn: Shared responsibility in the cloud',
        url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility',
      },
    ],
    keyIdeas: [
      'Reliability is designed through redundancy, failure isolation, monitoring, and recovery testing.',
      'High availability reduces downtime; disaster recovery restores service after major failure.',
      'Security starts with identity, least privilege, data protection, network controls, and logging.',
      'Good operations use automation, observability, postmortems, and continuous improvement.',
    ],
    deepDive: [
      {
        heading: 'Reliability as a design discipline',
        body:
          'AWS frames reliability around strong foundations, resilient architecture, change management, and failure recovery. Google Cloud emphasizes user-experience goals, realistic targets, redundancy, horizontal scalability, observability, graceful degradation, recovery testing, and postmortems. Together, the lesson is simple: reliability is not a product toggle; it is a set of architecture and operating decisions.',
      },
      {
        heading: 'Regions, zones, and failure domains',
        body:
          'A region is a geographic area containing cloud infrastructure. Zones are isolated locations within a region. Designing across zones helps tolerate localized failures. Designing across regions can improve disaster recovery or user latency, but it adds complexity, data replication decisions, consistency tradeoffs, and cost.',
      },
      {
        heading: 'Security foundations',
        body:
          'Cloud security starts with the shared responsibility model. The provider secures underlying facilities and infrastructure; customers secure their data, identities, accounts, endpoints, access policies, and workload configuration. IAM least privilege, multifactor authentication, encryption, segmentation, logging, and regular review are common exam-safe controls.',
      },
      {
        heading: 'Operations and learning loops',
        body:
          'Reliable operations need monitoring, alerting, incident response, automated remediation where appropriate, and post-incident learning. Backups must be restorable, not merely configured. Recovery time objective (RTO) describes how quickly service must return; recovery point objective (RPO) describes how much data loss is acceptable.',
      },
    ],
    visual: {
      title: 'Resilient Workload Pattern',
      layers: ['Users', 'Load balancer', 'Zone A app + Zone B app', 'Replicated data', 'Monitoring + backup + IAM'],
    },
    questions: [
      {
        id: 'ops-001',
        question: 'What is high availability primarily trying to reduce?',
        options: [
          { id: 'a', text: 'Service downtime' },
          { id: 'b', text: 'All cloud spending to zero' },
          { id: 'c', text: 'The need for identity controls' },
          { id: 'd', text: 'Every form of application complexity' },
        ],
        correctAnswer: 'a',
        explanation:
          'High availability designs reduce downtime through redundancy, failure detection, traffic management, and recovery mechanisms.',
        source: 'AWS and Google Cloud reliability guidance',
        difficulty: 'easy',
      },
      {
        id: 'ops-002',
        question: 'Why deploy application instances across multiple zones?',
        options: [
          { id: 'a', text: 'To tolerate failure of a single zone' },
          { id: 'b', text: 'To avoid all network charges' },
          { id: 'c', text: 'To remove the need for monitoring' },
          { id: 'd', text: 'To guarantee no application bugs' },
        ],
        correctAnswer: 'a',
        explanation:
          'Zones are separate failure domains. Multi-zone deployment can keep service available if one zone has a localized issue.',
        source: 'Google Cloud reliability guidance',
        difficulty: 'easy',
      },
      {
        id: 'ops-003',
        question: 'Which metric describes the maximum acceptable amount of data loss after an incident?',
        options: [
          { id: 'a', text: 'RPO' },
          { id: 'b', text: 'RTO' },
          { id: 'c', text: 'CPU utilization' },
          { id: 'd', text: 'SLA credit' },
        ],
        correctAnswer: 'a',
        explanation:
          'Recovery point objective (RPO) is the maximum acceptable data loss measured in time. RTO is the time to restore service.',
        source: 'AWS and Google Cloud reliability guidance',
        difficulty: 'medium',
      },
      {
        id: 'ops-004',
        question: 'Which metric describes how quickly a service must be restored?',
        options: [
          { id: 'a', text: 'RTO' },
          { id: 'b', text: 'RPO' },
          { id: 'c', text: 'Object lifecycle age' },
          { id: 'd', text: 'Storage class' },
        ],
        correctAnswer: 'a',
        explanation:
          'Recovery time objective (RTO) is the target time to restore service after a disruption.',
        source: 'AWS and Google Cloud reliability guidance',
        difficulty: 'medium',
      },
      {
        id: 'ops-005',
        question: 'Which security control should usually be applied first to reduce excessive permissions?',
        options: [
          { id: 'a', text: 'Least privilege IAM' },
          { id: 'b', text: 'Bigger virtual machines' },
          { id: 'c', text: 'More regions' },
          { id: 'd', text: 'Longer resource names' },
        ],
        correctAnswer: 'a',
        explanation:
          'Least privilege grants only the permissions needed for a role or task, reducing blast radius when credentials are misused.',
        source: 'Microsoft shared responsibility',
        difficulty: 'easy',
      },
      {
        id: 'ops-006',
        question: 'A backup exists but has never been restored in a test. What is the biggest risk?',
        options: [
          { id: 'a', text: 'The team does not know whether recovery will actually work' },
          { id: 'b', text: 'The backup becomes a SaaS product' },
          { id: 'c', text: 'The cloud provider cannot meter it' },
          { id: 'd', text: 'The workload automatically becomes multicloud' },
        ],
        correctAnswer: 'a',
        explanation:
          'Reliability guidance stresses testing recovery. A backup that cannot be restored does not meet a real recovery objective.',
        source: 'AWS and Google Cloud reliability guidance',
        difficulty: 'medium',
      },
      {
        id: 'ops-007',
        question: 'Which practice helps detect failures before users report them?',
        options: [
          { id: 'a', text: 'Observability with metrics, logs, traces, and alerts' },
          { id: 'b', text: 'Removing all dashboards' },
          { id: 'c', text: 'Only reviewing bills quarterly' },
          { id: 'd', text: 'Avoiding health checks' },
        ],
        correctAnswer: 'a',
        explanation:
          'Google Cloud reliability guidance emphasizes observation and monitoring to understand trends and identify problems proactively.',
        source: 'Google Cloud reliability guidance',
        difficulty: 'easy',
      },
      {
        id: 'ops-008',
        question: 'What does graceful degradation mean?',
        options: [
          { id: 'a', text: 'A system keeps critical functions working when some dependencies fail' },
          { id: 'b', text: 'A system hides all incidents from engineers' },
          { id: 'c', text: 'A system deletes logs during high traffic' },
          { id: 'd', text: 'A system can only run in one zone' },
        ],
        correctAnswer: 'a',
        explanation:
          'Graceful degradation preserves the most important user outcomes even when noncritical components or dependencies fail.',
        source: 'Google Cloud reliability guidance',
        difficulty: 'hard',
      },
      {
        id: 'ops-009',
        question: 'Which item is typically a provider responsibility in public cloud?',
        options: [
          { id: 'a', text: 'Physical datacenter security' },
          { id: 'b', text: 'Customer data classification' },
          { id: 'c', text: 'User access reviews' },
          { id: 'd', text: 'Application role design' },
        ],
        correctAnswer: 'a',
        explanation:
          'Providers secure physical datacenters and underlying infrastructure. Customers remain responsible for data, accounts, access, and workload choices.',
        source: 'Microsoft shared responsibility',
        difficulty: 'medium',
      },
      {
        id: 'ops-010',
        question: 'Why do postmortems matter in cloud operations?',
        options: [
          { id: 'a', text: 'They turn incidents into improvements that reduce repeat failures' },
          { id: 'b', text: 'They replace monitoring' },
          { id: 'c', text: 'They guarantee no future outages' },
          { id: 'd', text: 'They are only for billing disputes' },
        ],
        correctAnswer: 'a',
        explanation:
          'Google Cloud reliability guidance includes learning from failures and conducting postmortems as a core principle.',
        source: 'Google Cloud reliability guidance',
        difficulty: 'medium',
      },
      {
        id: 'ops-011',
        question: 'A workload needs lower latency for users on multiple continents. Which design might help?',
        options: [
          { id: 'a', text: 'Use global distribution patterns such as CDN, edge, or multi-region deployment' },
          { id: 'b', text: 'Put every user through one small instance in one zone' },
          { id: 'c', text: 'Disable caching everywhere' },
          { id: 'd', text: 'Remove health checks' },
        ],
        correctAnswer: 'a',
        explanation:
          'Global distribution can place content or services closer to users, but it must be balanced with data consistency, cost, and operational complexity.',
        source: 'IBM cloud computing overview and reliability guidance',
        difficulty: 'hard',
      },
      {
        id: 'ops-012',
        question: 'Which design best supports horizontal scalability?',
        options: [
          { id: 'a', text: 'Stateless app instances behind a load balancer' },
          { id: 'b', text: 'A single manually managed server with local-only state' },
          { id: 'c', text: 'No automation and no health checks' },
          { id: 'd', text: 'One administrator approving every request by email' },
        ],
        correctAnswer: 'a',
        explanation:
          'Horizontal scaling adds more instances. Stateless services behind load balancers are easier to scale and replace.',
        source: 'Google Cloud reliability guidance',
        difficulty: 'hard',
      },
    ],
  },
];
