import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { FilterBar } from './components/FilterBar';
import { PlaceItem } from './components/PlaceItem';
import { AddPlaceModal } from './components/AddPlaceModal';
import { ServerModal } from './components/ServerModal';
import { EmptyState } from './components/EmptyState';
import { Place, DbStatus, PlaceCategory, PlacePriority } from './types';
import {
  List,
  MapPin,
  Database,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'visited'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  // Load places and DB status
  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const [placesRes, statusRes] = await Promise.all([
        fetch('/api/places'),
        fetch('/api/status'),
      ]);

      if (placesRes.ok) {
        const placesData = await placesRes.json();
        if (placesData.ok && Array.isArray(placesData.data)) {
          setPlaces(placesData.data);
        }
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.ok) {
          setDbStatus({
            mode: statusData.mode,
            connected: statusData.connected,
            databaseName: statusData.databaseName,
            host: statusData.host,
            count: statusData.count,
            uriConfigured: statusData.uriConfigured,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle visited flag with optimistic UI update
  const handleToggleVisited = async (id: string, current: boolean) => {
    const nextVisited = !current;

    // Optimistic state update
    setPlaces((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              visited: nextVisited,
              visitedAt: nextVisited ? new Date().toISOString() : null,
            }
          : p
      )
    );

    try {
      const res = await fetch(`/api/places/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: nextVisited }),
      });

      if (!res.ok) {
        // Rollback
        setPlaces((prev) =>
          prev.map((p) => (p._id === id ? { ...p, visited: current } : p))
        );
      } else {
        const resData = await res.json();
        if (resData.ok && resData.data) {
          setPlaces((prev) =>
            prev.map((p) => (p._id === id ? { ...p, ...resData.data } : p))
          );
        }
      }
    } catch (err) {
      console.error('Failed to toggle visited:', err);
      setPlaces((prev) =>
        prev.map((p) => (p._id === id ? { ...p, visited: current } : p))
      );
    }
  };

  // Delete place
  const handleDelete = async (id: string) => {
    const previous = places;
    setPlaces((prev) => prev.filter((p) => p._id !== id));

    try {
      const res = await fetch(`/api/places/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setPlaces(previous);
      }
    } catch (err) {
      console.error('Failed to delete place:', err);
      setPlaces(previous);
    }
  };

  // Save personal notes
  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/places/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setPlaces((prev) =>
          prev.map((p) => (p._id === id ? { ...p, notes } : p))
        );
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  // Add new place
  const handleAddPlace = async (data: {
    title: string;
    originalName?: string;
    category: PlaceCategory;
    description: string;
    priority: PlacePriority;
    locationName?: string;
    tip?: string;
  }) => {
    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al crear lugar');
    }

    const created = await res.json();
    if (created.ok && created.data) {
      setPlaces((prev) => [created.data, ...prev]);
    }
  };

  // Reset seed data
  const handleResetSeed = async () => {
    const res = await fetch('/api/places/reset-seed', { method: 'POST' });
    if (!res.ok) {
      throw new Error('No se pudo restablecer la semilla');
    }
    await fetchData();
  };

  // Client-side filtering & search
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Status filter
      if (statusFilter === 'pending' && place.visited) return false;
      if (statusFilter === 'visited' && !place.visited) return false;

      // Category filter
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const inTitle = place.title.toLowerCase().includes(query);
        const inOriginal = place.originalName?.toLowerCase().includes(query) || false;
        const inDesc = place.description?.toLowerCase().includes(query) || false;
        const inTip = place.tip?.toLowerCase().includes(query) || false;
        const inLocation = place.locationName?.toLowerCase().includes(query) || false;

        return inTitle || inOriginal || inDesc || inTip || inLocation;
      }

      return true;
    });
  }, [places, statusFilter, selectedCategory, search]);

  const totalCount = places.length;
  const visitedCount = places.filter((p) => p.visited).length;
  const isFiltered =
    statusFilter !== 'all' || selectedCategory !== 'all' || Boolean(search.trim());

  return (
    <div className="bg-[#f3f4f6] w-full min-h-screen flex items-center justify-center font-sans overflow-x-hidden p-0 sm:p-4 sm:py-6">
      {/* Phone Device Shell container matching High Density Theme */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[740px] sm:max-h-[92vh] bg-white sm:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] sm:rounded-[40px] sm:border-[8px] sm:border-[#1e293b] flex flex-col relative overflow-hidden">
        {/* Top Speaker notch on desktop frame */}
        <div className="hidden sm:flex h-5 w-1/3 bg-[#1e293b] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20 items-end justify-center pb-0.5">
          <div className="w-10 h-0.5 bg-slate-700 rounded-full" />
        </div>

        {/* High Density Header */}
        <Header
          dbStatus={dbStatus}
          totalCount={totalCount}
          visitedCount={visitedCount}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenServerModal={() => setIsServerModalOpen(true)}
        />

        {/* Filter Bar with category pills and search */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Secondary quick summary badge */}
        <StatsCard places={places} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {/* Sticky Section Header */}
          <div className="px-4 sm:px-6 py-2 bg-slate-100/90 backdrop-blur-xs border-y border-slate-200 sticky top-0 z-10 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Lugares ({filteredPlaces.length})
            </span>
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="text-[10px] font-mono font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>SYNC</span>
            </button>
          </div>

          {/* Place Checklist rows */}
          {isLoading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Cargando...</p>
            </div>
          ) : activeTab === 'map' ? (
            /* Quick Budapest Map view with direct links */
            <div className="p-4 space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-xs leading-relaxed">
                <strong className="block font-bold text-sm mb-1 text-emerald-950">
                  Guía Geográfica de Budapest
                </strong>
                El río Danubio divide la capital en dos partes:
                <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                  <li><strong>Buda (Oeste):</strong> Colinas históricas, el Castillo, el Bastión y miradores panorámicos.</li>
                  <li><strong>Pest (Este):</strong> La zona llana y vibrante con el Parlamento, Basílica, Gran Mercado y Ruin Pubs.</li>
                </ul>
              </div>

              <div className="space-y-2">
                {filteredPlaces.map((p) => (
                  <a
                    key={p._id}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      p.googleMapsQuery || `${p.title} Budapest`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                      <p className="text-[10px] text-slate-500">{p.locationName || p.category.toUpperCase()}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      Abrir Mapa
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : filteredPlaces.length > 0 ? (
            <div className="flex flex-col">
              {filteredPlaces.map((place) => (
                <PlaceItem
                  key={place._id}
                  place={place}
                  onToggleVisited={handleToggleVisited}
                  onDelete={handleDelete}
                  onSaveNotes={handleSaveNotes}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              isFiltered={isFiltered}
              onClearFilters={() => {
                setSearch('');
                setStatusFilter('all');
                setSelectedCategory('all');
              }}
              onResetSeed={handleResetSeed}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}
        </main>

        {/* High Density Footer Navigation */}
        <footer className="h-16 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-0.5 transition-all ${
              activeTab === 'list' ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-80'
            }`}
          >
            <List className="w-5 h-5 text-slate-900" />
            <span className="text-[10px] font-bold text-slate-900">LISTA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-0.5 transition-all ${
              activeTab === 'map' ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-80'
            }`}
          >
            <MapPin className="w-5 h-5 text-slate-900" />
            <span className="text-[10px] font-bold text-slate-900">MAPA</span>
          </button>

          <button
            type="button"
            onClick={() => setIsServerModalOpen(true)}
            className="flex flex-col items-center gap-0.5 opacity-40 hover:opacity-90 transition-all"
          >
            <Database className="w-5 h-5 text-slate-900" />
            <span className="text-[10px] font-bold text-slate-900">SEED/BD</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center gap-0.5 opacity-40 hover:opacity-90 transition-all"
          >
            <Plus className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            <span className="text-[10px] font-bold text-slate-900">NUEVO</span>
          </button>
        </footer>
      </div>

      {/* Modals */}
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlace={handleAddPlace}
      />

      <ServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        dbStatus={dbStatus}
        onResetSeed={handleResetSeed}
      />
    </div>
  );
}
