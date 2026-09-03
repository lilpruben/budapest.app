import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDatabase, dbService } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing
  app.use(express.json());

  // Connect database (with non-blocking fallback if MongoDB URI not configured)
  connectDatabase().catch((err) => {
    console.error('[Server] DB initialization warning:', err);
  });

  // --- API ROUTES ---

  // Health / Status & DB connection info
  app.get('/api/status', async (_req: Request, res: Response) => {
    try {
      const status = await dbService.getStatus();
      res.json({
        ok: true,
        ...status,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // List places (with category, visited, and search filters)
  app.get('/api/places', async (req: Request, res: Response) => {
    try {
      const { category, visited, search } = req.query;
      const places = await dbService.getPlaces({
        category: category as string,
        visited: visited as string,
        search: search as string,
      });
      res.json({ ok: true, count: places.length, data: places });
    } catch (err: any) {
      console.error('[API] Error fetching places:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Create new place
  app.post('/api/places', async (req: Request, res: Response) => {
    try {
      const { title, category, description, priority, locationName, tip, originalName, notes } = req.body;
      if (!title || !title.trim()) {
        res.status(400).json({ ok: false, error: 'El nombre del lugar es requerido.' });
        return;
      }

      const created = await dbService.createPlace({
        title: title.trim(),
        originalName: originalName?.trim() || '',
        category: category || 'pest',
        description: description?.trim() || '',
        priority: priority || 'recomendado',
        locationName: locationName?.trim() || '',
        tip: tip?.trim() || '',
        notes: notes?.trim() || '',
        visited: false,
      });

      res.status(201).json({ ok: true, data: created });
    } catch (err: any) {
      console.error('[API] Error creating place:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Toggle visited flag (true <-> false)
  app.patch('/api/places/:id/toggle', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { visited } = req.body;
      const updated = await dbService.toggleVisited(id, visited);

      if (!updated) {
        res.status(404).json({ ok: false, error: 'Lugar no encontrado' });
        return;
      }

      res.json({ ok: true, data: updated });
    } catch (err: any) {
      console.error('[API] Error toggling visited:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Update place details (notes, priority, etc.)
  app.put('/api/places/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await dbService.updatePlace(id, req.body);

      if (!updated) {
        res.status(404).json({ ok: false, error: 'Lugar no encontrado' });
        return;
      }

      res.json({ ok: true, data: updated });
    } catch (err: any) {
      console.error('[API] Error updating place:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Delete place
  app.delete('/api/places/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await dbService.deletePlace(id);

      if (!deleted) {
        res.status(404).json({ ok: false, error: 'Lugar no encontrado para eliminar' });
        return;
      }

      res.json({ ok: true, message: 'Lugar eliminado correctamente' });
    } catch (err: any) {
      console.error('[API] Error deleting place:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Reset seed data
  app.post('/api/places/reset-seed', async (_req: Request, res: Response) => {
    try {
      const result = await dbService.resetSeed();
      res.json({
        ok: true,
        message: `Base de datos reiniciada con ${result.count} lugares emblemáticos de Budapest.`,
        count: result.count,
      });
    } catch (err: any) {
      console.error('[API] Error resetting seed:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Export JSON
  app.get('/api/places/export', async (_req: Request, res: Response) => {
    try {
      const places = await dbService.getPlaces();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="budapest-checklist.json"');
      res.json({
        exportDate: new Date().toISOString(),
        total: places.length,
        visitedCount: places.filter((p: any) => p.visited).length,
        places,
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // --- VITE / FRONTEND SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Budapest Checklist running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
