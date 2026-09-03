import mongoose from 'mongoose';
import { PlaceModel, IPlace } from './models/Place';
import { BUDAPEST_SEED_PLACES } from './seedData';

export interface DBService {
  isMongoConnected(): boolean;
  getStatus(): Promise<{
    mode: 'mongodb' | 'memory';
    connected: boolean;
    databaseName?: string;
    host?: string;
    count: number;
    uriConfigured: boolean;
  }>;
  getPlaces(query?: { category?: string; visited?: string; search?: string }): Promise<any[]>;
  createPlace(data: Partial<any>): Promise<any>;
  updatePlace(id: string, data: Partial<any>): Promise<any | null>;
  toggleVisited(id: string, visited?: boolean): Promise<any | null>;
  deletePlace(id: string): Promise<boolean>;
  resetSeed(): Promise<{ count: number }>;
}

let isMongoActive = false;
let memoryStore: any[] = [];

// Initialize in-memory store with seed data as baseline
function initMemoryStore() {
  const now = new Date().toISOString();
  memoryStore = BUDAPEST_SEED_PLACES.map((p, index) => ({
    _id: `mem_${index + 1}_${Date.now()}`,
    ...p,
    visited: p.visited || false,
    visitedAt: p.visited ? now : null,
    notes: '',
    createdAt: now,
    updatedAt: now,
  }));
}
initMemoryStore();

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('[DB] No MONGODB_URI provided. Running in high-performance memory fallback mode with Budapest seed data.');
    return;
  }

  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`);
    // Set 3.5-second serverSelectionTimeoutMS so we don't hang if the user's remote DB is not reachable
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3500,
      connectTimeoutMS: 3500,
    });

    isMongoActive = true;
    console.log('[DB] Successfully connected to MongoDB via Mongoose!');

    // Check if collection is empty, and auto-seed if needed
    const count = await PlaceModel.countDocuments();
    if (count === 0) {
      console.log(`[DB] MongoDB collection 'places' is empty. Auto-seeding ${BUDAPEST_SEED_PLACES.length} iconic Budapest places...`);
      await PlaceModel.insertMany(BUDAPEST_SEED_PLACES as any);
      console.log('[DB] Seeding completed successfully.');
    } else {
      console.log(`[DB] Found ${count} existing Budapest places in MongoDB.`);
    }
  } catch (err: any) {
    isMongoActive = false;
    console.warn('[DB] Could not connect to MongoDB:', err?.message || err);
    console.log('[DB] Falling back to interactive in-memory store. You can provide a valid MONGODB_URI in .env.');
  }
}

export const dbService: DBService = {
  isMongoConnected() {
    return isMongoActive && mongoose.connection.readyState === 1;
  },

  async getStatus() {
    const mongoUriConfigured = Boolean(process.env.MONGODB_URI);
    const connected = this.isMongoConnected();

    if (connected) {
      const count = await PlaceModel.countDocuments();
      return {
        mode: 'mongodb',
        connected: true,
        databaseName: mongoose.connection.name || 'budapest_checklist',
        host: mongoose.connection.host,
        count,
        uriConfigured: true,
      };
    }

    return {
      mode: 'memory',
      connected: false,
      count: memoryStore.length,
      uriConfigured: mongoUriConfigured,
    };
  },

  async getPlaces(filters = {}) {
    const { category, visited, search } = filters;

    if (this.isMongoConnected()) {
      const query: any = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (visited === 'true') {
        query.visited = true;
      } else if (visited === 'false') {
        query.visited = false;
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { originalName: regex }, { description: regex }];
      }

      const places = await PlaceModel.find(query).sort({ visited: 1, priority: 1, title: 1 }).lean();
      return places;
    }

    // In-memory fallback
    let list = [...memoryStore];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (visited === 'true') {
      list = list.filter((p) => p.visited === true);
    } else if (visited === 'false') {
      list = list.filter((p) => p.visited === false);
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.originalName && p.originalName.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Sort: unvisited first, then priority (imprescindible > recomendado > opcional), then title
    const priorityWeight: Record<string, number> = {
      imprescindible: 1,
      recomendado: 2,
      opcional: 3,
    };

    list.sort((a, b) => {
      if (a.visited !== b.visited) return a.visited ? 1 : -1;
      const weightA = priorityWeight[a.priority] || 4;
      const weightB = priorityWeight[b.priority] || 4;
      if (weightA !== weightB) return weightA - weightB;
      return a.title.localeCompare(b.title);
    });

    return list;
  },

  async createPlace(data) {
    if (this.isMongoConnected()) {
      const doc = new PlaceModel({
        ...data,
        visited: Boolean(data.visited),
        visitedAt: data.visited ? new Date() : null,
      });
      const saved = await doc.save();
      return saved.toObject();
    }

    const now = new Date().toISOString();
    const newPlace = {
      _id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title || 'Lugar sin nombre',
      originalName: data.originalName || '',
      category: data.category || 'pest',
      description: data.description || '',
      visited: Boolean(data.visited),
      priority: data.priority || 'recomendado',
      estimatedTimeMinutes: Number(data.estimatedTimeMinutes) || 60,
      locationName: data.locationName || '',
      googleMapsQuery: data.googleMapsQuery || data.title,
      tip: data.tip || '',
      visitedAt: data.visited ? now : null,
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now,
    };

    memoryStore.unshift(newPlace);
    return newPlace;
  },

  async updatePlace(id, data) {
    if (this.isMongoConnected()) {
      const updated = await (PlaceModel as any).findByIdAndUpdate(
        id,
        {
          $set: {
            ...data,
            updatedAt: new Date(),
          },
        },
        { new: true, runValidators: true }
      ).lean();
      return updated;
    }

    const index = memoryStore.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;

    const existing = memoryStore[index];
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    memoryStore[index] = updated;
    return updated;
  },

  async toggleVisited(id, explicitVisited) {
    if (this.isMongoConnected()) {
      const current = await (PlaceModel as any).findById(id);
      if (!current) return null;

      const newStatus = explicitVisited !== undefined ? explicitVisited : !current.visited;
      current.visited = newStatus;
      current.visitedAt = newStatus ? new Date() : null;
      await current.save();
      return current.toObject();
    }

    const index = memoryStore.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;

    const current = memoryStore[index];
    const newStatus = explicitVisited !== undefined ? explicitVisited : !current.visited;
    const now = new Date().toISOString();

    const updated = {
      ...current,
      visited: newStatus,
      visitedAt: newStatus ? now : null,
      updatedAt: now,
    };
    memoryStore[index] = updated;
    return updated;
  },

  async deletePlace(id) {
    if (this.isMongoConnected()) {
      const result = await (PlaceModel as any).findByIdAndDelete(id);
      return Boolean(result);
    }

    const initialLen = memoryStore.length;
    memoryStore = memoryStore.filter((p) => p._id !== id && p.id !== id);
    return memoryStore.length < initialLen;
  },

  async resetSeed() {
    if (this.isMongoConnected()) {
      await PlaceModel.deleteMany({});
      await PlaceModel.insertMany(BUDAPEST_SEED_PLACES as any);
      const count = await PlaceModel.countDocuments();
      return { count };
    }

    initMemoryStore();
    return { count: memoryStore.length };
  },
};
