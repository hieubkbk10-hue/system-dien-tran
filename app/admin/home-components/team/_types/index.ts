export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export type TeamStyle = 'grid' | 'cards' | 'carousel' | 'hexagon' | 'timeline' | 'spotlight';

export interface TeamConfig {
  members: TeamMember[];
  style: TeamStyle;
}
