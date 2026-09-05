export type PlaceCategory =
  | 'buda'
  | 'pest'
  | 'termas'
  | 'ruin-bars'
  | 'cultura'
  | 'miradores';

export type PlacePriority = 'imprescindible' | 'recomendado' | 'opcional';

export type SortOption = 'recent' | 'alpha' | 'priority';

export interface Place {
  _id: string;
  title: string;
  originalName?: string;
  category: PlaceCategory;
  description: string;
  visited: boolean;
  priority: PlacePriority;
  estimatedTimeMinutes?: number;
  locationName?: string;
  googleMapsQuery?: string;
  tip?: string;
  visitedAt?: string | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbStatus {
  mode: 'mongodb' | 'memory';
  connected: boolean;
  databaseName?: string;
  host?: string;
  count: number;
  uriConfigured: boolean;
}
