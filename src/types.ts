export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export type AuthState = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type Link = {
  id: string;
  shortCode: string;
  redirectUrl: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Click = {
  id: string;
  createdAt: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  os?: string | null;
  browser?: string | null;
};

export type LinkWithClicks = Link & {
  clicks?: Click[];
};

export type AnalyticsBucket = {
  key: string;
  count: number;
};

export type OverviewAnalytics = {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  clicksByDay: AnalyticsBucket[];
  topSources: AnalyticsBucket[];
  topLocations: AnalyticsBucket[];
};

export type LinkAnalytics = {
  link: {
    id: string;
    shortCode: string;
    redirectUrl: string;
    description?: string | null;
    isActive: boolean;
    createdAt: string;
  };
  totalClicks: number;
  clicksByDay: AnalyticsBucket[];
  topSources: AnalyticsBucket[];
  topLocations: AnalyticsBucket[];
  recentClicks: Click[];
};
