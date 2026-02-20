import type {
  TeamConfig,
  TeamEditorMember,
  TeamHarmony,
  TeamMember,
  TeamStyle,
} from '../_types';

export const TEAM_STYLES: Array<{ id: TeamStyle; label: string }> = [
  { id: 'grid', label: 'Grid' },
  { id: 'cards', label: 'Cards' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'hexagon', label: 'Hexagon' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'spotlight', label: 'Spotlight' },
];

export const DEFAULT_TEAM_HARMONY: TeamHarmony = 'analogous';

const TEAM_STYLE_SET = new Set<TeamStyle>(TEAM_STYLES.map((item) => item.id));

const TEAM_HARMONY_SET = new Set<TeamHarmony>(['analogous', 'complementary', 'triadic']);

const toText = (value: unknown) => {
  if (typeof value === 'string') {return value;}
  if (typeof value === 'number') {return String(value);}
  return '';
};

export const normalizeTeamHarmony = (value?: unknown): TeamHarmony => {
  if (typeof value === 'string' && TEAM_HARMONY_SET.has(value as TeamHarmony)) {
    return value as TeamHarmony;
  }

  return DEFAULT_TEAM_HARMONY;
};

export const normalizeTeamStyle = (value?: unknown): TeamStyle => {
  if (typeof value === 'string' && TEAM_STYLE_SET.has(value as TeamStyle)) {
    return value as TeamStyle;
  }

  return 'grid';
};

const toMemberRecord = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as Record<string, unknown>;
  }

  return {};
};

const normalizeTeamMember = (raw: unknown): TeamMember => {
  const member = toMemberRecord(raw);

  return {
    name: toText(member.name),
    role: toText(member.role),
    avatar: toText(member.avatar),
    bio: toText(member.bio),
    facebook: toText(member.facebook),
    linkedin: toText(member.linkedin),
    twitter: toText(member.twitter),
    email: toText(member.email),
  };
};

export const normalizeTeamMembers = (input: unknown): TeamMember[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map(normalizeTeamMember);
};

const buildEditorIdSeed = (member: TeamMember, index: number) => {
  const seed = `${member.name}|${member.role}|${member.email}|${index}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }

  return Math.abs(hash) + 1_000 + index;
};

export const toTeamEditorMembers = (members: TeamMember[]): TeamEditorMember[] => {
  const seen = new Set<number>();

  return members.map((member, index) => {
    let id = buildEditorIdSeed(member, index);

    while (seen.has(id)) {
      id += 1;
    }

    seen.add(id);

    return {
      id,
      ...member,
    };
  });
};

export const toTeamPersistMembers = (members: TeamEditorMember[]): TeamMember[] => (
  members.map((member) => ({
    name: member.name,
    role: member.role,
    avatar: member.avatar,
    bio: member.bio,
    facebook: member.facebook,
    linkedin: member.linkedin,
    twitter: member.twitter,
    email: member.email,
  }))
);

export const normalizeTeamConfig = (rawConfig: unknown): TeamConfig => {
  const config = (typeof rawConfig === 'object' && rawConfig !== null)
    ? rawConfig as Record<string, unknown>
    : {};

  const members = normalizeTeamMembers(config.members);

  return {
    members: members.length > 0 ? members : DEFAULT_TEAM_CONFIG.members,
    style: normalizeTeamStyle(config.style),
    harmony: normalizeTeamHarmony(config.harmony),
  };
};

export const DEFAULT_TEAM_CONFIG: TeamConfig = {
  members: [
    {
      avatar: '',
      bio: '',
      email: '',
      facebook: '',
      linkedin: '',
      name: '',
      role: '',
      twitter: '',
    },
  ],
  style: 'grid',
  harmony: DEFAULT_TEAM_HARMONY,
};
