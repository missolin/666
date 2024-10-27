export interface Website {
  id: string;
  url: string;
  title: string;
}

export interface Action {
  type: 'click' | 'input' | 'scroll';
  selector: string;
  value?: string;
  timestamp: number;
}

export interface Recording {
  id: string;
  name: string;
  actions: Action[];
}