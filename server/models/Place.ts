import mongoose, { Schema, Model } from 'mongoose';

export interface IPlace {
  title: string;
  originalName?: string;
  category: 'buda' | 'pest' | 'termas' | 'ruin-bars' | 'cultura' | 'miradores';
  description: string;
  visited: boolean;
  priority: 'imprescindible' | 'recomendado' | 'opcional';
  estimatedTimeMinutes?: number;
  locationName?: string;
  googleMapsQuery?: string;
  tip?: string;
  visitedAt?: Date | null;
  notes?: string;
  photos?: string[];
}

const PlaceSchema = new Schema<IPlace>(
  {
    title: {
      type: String,
      required: [true, 'El título del lugar es obligatorio'],
      trim: true,
      maxlength: [120, 'El título no puede superar los 120 caracteres'],
    },
    originalName: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['buda', 'pest', 'termas', 'ruin-bars', 'cultura', 'miradores'],
      default: 'pest',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    visited: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ['imprescindible', 'recomendado', 'opcional'],
      default: 'recomendado',
    },
    estimatedTimeMinutes: {
      type: Number,
      default: 60,
      min: 5,
    },
    locationName: {
      type: String,
      default: '',
    },
    googleMapsQuery: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    visitedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    photos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

PlaceSchema.index({ category: 1, visited: 1 });

export const PlaceModel: Model<IPlace> =
  (mongoose.models.Place as Model<IPlace>) || mongoose.model<IPlace>('Place', PlaceSchema);
