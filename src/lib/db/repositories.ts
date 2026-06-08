import type {
  AdminUser,
  ClientIntake,
  Lead,
  ProjectRequest,
  TalentApplication
} from "./types";

export const SUPABASE_TABLES = {
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

export function assertSupabaseConfigured() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasUrl || !hasAnonKey) {
    throw new Error("Supabase is not configured yet.");
  }
}
