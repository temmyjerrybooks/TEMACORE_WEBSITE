import type {
  AdminUser,
  ClientIntake,
  Lead,
  ProjectRequest,
  TalentApplication
} from "./types";

export const DATABASE_TABLES = {
  leads: "leads",
  clientIntakes: "client_intakes",
  projectRequests: "project_requests",
  talentApplications: "talent_applications",
  adminUsers: "admin_users"
} as const;

export interface Repository<CreateInput, Row> {
  create(input: CreateInput): Promise<Row>;
  getById(id: string): Promise<Row | null>;
  updateStatus(id: string, status: string): Promise<Row>;
}

export type TemacoreRepositories = {
  leads: Repository<Partial<Lead>, Lead>;
  clientIntakes: Repository<Partial<ClientIntake>, ClientIntake>;
  projectRequests: Repository<Partial<ProjectRequest>, ProjectRequest>;
  talentApplications: Repository<Partial<TalentApplication>, TalentApplication>;
  adminUsers: Repository<Partial<AdminUser>, AdminUser>;
};

export function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    throw new Error("PostgreSQL is not configured yet.");
  }
}
