import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { FilterBar } from './components/FilterBar';
import { PlaceItem } from './components/PlaceItem';
import { PlaceCategoryGroup } from './components/PlaceCategoryGroup';
import { MapView } from './components/MapView';
import { AddPlaceModal } from './components/AddPlaceModal';
import { ServerModal } from './components/ServerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { TripRecapModal } from './components/TripRecapModal';
import { CheckpointModal } from './components/CheckpointModal';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { EditPlaceModal } from './components/EditPlaceModal';
import { SplashScreen } from './components/SplashScreen';
import { EmptyState } from './components/EmptyState';
import {
  Place,
  DbStatus,
  PlaceCategory,
  PlacePriority,
  SortOption,
} from './types';
import {
  List,
  MapPin,
  Database,
  Plus,
  RefreshCw,
  ChevronsUpDown,
  ChevronsDownUp,
  FolderTree,
  Camera,
  Lock,
  Sparkles,
} from 'lucide-react';

const CATEGORY_SECTIONS: { id: PlaceCategory; label: string; icon: string }[] = [
  { id: 'buda', label: 'Buda (Castillo & Colinas)', icon: '🏰' },
  { id: 'pest', label: 'Pest (Centro & Danubio)', icon: '🏛️' },
  { id: 'termas', label: 'Termas & Balnearios', icon: '♨️' },
  { id: 'ruin-bars', label: 'Ruin Bars & Vida Nocturna', icon: '🍻' },
  { id: 'cultura', label: 'Cultura & Monumentos', icon: '🎭' },
  { id: 'miradores', label: 'Miradores Panorámicos', icon: '🌄' },
];

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  // Collapsible main sections state (persisted in localStorage)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('budapest_header_collapsed') === 'true';
  });
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('budapest_filters_collapsed') === 'true';
  });
  const [isStatsCollapsed, setIsStatsCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem('budapest_stats_collapsed');
    return stored !== null ? stored === 'true' : true;
  });

  // Group by category with collapsible sections in list view
  const [groupByCategory, setGroupByCategory] = useState<boolean>(() => {
    const stored = localStorage.getItem('budapest_group_by_category');
    return stored !== null ? stored === 'true' : true;
  });

  // Collapsed state for individual category sections
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('budapest_collapsed_categories');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleHeaderCollapse = () => {
    setIsHeaderCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('budapest_header_collapsed', String(next));
      return next;
    });
  };

  const toggleFiltersCollapse = () => {
    setIsFiltersCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('budapest_filters_collapsed', String(next));
      return next;
    });
  };

  const toggleStatsCollapse = () => {
    setIsStatsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('budapest_stats_collapsed', String(next));
      return next;
    });
  };

  const toggleGroupByCategory = () => {
    setGroupByCategory((prev) => {
      const next = !prev;
      localStorage.setItem('budapest_group_by_category', String(next));
      return next;
    });
  };

  const toggleCategoryCollapse = (cat: PlaceCategory) => {
    setCollapsedCategories((prev) => {
      const next = { ...prev, [cat]: !prev[cat] };
      localStorage.setItem('budapest_collapsed_categories', JSON.stringify(next));
      return next;
    });
  };

  const handleExpandAllCategories = () => {
    setCollapsedCategories({});
    localStorage.setItem('budapest_collapsed_categories', JSON.stringify({}));
  };

  const handleCollapseAllCategories = () => {
    const allCollapsed: Record<string, boolean> = {};
    CATEGORY_SECTIONS.forEach((c) => {
      allCollapsed[c.id] = true;
    });
    setCollapsedCategories(allCollapsed);
    localStorage.setItem('budapest_collapsed_categories', JSON.stringify(allCollapsed));
  };

  // Dark mode state with persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('budapest_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('budapest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('budapest_theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'visited'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PlacePriority>('all');
  const [sortBy, setSortBy] = useState<SortOption>('priority');

  // Modals & Admin state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isTripRecapModalOpen, setIsTripRecapModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('budapest_is_admin') === 'true';
  });
  const [isRecapGenerated, setIsRecapGenerated] = useState<boolean>(() => {
    return localStorage.getItem('budapest_recap_generated') === 'true';
  });

  // Animated Splash Screen for Budapest (Sany & Rubén) - lasts 3 seconds on app start
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Checkpoint & Photo exchange state
  const [checkpointPlace, setCheckpointPlace] = useState<Place | null>(null);
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [isExchangingPhoto, setIsExchangingPhoto] = useState(false);

  // Tourist Site Detail Modal state
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Admin Place Edit Modal state
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditPlace = (place: Place) => {
    setEditingPlace(place);
    setIsEditModalOpen(true);
  };

  const handleOpenDetails = (place: Place) => {
    setDetailPlace(place);
    setIsDetailModalOpen(true);
  };

  const handleOpenCheckpointModal = (place: Place, isExchanging: boolean) => {
    setCheckpointPlace(place);
    setIsExchangingPhoto(isExchanging);
    setIsCheckpointModalOpen(true);
  };

  const handleConfirmCheckpointPhoto = async (placeId: string, photoDataUrl: string) => {
    const res = await fetch(`/api/places/${placeId}/photo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo: photoDataUrl }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al guardar la foto');
    }

    const resData = await res.json();
    if (resData.ok && resData.data) {
      setPlaces((prev) =>
        prev.map((p) => (p._id === placeId ? { ...p, ...resData.data } : p))
      );
    }
  };

  // Load places, DB status and trip status
  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const [placesRes, statusRes, tripRes] = await Promise.all([
        fetch('/api/places'),
        fetch('/api/status'),
        fetch('/api/trip/status'),
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

      if (tripRes.ok) {
        const tripData = await tripRes.json();
        if (tripData.ok && tripData.data) {
          const generated = Boolean(tripData.data.recapGenerated);
          setIsRecapGenerated(generated);
          localStorage.setItem('budapest_recap_generated', String(generated));
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

  // Toggle visited flag with optimistic UI update and mandatory photo check
  const handleToggleVisited = async (id: string, current: boolean) => {
    const targetPlace = places.find((p) => p._id === id);
    if (!targetPlace) return;

    if (!current) {
      // User is attempting to mark as visited: check if it already has a photo
      const hasPhoto = Array.isArray(targetPlace.photos) && targetPlace.photos.length > 0;
      if (!hasPhoto) {
        // Automatically open the camera / photo modal!
        handleOpenCheckpointModal(targetPlace, false);
        return;
      }
    }

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
    setDetailPlace((prev) =>
      prev && prev._id === id
        ? {
            ...prev,
            visited: nextVisited,
            visitedAt: nextVisited ? new Date().toISOString() : null,
          }
        : prev
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
    if (detailPlace && detailPlace._id === id) {
      setIsDetailModalOpen(false);
      setDetailPlace(null);
    }
    if (editingPlace && editingPlace._id === id) {
      setIsEditModalOpen(false);
      setEditingPlace(null);
    }

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

  // Modify / Update place (Admin)
  const handleUpdatePlace = async (id: string, updatedData: Partial<Place>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/places/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar');
      }

      const resData = await res.json();
      if (resData.ok && resData.data) {
        setPlaces((prev) =>
          prev.map((p) => (p._id === id ? { ...p, ...resData.data } : p))
        );
        setDetailPlace((prev) =>
          prev && prev._id === id ? { ...prev, ...resData.data } : prev
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update place:', err);
      return false;
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
        setDetailPlace((prev) =>
          prev && prev._id === id ? { ...prev, notes } : prev
        );
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  // Upload photos to a place
  const handleUploadPhotos = async (id: string, photos: string[]) => {
    try {
      const res = await fetch(`/api/places/${id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.data) {
          setPlaces((prev) =>
            prev.map((p) => (p._id === id ? { ...p, photos: data.data.photos } : p))
          );
        }
      }
    } catch (err) {
      console.error('Failed to upload photos:', err);
    }
  };

  // Delete a photo from a place
  const handleDeletePhoto = async (id: string, photoIndex: number) => {
    try {
      const res = await fetch(`/api/places/${id}/photos/${photoIndex}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.data) {
          setPlaces((prev) =>
            prev.map((p) => (p._id === id ? { ...p, photos: data.data.photos } : p))
          );
        }
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  // Admin login handler
  const handleAdminLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setIsAdmin(true);
        localStorage.setItem('budapest_is_admin', 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error during admin login:', err);
      return false;
    }
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('budapest_is_admin');
  };

  // Generate Trip Recap & unlock collage for users
  const handleGenerateRecap = async () => {
    try {
      const res = await fetch('/api/trip/recap/generate', { method: 'POST' });
      if (res.ok) {
        setIsRecapGenerated(true);
        localStorage.setItem('budapest_recap_generated', 'true');
        setIsTripRecapModalOpen(true);
      }
    } catch (err) {
      console.error('Error generating recap:', err);
      setIsRecapGenerated(true);
      localStorage.setItem('budapest_recap_generated', 'true');
      setIsTripRecapModalOpen(true);
    }
  };

  // Reset Trip Recap to "in progress"
  const handleResetRecap = async () => {
    try {
      await fetch('/api/trip/recap/reset', { method: 'POST' });
    } catch (err) {
      console.error('Error resetting recap:', err);
    }
    setIsRecapGenerated(false);
    localStorage.setItem('budapest_recap_generated', 'false');
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
    website?: string;
    phone?: string;
    price?: string;
    openingHours?: string;
    metroOrTransit?: string;
    imageUrl?: string;
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

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSelectedCategory('all');
    setPriorityFilter('all');
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of places) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [places]);

  // Client-side filtering, search & sorting
  const filteredPlaces = useMemo(() => {
    const list = places.filter((place) => {
      // Status filter
      if (statusFilter === 'pending' && place.visited) return false;
      if (statusFilter === 'visited' && !place.visited) return false;

      // Category filter
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && place.priority !== priorityFilter) {
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

    // Sorting criteria
    return list.sort((a, b) => {
      if (sortBy === 'recent') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return b._id.localeCompare(a._id);
      }

      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
      }

      if (sortBy === 'priority') {
        const priorityOrder: Record<PlacePriority, number> = {
          imprescindible: 1,
          recomendado: 2,
          opcional: 3,
        };
        const rankA = priorityOrder[a.priority] ?? 99;
        const rankB = priorityOrder[b.priority] ?? 99;
        if (rankA !== rankB) return rankA - rankB;
        return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
      }

      return 0;
    });
  }, [places, statusFilter, selectedCategory, priorityFilter, search, sortBy]);

  // Group places by category for categorized collapsible sections
  const groupedPlaces = useMemo(() => {
    const groups: {
      category: PlaceCategory;
      label: string;
      icon: string;
      places: Place[];
    }[] = [];

    for (const cat of CATEGORY_SECTIONS) {
      const matching = filteredPlaces.filter((p) => p.category === cat.id);
      if (matching.length > 0) {
        groups.push({
          category: cat.id,
          label: cat.label,
          icon: cat.icon,
          places: matching,
        });
      }
    }

    // Catch any remaining places
    const knownCats = new Set(CATEGORY_SECTIONS.map((c) => c.id));
    const others = filteredPlaces.filter((p) => !knownCats.has(p.category));
    if (others.length > 0) {
      groups.push({
        category: 'cultura' as PlaceCategory,
        label: 'Otros Lugares',
        icon: '📍',
        places: others,
      });
    }

    return groups;
  }, [filteredPlaces]);

  const totalCount = places.length;
  const visitedCount = places.filter((p) => p.visited).length;
  const totalPhotosCount = useMemo(() => {
    return places.reduce((acc, p) => acc + (Array.isArray(p.photos) ? p.photos.length : 0), 0);
  }, [places]);
  const isFiltered =
    statusFilter !== 'all' ||
    selectedCategory !== 'all' ||
    priorityFilter !== 'all' ||
    Boolean(search.trim());

  return (
    <div className="bg-slate-100 dark:bg-slate-950 w-full min-h-[100dvh] flex items-center justify-center font-sans antialiased overflow-x-hidden p-0 sm:p-4 sm:py-6 transition-colors">
      {/* 3-Second Romantic Animated Splash Screen */}
      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
          durationMs={3000}
        />
      )}

      {/* Modern Responsive App Canvas */}
      <div className="w-full max-w-xl md:max-w-2xl min-h-[100dvh] sm:min-h-0 sm:h-[880px] sm:max-h-[94vh] bg-white dark:bg-slate-900 sm:shadow-2xl sm:rounded-3xl sm:border sm:border-slate-200/80 dark:sm:border-slate-800 flex flex-col relative overflow-hidden transition-colors">

        {/* High Density Header - Collapsible */}
        <Header
          dbStatus={dbStatus}
          totalCount={totalCount}
          visitedCount={visitedCount}
          photosCount={totalPhotosCount}
          isDark={isDark}
          onToggleDark={toggleDark}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenServerModal={() => setIsServerModalOpen(true)}
          isCollapsed={isHeaderCollapsed}
          onToggleCollapse={toggleHeaderCollapse}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
          onOpenTripRecap={() => setIsTripRecapModalOpen(true)}
          isRecapGenerated={isRecapGenerated}
          onReplayIntro={() => setShowSplash(true)}
        />

        {/* Filter Bar with category pills, search, priority and sorting - Collapsible */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
          filteredCount={filteredPlaces.length}
          totalCount={totalCount}
          categoryCounts={categoryCounts}
          isCollapsed={isFiltersCollapsed}
          onToggleCollapse={toggleFiltersCollapse}
        />

        {/* Secondary quick summary badge - Collapsible */}
        <StatsCard
          places={places}
          isCollapsed={isStatsCollapsed}
          onToggleCollapse={toggleStatsCollapse}
        />

        {/* Main Content Area: Scrollable view port */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/60 pb-3 transition-colors">
          {/* Celebratory Banner when Recap has been generated by admin */}
          {isRecapGenerated && (
            <div className="mx-3.5 sm:mx-6 mt-3 mb-2 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md flex items-center justify-between gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide truncate">
                    🎉 ¡Fin de Viaje • Collage Desbloqueado!
                  </p>
                  <p className="text-[11px] text-slate-900 font-medium truncate">
                    El recap fotográfico ya está disponible para ver todas las fotos una a una.
                  </p>
                </div>
              </div>
              <button
                id="open-unlocked-recap-banner-btn"
                type="button"
                onClick={() => setIsTripRecapModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Ver Álbum</span>
                <span className="xs:hidden">Ver</span>
              </button>
            </div>
          )}

          {/* Sticky Section Header */}
          <div className="px-4 sm:px-6 py-2 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-xs border-y border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                {activeTab === 'map' ? 'Vista en Mapa' : 'Lugares'} ({filteredPlaces.length})
              </span>
              {activeTab === 'list' && filteredPlaces.length > 0 && (
                <button
                  id="toggle-group-mode-btn"
                  type="button"
                  onClick={toggleGroupByCategory}
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
                  title={groupByCategory ? 'Cambiar a lista continua' : 'Agrupar por categorías'}
                >
                  <FolderTree className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{groupByCategory ? 'ZONAS' : 'LISTA'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'list' && groupByCategory && filteredPlaces.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <button
                    id="collapse-all-categories-btn"
                    type="button"
                    onClick={handleCollapseAllCategories}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    title="Colapsar todas las categorías"
                  >
                    Colapsar
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <button
                    id="expand-all-categories-btn"
                    type="button"
                    onClick={handleExpandAllCategories}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    title="Expandir todas las categorías"
                  >
                    Expandir
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                title="Refrescar datos"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>SYNC</span>
              </button>
            </div>
          </div>

          {/* Place Checklist rows or Interactive Map */}
          {isLoading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Cargando puntos...</p>
            </div>
          ) : activeTab === 'map' ? (
            <MapView
              places={filteredPlaces}
              allPlaces={places}
              onToggleVisited={handleToggleVisited}
              onOpenDetails={handleOpenDetails}
            />
          ) : filteredPlaces.length > 0 ? (
            groupByCategory ? (
              <div className="flex flex-col">
                {groupedPlaces.map((group) => (
                  <PlaceCategoryGroup
                    key={group.category}
                    category={group.category}
                    categoryLabel={group.label}
                    categoryIcon={group.icon}
                    places={group.places}
                    isCollapsed={Boolean(collapsedCategories[group.category])}
                    onToggleCollapse={toggleCategoryCollapse}
                    onToggleVisited={handleToggleVisited}
                    onDelete={handleDelete}
                    onSaveNotes={handleSaveNotes}
                    onUploadPhotos={handleUploadPhotos}
                    onDeletePhoto={handleDeletePhoto}
                    isAdmin={isAdmin}
                    onEdit={handleOpenEditPlace}
                    onOpenCheckpointModal={handleOpenCheckpointModal}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredPlaces.map((place) => (
                  <PlaceItem
                    key={place._id}
                    place={place}
                    onToggleVisited={handleToggleVisited}
                    onDelete={handleDelete}
                    onSaveNotes={handleSaveNotes}
                    onUploadPhotos={handleUploadPhotos}
                    onDeletePhoto={handleDeletePhoto}
                    isAdmin={isAdmin}
                    onEdit={handleOpenEditPlace}
                    onOpenCheckpointModal={handleOpenCheckpointModal}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyState
              isFiltered={isFiltered}
              onClearFilters={handleResetFilters}
              onResetSeed={handleResetSeed}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {/* Discreet footer for regular visitors with subtle admin access */}
          <div className="mt-8 py-6 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-1.5 pb-20">
            <p className="font-semibold text-slate-600 dark:text-slate-400">
              Budapest Travel Checklist • 2026
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-600">
              <span>Guía para explorar Buda y Pest</span>
              {!isAdmin && (
                <button
                  id="discreet-admin-login-btn"
                  type="button"
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="text-slate-300 dark:text-slate-700 hover:text-slate-500 dark:hover:text-slate-400 transition-colors p-1"
                  title="Acceso restringido"
                >
                  <Lock className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Fixed Mobile-Native Bottom Navigation Bar */}
        <footer className="h-16 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-around select-none shadow-lg z-30 pb-[max(0.25rem,env(safe-area-inset-bottom))] transition-colors">
          {/* LISTA Tab */}
          <button
            id="nav-tab-list"
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'list'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold mt-0.5">LISTA</span>
          </button>

          {/* MAPA Tab with count pill */}
          <button
            id="nav-tab-map"
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all relative ${
              activeTab === 'map'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold mt-0.5">MAPA</span>
            {filteredPlaces.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {filteredPlaces.length}
              </span>
            )}
          </button>

          {/* ÁLBUM / RECAP Tab */}
          <button
            id="nav-tab-recap"
            type="button"
            onClick={() => setIsTripRecapModalOpen(true)}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all active:scale-95"
            title="Ver Álbum de Fotos & Recap del Viaje"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold mt-0.5">ÁLBUM</span>
          </button>

          {/* SEED/BD Config Tab - ONLY FOR ADMIN (hidden from normal users) */}
          {isAdmin && (
            <button
              id="nav-tab-db"
              type="button"
              onClick={() => setIsServerModalOpen(true)}
              className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all active:scale-95"
              title="Ajustes de Servidor & Base de datos (Solo Desarrollador)"
            >
              <Database className="w-5 h-5" />
              <span className="text-[10px] font-mono font-bold mt-0.5">SERVER</span>
            </button>
          )}

          {/* NUEVO Place Action */}
          <button
            id="nav-tab-add"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] font-mono font-bold mt-0.5">NUEVO</span>
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

      {/* Admin Login & Developer Actions Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        isAdmin={isAdmin}
        dbStatus={dbStatus}
        isRecapGenerated={isRecapGenerated}
        photosCount={totalPhotosCount}
        visitedCount={visitedCount}
        totalCount={totalCount}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        onOpenTripRecap={() => setIsTripRecapModalOpen(true)}
        onGenerateRecap={handleGenerateRecap}
        onResetRecap={handleResetRecap}
      />

      {/* Trip Memories Album & Final Recap Modal */}
      <TripRecapModal
        isOpen={isTripRecapModalOpen}
        onClose={() => setIsTripRecapModalOpen(false)}
        places={places}
        isAdmin={isAdmin}
        isRecapGenerated={isRecapGenerated}
        onOpenCheckpointModal={handleOpenCheckpointModal}
      />

      {/* Checkpoint Mandatory Photo & Exchange Modal */}
      <CheckpointModal
        isOpen={isCheckpointModalOpen}
        place={checkpointPlace}
        isExchanging={isExchangingPhoto}
        onClose={() => setIsCheckpointModalOpen(false)}
        onConfirmPhoto={handleConfirmCheckpointPhoto}
      />

      {/* Place Detail & Technical Specs Modal */}
      <PlaceDetailModal
        isOpen={isDetailModalOpen}
        place={detailPlace}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailPlace(null);
        }}
        onToggleVisited={async (id, current) => {
          await handleToggleVisited(id, current);
        }}
        onSaveNotes={async (id, notes) => {
          await handleSaveNotes(id, notes);
        }}
        onOpenCheckpointPhoto={(p) => {
          handleOpenCheckpointModal(p, false);
        }}
        isAdmin={isAdmin}
        onEdit={handleOpenEditPlace}
        onDelete={handleDelete}
      />

      {/* Admin Place Edit & Delete Modal */}
      <EditPlaceModal
        isOpen={isEditModalOpen}
        place={editingPlace}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPlace(null);
        }}
        onSave={handleUpdatePlace}
        onDelete={handleDelete}
      />
    </div>
  );
}
