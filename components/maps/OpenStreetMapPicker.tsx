'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search } from 'lucide-react';
import { useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

// Dynamically import map components (Leaflet doesn't support SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

type Location = {
  lat: number;
  lng: number;
  address: string;
};

type OpenStreetMapPickerProps = {
  initialLocation?: Location;
  onLocationChange?: (location: Location) => void;
  height?: string;
  showSearch?: boolean;
};

// Nominatim API functions (free geocoding service)
async function searchAddress(query: string): Promise<Location | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'VietAdmin-Contact-Map/1.0',
        },
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name,
      };
    }
    return null;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'VietAdmin-Contact-Map/1.0',
        },
      }
    );
    const data = await response.json();
    return data.display_name || '';
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return '';
  }
}

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (location: Location) => void;
}) {
  useMapEvents({
    click: async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      onLocationChange({ lat, lng, address });
    },
  });
  return null;
}

function SearchBox({
  onSearch,
}: {
  onSearch: (location: Location) => void;
}) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    const result = await searchAddress(query);
    setIsSearching(false);

    if (result) {
      onSearch(result);
    } else {
      alert('Không tìm thấy địa chỉ. Vui lòng thử lại.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm địa chỉ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50"
        />
      </div>
    </form>
  );
}

export default function OpenStreetMapPicker({
  initialLocation = { lat: 10.762622, lng: 106.660172, address: 'TP. Hồ Chí Minh' },
  onLocationChange,
  height = '400px',
  showSearch = true,
}: OpenStreetMapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState(initialLocation);
  const [map, setMap] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocationChange = (location: Location) => {
    setMarkerPosition(location);
    onLocationChange?.(location);

    // Pan map to new location
    if (map) {
      map.setView([location.lat, location.lng], 15);
    }
  };

  if (!isClient) {
    return (
      <div className="bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border" style={{ height }}>
        <div className="text-center">
          <MapPin size={32} className="mx-auto mb-2" />
          <span className="text-sm">Đang tải bản đồ...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="relative rounded-xl overflow-hidden border">
      {showSearch && <SearchBox onSearch={handleLocationChange} />}

      <MapContainer
        center={[markerPosition.lat, markerPosition.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[markerPosition.lat, markerPosition.lng]} />
        <MapClickHandler onLocationChange={handleLocationChange} />
      </MapContainer>
    </div>
  );
}
