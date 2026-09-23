import type { ServiceSlug } from "@/lib/data";

// Opportunities, not a catalogue of deployed AI features.
export const serviceAiDirection: Record<ServiceSlug, string> = {
  "business-process-outsourcing": "Managed operations gives us direct insight into ticket handling, document processing, data entry, onboarding, and reporting. The direction is to let software and AI handle more repeatable work while people focus on exceptions, judgment, relationships, and review.",
  "remote-teams": "Knowledge retrieval, task summaries, and workflow routing could support distributed teams. Team leads would retain responsibility for quality, escalations, and client relationships.",
  "customer-support": "Candidate uses include ticket classification, knowledge retrieval, response assistance, conversation summaries, and routing. Human agents would review sensitive responses and handle complex cases and escalations.",
  "virtual-assistant-services": "Email classification, scheduling assistance, knowledge retrieval, and task summaries could reduce repetitive administration. Assistants would review outputs and retain responsibility for commitments and exceptions.",
  "back-office-operations": "Document classification, structured extraction, onboarding support, and workflow routing could assist repetitive processing. People would validate records, resolve exceptions, and approve sensitive changes.",
  "lead-generation-appointment-setting": "Research summaries, CRM record assistance, and follow-up preparation could support the team. People would review outreach, qualify context, and manage prospect relationships.",
  "custom-application-development": "Enterprise applications can establish the APIs, structured data, permissions, and review points needed for document intelligence, knowledge retrieval, and workflow assistance. AI features would be scoped and validated against the actual process.",
  "mobile-application-development": "Mobile workflows could incorporate document capture assistance, contextual knowledge, and task summaries, with appropriate access controls and human review before consequential actions.",
  "crm-development": "Record summaries, activity classification, and follow-up recommendations could help teams manage customer context. Users would review recommendations and approve updates and communications.",
  "client-portal-development": "Request classification, document extraction, and knowledge assistance could complement portal workflows. Permissions, traceability, and approval steps would govern how outputs are used.",
  "business-automation": "Document intelligence and AI-assisted routing could extend rules-based automation. Review thresholds, exception queues, traceability, and human approvals would be designed around each workflow.",
  "data-reporting-dashboards": "Reporting summaries, anomaly indicators, and operational recommendations could help teams interpret workloads. People would verify source data and assess signals before making decisions."
};

export const aiFlywheel = [
  { title: "Enter business operations", body: "Software, industry platforms, and managed operations provide direct exposure to how organizations work." },
  { title: "Understand the workflow", body: "Map repetitive processes, bottlenecks, decision points, documents, interactions, handoffs, and data dependencies." },
  { title: "Digitize the workflow", body: "Build applications, portals, APIs, dashboards, databases, and enterprise integrations around the process." },
  { title: "Structure data and process", body: "Make workflow states and data consistent so operations can be understood and improved systematically." },
  { title: "Add intelligence", body: "Progressively develop AI assistance for classification, retrieval, routing, recommendations, and analytics." },
  { title: "Automate repetitive work", body: "Move validated, repeatable tasks into software and AI workflows with appropriate controls." },
  { title: "Keep people accountable", body: "People retain judgment, exceptions, relationships, complex decisions, regulated approvals, and oversight." },
  { title: "Reuse the architecture", body: "Adapt successful workflow patterns to adjacent industries and use operating feedback to improve the next cycle." }
];
