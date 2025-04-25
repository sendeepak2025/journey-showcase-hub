
export type CompassTag = 'cognitive' | 'orchestrated' | 'memorable' | 'perceived' | 'activate' | 'social' | 'situational';

export interface TouchpointType {
  title: string;
  type: string;
  duration: string;
  comment?: string;
  compassTags: CompassTag[];
  actions: {
    title: string;
    description: string;
    imageUrl?: string;
    type: 'customer' | 'backoffice';
  }[];
}

export interface StageType {
  name: 'awareness' | 'consideration' | 'quote';
  description: string;
  touchpoints: TouchpointType[];
}

export interface JourneyType {
  title: string;
  npsScore: number;
  customerSentiment: number;
  keyInsight: string;
  performanceIndicators: {
    name: string;
    value: number;
  }[];
  stages: StageType[];
}
