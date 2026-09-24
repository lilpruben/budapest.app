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
  photos?: string[];
  imageUrl?: string;
  website?: string;
  phone?: string;
  price?: string;
  openingHours?: string;
  metroOrTransit?: string;
  priceCategory?: 'free' | 'museum' | 'food' | 'bar' | 'transport' | 'hotel';
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

export interface TripStatus {
  recapGenerated: boolean;
  generatedAt?: string | null;
}
