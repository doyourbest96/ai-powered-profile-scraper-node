export type Profile = {
  name: string;
  location: string;
  age: number;
  lastSeen: string;
  videoUrl?: string;
  avatar?: string;
  intro: string;
  lifeStory: string;
  freeTime: string;
  other: string;
  accomplishments: string;
  education: string[];
  employment: Array<{
    company: string;
    role: string;
    period: string;
  }>;
  startup: {
    name: string;
    description: string;
    progress: string;
    funding: string;
  };
  cofounderPreferences: {
    requirements: string[];
    idealPersonality: string;
    equity: string;
  };
  interests: {
    shared: string[];
    personal: string[];
  };
  linkedIn?: string;
}
