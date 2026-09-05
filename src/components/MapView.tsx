import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ExternalLink,
  Check,
  Compass,
  Star,
  Clock,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Place } from '../types';

interface MapViewProps {
  places: Place[];
  allPlaces: Place[];
  onToggleVisited: (id: string, current: boolean) => void;
  onOpenInMaps?: (query: string) => void;
}

// Geographic mapping for Budapest landmarks (normalized 0-100 coordinates for the SVG canvas)
// X: 0 (West/Buda hills) to 100 (East/Pest City Park)
// Y: 0 (North/Margaret Island) to 100 (South/Gellért & Market)
interface LandmarkCoord {
  x: number; // percentage width
  y: number; // percentage height
  side: 'buda' | 'pest' | 'river';
  area: string;
  image: string;
}

const LANDMARK_DATA: Record<string, LandmarkCoord> = {
  // 1. Money Exchange
  'Money Exchange': {
    x: 55,
    y: 54,
    side: 'pest',
    area: 'Pest - Deák Ferenc tér / Váci utca',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&auto=format&fit=crop&q=80',
  },
  // 2. Souvenir and Coffee
  'Souvenir and Coffee / Department of Travel': {
    x: 57,
    y: 51,
    side: 'pest',
    area: 'Pest - Centro Histórico',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
  },
  // 3. Dob u. 74
  'Dob u. 74': {
    x: 69,
    y: 47,
    side: 'pest',
    area: 'Pest - Barrio Judío (Erzsébetváros)',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  },
  // 4. Comida callejera Karaván
  'Comida callejera Karaván': {
    x: 67,
    y: 53,
    side: 'pest',
    area: 'Pest - Kazinczy Street Food',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  },
  // 5. Gran Sinagoga de Budapest
  'Gran Sinagoga de Budapest': {
    x: 63,
    y: 57,
    side: 'pest',
    area: 'Pest - Dohány utca',
    image: 'https://images.unsplash.com/photo-1548625361-195fe57876a3?w=600&auto=format&fit=crop&q=80',
  },
  // 6. Instant-Fogas Complex
  'Instant-Fogas Complex': {
    x: 69,
    y: 49,
    side: 'pest',
    area: 'Pest - Akácfa utca (Ruin Clubs)',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  },
  // 7. The Magic Budapest
  'The Magic Budapest': {
    x: 60,
    y: 42,
    side: 'pest',
    area: 'Pest - Hajós utca (Ópera)',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
  },
  // 8. Aeropuerto de Budapest-Ferenc Liszt
  'Aeropuerto de Budapest-Ferenc Liszt': {
    x: 95,
    y: 88,
    side: 'pest',
    area: 'Budapest Sureste - Terminal BUD',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80',
  },
  // 9. Moon Budapest
  'Moon Budapest': {
    x: 66,
    y: 52,
    side: 'pest',
    area: 'Pest - Gozsdu Udvar',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=80',
  },
  // 10. Monumento al príncipe de Buda y la princesa de Pest
  'Monumento al príncipe de Buda y la princesa de Pest': {
    x: 31,
    y: 64,
    side: 'buda',
    area: 'Buda - Jardín de los Filósofos',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
  },
  // 11. Bares en ruina Budapest
  'Bares en ruina Budapest': {
    x: 68,
    y: 52,
    side: 'pest',
    area: 'Pest - Barrio Judío (Szimpla Kert)',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
  },
  // 12. Casa del Terror
  'Casa del Terror': {
    x: 68,
    y: 35,
    side: 'pest',
    area: 'Pest - Avenida Andrássy 60',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
  },
  // 13. Colina Gellért
  'Colina Gellért': {
    x: 35,
    y: 69,
    side: 'buda',
    area: 'Buda - Mirador Panorámico',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
  },
  // 14. McDonald's Nyugati
  "McDonald's Nyugati": {
    x: 62,
    y: 30,
    side: 'pest',
    area: 'Pest - Estación Nyugati (Eiffel)',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
  },
  // 15. Pop&Roll Art Toilet
  'Pop&Roll Art Toilet': {
    x: 54,
    y: 58,
    side: 'pest',
    area: 'Pest - Váci utca Peatonal',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
  },
  // 16. Museo de Aquincum
  'Museo de Aquincum': {
    x: 22,
    y: 10,
    side: 'buda',
    area: 'Óbuda - Parque Arqueológico Romano',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
  },
  // 17. Barco Cultural A38
  'Barco Cultural A38': {
    x: 46,
    y: 84,
    side: 'river',
    area: 'Danubio - Puente Petőfi',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  },
  // 18. Smashy Burger Budapest
  'Smashy Burger Budapest': {
    x: 65,
    y: 55,
    side: 'pest',
    area: 'Pest - Madách Imre út',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  },
  // 19. Puente de las Cadenas
  'Puente de las Cadenas': {
    x: 42,
    y: 47,
    side: 'river',
    area: 'Danubio - Conexión Buda/Pest',
    image: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?w=600&auto=format&fit=crop&q=80',
  },
  // 20. Iguana Bar and Grill
  'Iguana Bar and Grill': {
    x: 51,
    y: 40,
    side: 'pest',
    area: 'Pest - Cerca del Parlamento (Zoltán u.)',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
  },
  // 21. Plaza de la Libertad
  'Plaza de la Libertad': {
    x: 53,
    y: 41,
    side: 'pest',
    area: 'Pest - Szabadság tér',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  },
  // 22. Centro Comercial Westend
  'Centro Comercial Westend': {
    x: 64,
    y: 28,
    side: 'pest',
    area: 'Pest - Váci út / Nyugati',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&auto=format&fit=crop&q=80',
  },
  // 23. Jardín Japonés (Isla Margarita)
  'Jardín Japonés (Isla Margarita)': {
    x: 40,
    y: 10,
    side: 'river',
    area: 'Isla Margarita Norte',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
  },
  // 24. Mercado Central de Budapest
  'Mercado Central de Budapest': {
    x: 58,
    y: 72,
    side: 'pest',
    area: 'Pest - Fővám tér',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&auto=format&fit=crop&q=80',
  },
  // 25. Basílica de San Esteban
  'Basílica de San Esteban': {
    x: 58,
    y: 44,
    side: 'pest',
    area: 'Pest - Centro Histórico',
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&auto=format&fit=crop&q=80',
  },
  // 26. La Ciudadela
  'La Ciudadela': {
    x: 37,
    y: 71,
    side: 'buda',
    area: 'Buda - Cima Colina Gellért',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
  },
  // 27. Galería Nacional Húngara
  'Galería Nacional Húngara': {
    x: 34,
    y: 49,
    side: 'buda',
    area: 'Buda - Palacio Real',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80',
  },
  // 28. Bastión de los Pescadores
  'Bastión de los Pescadores': {
    x: 32,
    y: 40,
    side: 'buda',
    area: 'Buda - Colina del Castillo',
    image: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=600&auto=format&fit=crop&q=80',
  },
  // 29. Centro Comercial Mammut
  'Centro Comercial Mammut': {
    x: 23,
    y: 35,
    side: 'buda',
    area: 'Buda - Széll Kálmán tér',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&auto=format&fit=crop&q=80',
  },
  // 30. Reserva Natural Ördög-orom
  'Reserva Natural Ördög-orom': {
    x: 10,
    y: 78,
    side: 'buda',
    area: 'Buda Suroeste - Espacio Natural',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
  },
  // 31. Castillo de Vajdahunyad
  'Castillo de Vajdahunyad': {
    x: 82,
    y: 22,
    side: 'pest',
    area: 'Pest - Parque Városliget',
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=600&auto=format&fit=crop&q=80',
  },
  // 32. Teatro de Opereta de Budapest
  'Teatro de Opereta de Budapest': {
    x: 63,
    y: 43,
    side: 'pest',
    area: 'Pest - Nagymező utca (Broadway)',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80',
  },
  // 33. Ópera Nacional de Hungría
  'Ópera Nacional de Hungría': {
    x: 62,
    y: 41,
    side: 'pest',
    area: 'Pest - Avenida Andrássy',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  },
  // 34. Zapatos en la Orilla del Danubio
  'Zapatos en la Orilla del Danubio': {
    x: 47,
    y: 40,
    side: 'pest',
    area: 'Pest - Ribera del Danubio',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
  },
  // 35. Monumento del Milenio (Plaza de los Héroes)
  'Monumento del Milenio (Plaza de los Héroes)': {
    x: 78,
    y: 25,
    side: 'pest',
    area: 'Pest - Hősök tere',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
  },
  // 36. Parlamento de Budapest
  'Parlamento de Budapest': {
    x: 48,
    y: 36,
    side: 'pest',
    area: 'Pest - Orilla del Danubio',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&auto=format&fit=crop&q=80',
  },
  // 37. Casa de las Mariposas
  'Casa de las Mariposas': {
    x: 80,
    y: 19,
    side: 'pest',
    area: 'Pest - Zoo Városliget',
    image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=600&auto=format&fit=crop&q=80',
  },
  // 38. Tropicarium-Oceanarium Kft.
  'Tropicarium-Oceanarium Kft.': {
    x: 25,
    y: 92,
    side: 'buda',
    area: 'Buda Sur - C.C. Campona',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
  },
  // 39. Zoológico y Jardín Botánico de Budapest
  'Zoológico y Jardín Botánico de Budapest': {
    x: 81,
    y: 18,
    side: 'pest',
    area: 'Pest - Parque Városliget',
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop&q=80',
  },
  // 40. Mirage Medic Hotel
  'Mirage Medic Hotel': {
    x: 77,
    y: 27,
    side: 'pest',
    area: 'Pest - Dózsa György út (Plaza de los Héroes)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
  },
};

// Fallback resolver for custom added places based on category/text
function getPlaceCoordinate(place: Place, index: number, total: number): LandmarkCoord {
  if (LANDMARK_DATA[place.title]) {
    return LANDMARK_DATA[place.title];
  }
  // Try partial match
  const matchedKey = Object.keys(LANDMARK_DATA).find((k) =>
    place.title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(place.title.toLowerCase())
  );
  if (matchedKey) {
    return LANDMARK_DATA[matchedKey];
  }

  // Fallback distribution by category
  const isBuda = place.category === 'buda' || (place.locationName && place.locationName.toLowerCase().includes('buda'));
  const x = isBuda ? 25 + (index % 3) * 6 : 60 + (index % 4) * 6;
  const y = 30 + ((index * 9) % 45);

  return {
    x,
    y,
    side: isBuda ? 'buda' : 'pest',
    area: place.locationName || (isBuda ? 'Buda (Oeste)' : 'Pest (Este)'),
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&auto=format&fit=crop&q=80',
  };
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  allPlaces,
  onToggleVisited,
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return places.length > 0 ? places[0]._id : '';
  });
  const [sideFilter, setSideFilter] = useState<'all' | 'buda' | 'pest'>('all');

  // Keep selected place valid when places change
  const selectedPlace = useMemo(() => {
    const found = places.find((p) => p._id === selectedId);
    return found || places[0] || null;
  }, [places, selectedId]);

  // Compute coordinate data for places
  const placesWithCoords = useMemo(() => {
    return places.map((place, idx) => ({
      place,
      coord: getPlaceCoordinate(place, idx, places.length),
    }));
  }, [places]);

  // Filtered by side tab on map if desired
  const visiblePlaces = useMemo(() => {
    if (sideFilter === 'all') return placesWithCoords;
    return placesWithCoords.filter((item) => {
      if (sideFilter === 'buda') return item.coord.side === 'buda';
      if (sideFilter === 'pest') return item.coord.side === 'pest';
      return true;
    });
  }, [placesWithCoords, sideFilter]);

  const selectedCoord = selectedPlace
    ? getPlaceCoordinate(selectedPlace, 0, 1)
    : null;

  // Next / previous navigation
  const currentIndex = places.findIndex((p) => p._id === selectedPlace?._id);
  const handlePrev = () => {
    if (places.length === 0) return;
    const prevIdx = (currentIndex - 1 + places.length) % places.length;
    setSelectedId(places[prevIdx]._id);
  };
  const handleNext = () => {
    if (places.length === 0) return;
    const nextIdx = (currentIndex + 1) % places.length;
    setSelectedId(places[nextIdx]._id);
  };

  const mapsQuery = selectedPlace?.googleMapsQuery || `${selectedPlace?.title || ''} Budapest`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  return (
    <div className="flex flex-col space-y-3 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-950/40">
      {/* Top Map Toolbar */}
      <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block leading-none">
              Mapa de Budapest
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {visiblePlaces.length} de {allPlaces.length} sitios visibles
            </span>
          </div>
        </div>

        {/* Side filter pills: Buda / Danubio / Pest */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-mono font-bold">
          <button
            type="button"
            onClick={() => setSideFilter('all')}
            className={`px-2 py-1 rounded-lg transition-all ${
              sideFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            TODO
          </button>
          <button
            type="button"
            onClick={() => setSideFilter('buda')}
            className={`px-2 py-1 rounded-lg transition-all ${
              sideFilter === 'buda'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            BUDA
          </button>
          <button
            type="button"
            onClick={() => setSideFilter('pest')}
            className={`px-2 py-1 rounded-lg transition-all ${
              sideFilter === 'pest'
                ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            PEST
          </button>
        </div>
      </div>

      {/* Horizontal Carousel of place chips for instant map preview selection */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {places.map((p) => {
          const isSelected = p._id === selectedPlace?._id;
          return (
            <button
              key={p._id}
              type="button"
              onClick={() => setSelectedId(p._id)}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  p.visited ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
              <span className="truncate max-w-[120px]">{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Vector Map Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-slate-900 dark:bg-[#090d16] rounded-3xl border border-slate-800 overflow-hidden shadow-inner select-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Danube river linear gradient */}
            <linearGradient id="danubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.85" />
            </linearGradient>

            {/* Buda hills pattern / gradient */}
            <linearGradient id="budaHills" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
            </linearGradient>

            {/* Pest urban grid pattern */}
            <pattern id="urbanGrid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#334155" strokeWidth="0.25" strokeOpacity="0.3" />
            </pattern>
          </defs>

          {/* Buda side background (West) */}
          <rect x="0" y="0" width="45" height="100" fill="url(#budaHills)" />
          {/* Buda topography curves */}
          <path
            d="M 5,20 Q 20,10 35,30 T 25,65 T 5,90 Z"
            fill="#334155"
            fillOpacity="0.2"
          />
          <path
            d="M 12,35 Q 26,45 32,58 T 15,80 Z"
            fill="#334155"
            fillOpacity="0.3"
          />

          {/* Pest side background (East) */}
          <rect x="45" y="0" width="55" height="100" fill="#0b1324" />
          <rect x="45" y="0" width="55" height="100" fill="url(#urbanGrid)" />

          {/* Városliget (City Park) green zone */}
          <ellipse cx="80" cy="22" rx="12" ry="10" fill="#065f46" fillOpacity="0.35" stroke="#10b981" strokeWidth="0.3" strokeDasharray="1 1" />
          <text x="80" y="23" fill="#6ee7b7" fontSize="2" textAnchor="middle" opacity="0.7" fontFamily="monospace">VÁROSLIGET</text>

          {/* Danube River Path (Duna) */}
          <path
            d="M 44,0 
               C 42,10 40,20 42,28 
               C 44,35 46,45 44,55 
               C 42,65 44,78 48,90 
               C 50,96 52,100 52,100
               L 44,100
               C 44,100 40,94 38,84
               C 34,70 34,58 37,48
               C 39,40 37,30 35,22
               C 33,14 36,0 36,0 Z"
            fill="url(#danubeGrad)"
          />

          {/* Margaret Island (Margit-sziget) */}
          <ellipse
            cx="40"
            cy="15"
            rx="2.2"
            ry="7.5"
            fill="#15803d"
            stroke="#4ade80"
            strokeWidth="0.4"
          />
          <text x="40" y="16" fill="#bbf7d0" fontSize="1.6" textAnchor="middle" opacity="0.9" fontWeight="bold">Margit</text>

          {/* Iconic Bridges */}
          {/* Margaret Bridge */}
          <line x1="36" y1="22" x2="44" y2="24" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="0.6 0.3" />
          {/* Chain Bridge (Széchenyi Lánchíd) */}
          <line x1="36" y1="47" x2="45" y2="47" stroke="#fbbf24" strokeWidth="1" />
          {/* Elisabeth Bridge (Erzsébet híd) */}
          <line x1="36" y1="62" x2="45" y2="60" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Liberty Bridge (Szabadság híd) */}
          <line x1="38" y1="72" x2="47" y2="70" stroke="#34d399" strokeWidth="0.8" />

          {/* River Label */}
          <text
            x="44"
            y="85"
            fill="#38bdf8"
            fontSize="2.4"
            opacity="0.6"
            fontFamily="monospace"
            letterSpacing="0.4"
            transform="rotate(78, 44, 85)"
          >
            DUNA (DANUBIO)
          </text>

          {/* Buda Label */}
          <text x="14" y="12" fill="#94a3b8" fontSize="3.5" fontWeight="bold" opacity="0.4" letterSpacing="0.3">
            BUDA (OESTE)
          </text>
          <text x="14" y="16" fill="#64748b" fontSize="1.8" opacity="0.6">
            Colinas y Castillo
          </text>

          {/* Pest Label */}
          <text x="65" y="12" fill="#94a3b8" fontSize="3.5" fontWeight="bold" opacity="0.4" letterSpacing="0.3">
            PEST (ESTE)
          </text>
          <text x="65" y="16" fill="#64748b" fontSize="1.8" opacity="0.6">
            Parlamento y Centro
          </text>

          {/* Interactive Landmark Pins */}
          {visiblePlaces.map(({ place, coord }) => {
            const isSelected = place._id === selectedPlace?._id;
            const isVisited = place.visited;

            return (
              <g
                key={place._id}
                onClick={() => setSelectedId(place._id)}
                className="cursor-pointer transition-transform duration-300"
                style={{ transformOrigin: `${coord.x}% ${coord.y}%` }}
              >
                {/* Highlight ring for selected landmark */}
                {isSelected && (
                  <>
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="5.5"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="0.6"
                      className="animate-ping"
                      opacity="0.75"
                    />
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="4.2"
                      fill="#10b981"
                      fillOpacity="0.25"
                      stroke="#34d399"
                      strokeWidth="0.5"
                    />
                  </>
                )}

                {/* Pin shadow */}
                <ellipse
                  cx={coord.x}
                  cy={coord.y + 1.2}
                  rx="1.5"
                  ry="0.8"
                  fill="#000000"
                  fillOpacity="0.5"
                />

                {/* Marker Outer Circle */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? '2.4' : '1.8'}
                  fill={isVisited ? '#10b981' : isSelected ? '#38bdf8' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '0.6' : '0.4'}
                />

                {/* Checkmark icon for visited places */}
                {isVisited && (
                  <path
                    d={`M ${coord.x - 0.7} ${coord.y} L ${coord.x - 0.2} ${coord.y + 0.6} L ${coord.x + 0.8} ${coord.y - 0.6}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend on bottom-left of map */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded-lg border border-slate-700/60 text-[9px] font-mono text-slate-300 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Visitado</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Pendiente</span>
          </div>
        </div>

        {/* Current target coordinates badge */}
        {selectedPlace && selectedCoord && (
          <div className="absolute top-2 right-2 bg-slate-900/85 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400 animate-bounce" />
            <span>{selectedCoord.side.toUpperCase()}: {selectedPlace.title.slice(0, 18)}</span>
          </div>
        )}
      </div>

      {/* Interactive Landmark Preview Card (Preview del Sitio) */}
      {selectedPlace && selectedCoord && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm space-y-3">
          {/* Header row with navigation arrows */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                  selectedCoord.side === 'buda'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : selectedCoord.side === 'pest'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {selectedCoord.side.toUpperCase()}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {selectedCoord.area}
              </span>
            </div>

            {/* Stepper buttons (prev/next landmark on map) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                title="Sitio anterior"
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 font-bold px-1">
                {currentIndex + 1}/{places.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                title="Sitio siguiente"
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 active:scale-95 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Photo & Main Details Preview */}
          <div className="flex gap-3 items-start">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedCoord.image}
                alt={selectedPlace.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {selectedPlace.visited && (
                <div className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-md shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Text details */}
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                {selectedPlace.title}
              </h3>
              {selectedPlace.originalName && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  {selectedPlace.originalName}
                </p>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {selectedPlace.description}
              </p>

              {/* Priority & estimated time */}
              <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
                <span className="capitalize text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  {selectedPlace.priority}
                </span>
                {selectedPlace.estimatedTimeMinutes && (
                  <span className="text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    ~{selectedPlace.estimatedTimeMinutes} min
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Insider Tip preview */}
          {selectedPlace.tip && (
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold mr-1">Consejo:</strong>
                {selectedPlace.tip}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {/* Toggle Visited */}
            <button
              type="button"
              onClick={() => onToggleVisited(selectedPlace._id, selectedPlace.visited)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                selectedPlace.visited
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-xs'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${selectedPlace.visited ? 'text-emerald-600' : 'text-white'}`} />
              <span>{selectedPlace.visited ? 'VISITADO ✓' : 'MARCAR VISITADO'}</span>
            </button>

            {/* Google Maps link */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl font-mono text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-all shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>CÓMO LLEGAR</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
