// lib/constants.ts
export const SITE_STATUS = {
  PLANNING: 'planning',
  SURVEY: 'survey', 
  DESIGN: 'design',
  CONSTRUCTION: 'construction',
  OPERATIONAL: 'operational',
  MAINTENANCE: 'maintenance'
} as const;

export const PROJECT_PHASES = {
  PHASE1: 'phase1',
  PHASE2: 'phase2', 
  PHASE3: 'phase3'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ENGINEER: 'engineer',
  SURVEYOR: 'surveyor',
  VIEWER: 'viewer'
} as const;
