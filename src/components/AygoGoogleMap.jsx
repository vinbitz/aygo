import React, { useEffect, useRef, useState } from 'react';
import { SUPPLIERS } from '../data/mockData';
import { Eye, MapPin, ZoomIn, ZoomOut, Compass, Factory, Navigation, ChevronRight, Search } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDPlzdRUvUscJXBlwHy-Rx7NRBO8tMosLU';

const DEFAULT_VENUE = {
  name: 'Arthaland Century Pacific Tower',
  address: '4th Ave, 30th St, Taguig, Metro Manila',
  lat: 14.5518,
  lng: 121.0475
};

const MAP_STYLES = [
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: 45 }] },
  { featureType: 'road.highway', elementType: 'all', stylers: [{ visibility: 'simplified' }, { color: '#cbd5e1' }] },
  { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ color: '#bfdbfe' }, { visibility: 'on' }] }
];

export default function AygoGoogleMap({ 
  activeLocation = DEFAULT_VENUE, 
  deliveryType, 
  onSelectSupplier,
  focusedSupplierId,
  onOpenDrawer,
  onOpenLocationPicker
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const destMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const supplierMarkersMapRef = useRef({});
  const infoWindowRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activeSupplierFilter, setActiveSupplierFilter] = useState('all');

  // Load Google Maps API Script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapLoaded(true));
      existingScript.addEventListener('error', () => setMapError(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
  }, []);

  // Helper to fit bounds to show both Venue and all Suppliers
  const fitAllBounds = () => {
    if (!mapInstanceRef.current || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    
    // Add active venue
    const venueLat = activeLocation.lat || DEFAULT_VENUE.lat;
    const venueLng = activeLocation.lng || DEFAULT_VENUE.lng;
    bounds.extend(new window.google.maps.LatLng(venueLat, venueLng));

    // Add suppliers
    SUPPLIERS.forEach(s => {
      bounds.extend(new window.google.maps.LatLng(s.lat, s.lng));
    });

    mapInstanceRef.current.fitBounds(bounds, { top: 70, right: 40, bottom: 40, left: 40 });
    setActiveSupplierFilter('all');
  };

  // Helper to focus specific supplier
  const focusSupplier = (supplier) => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;
    const pos = { lat: supplier.lat, lng: supplier.lng };
    map.panTo(pos);
    map.setZoom(15);
    setActiveSupplierFilter(supplier.id);

    const marker = supplierMarkersMapRef.current[supplier.id];
    if (marker && infoWindowRef.current) {
      showSupplierInfoWindow(supplier, marker);
    }
  };

  // Helper to focus destination venue
  const focusVenue = () => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;
    const venueLat = activeLocation.lat || DEFAULT_VENUE.lat;
    const venueLng = activeLocation.lng || DEFAULT_VENUE.lng;
    map.panTo({ lat: venueLat, lng: venueLng });
    map.setZoom(14);
    setActiveSupplierFilter('venue');
  };

  const showSupplierInfoWindow = (supplier, marker) => {
    if (!infoWindowRef.current || !mapInstanceRef.current) return;
    const bidInfo = {
      s1: { price: '₱49.50/pc', turn: '5 Business Days', badge: 'Active Bidder' },
      s2: { price: '₱55.00/pc', turn: '6-8 Days', badge: 'Verified Maker' },
      s3: { price: '₱46.00/pc', turn: '4 Business Days', badge: 'Lowest Bidder' },
      s4: { price: '₱340.00/pc', turn: '3-5 Days', badge: 'Laser Engraver' }
    }[supplier.id] || { price: 'Inquire', turn: '4-7 Days', badge: 'Verified Partner' };

    const contentString = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px; max-width: 250px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; background: #dbeafe; color: #003CF5; padding: 2px 6px; border-radius: 4px;">
            ${bidInfo.badge}
          </span>
          <span style="font-size: 11px; font-weight: 800; color: #059669;">
            ${bidInfo.price}
          </span>
        </div>
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.2;">
          ${supplier.name}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
          ${supplier.city} · <strong>${supplier.distanceFromVenue || 'Metro Manila'}</strong>
        </div>
        <div style="font-size: 10px; color: #0f172a; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 6px; border-radius: 6px; margin-top: 6px;">
          Crafting turnaround: <strong>${bidInfo.turn}</strong>
        </div>
        <button id="supplier-btn-${supplier.id}" style="margin-top: 8px; width: 100%; background: #003CF5; color: #ffffff; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
          View Supplier Profile & Specs →
        </button>
      </div>
    `;

    infoWindowRef.current.setContent(contentString);
    infoWindowRef.current.open(mapInstanceRef.current, marker);

    // Attach click event to button inside InfoWindow
    window.google.maps.event.addListenerOnce(infoWindowRef.current, 'domready', () => {
      const btn = document.getElementById(`supplier-btn-${supplier.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          if (onSelectSupplier) onSelectSupplier(supplier);
        });
      }
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const initialCenter = {
        lat: activeLocation.lat || DEFAULT_VENUE.lat,
        lng: activeLocation.lng || DEFAULT_VENUE.lng
      };

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 12,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new window.google.maps.InfoWindow();

      // 1. Destination Pin (Delivery Venue) - Styled as sleek Aygo Blue Location Pin
      const destMarker = new window.google.maps.Marker({
        position: initialCenter,
        map,
        title: activeLocation.name || activeLocation.address,
        icon: {
          path: 'M 0,0 C -2,-20 -14,-20 -14,-34 A 14,14 0 1,1 14,-34 C 14,-20 2,-20 0,0 Z',
          scale: 1.15,
          fillColor: '#003CF5',
          fillOpacity: 1,
          strokeWeight: 2.5,
          strokeColor: '#FFFFFF',
          labelOrigin: new window.google.maps.Point(0, -34)
        },
        label: {
          text: '★',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '900'
        },
        zIndex: 999
      });
      destMarkerRef.current = destMarker;

      // 2. Sourcing Radius Circle (15 km coverage around destination)
      const radiusCircle = new window.google.maps.Circle({
        strokeColor: '#003CF5',
        strokeOpacity: 0.35,
        strokeWeight: 1.5,
        fillColor: '#003CF5',
        fillOpacity: 0.05,
        map,
        center: initialCenter,
        radius: 16000
      });
      radiusCircleRef.current = radiusCircle;

      // Destination Info Window
      destMarker.addListener('click', () => {
        if (!infoWindowRef.current) return;
        infoWindowRef.current.setContent(`
          <div style="padding: 6px 8px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <div style="font-size: 9px; font-weight: 800; color: #003CF5; text-transform: uppercase;">Venue</div>
            <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px;">${activeLocation.name || 'Selected Location'}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${activeLocation.address || ''}</div>
          </div>
        `);
        infoWindowRef.current.open(map, destMarker);
      });

      // 3. Verified Supplier Pins
      const supplierBids = {
        s1: { price: '₱49.50', isLowest: false, label: 'Taytay Garments' },
        s2: { price: '₱55.00', isLowest: false, label: 'Marikina Bags' },
        s3: { price: '₱46.00', isLowest: true, label: 'JJT Digital' },
        s4: { price: '₱340.00', isLowest: false, label: 'Valenzuela Laser' }
      };

      const markersMap = {};
      SUPPLIERS.forEach((s) => {
        const bidInfo = supplierBids[s.id] || { price: '₱50.00', isLowest: false, label: s.city };
        
        // Custom colored marker
        const marker = new window.google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: `${s.name} (${s.city})`,
          label: {
            text: bidInfo.isLowest ? 'LOWEST' : 'MAKER',
            color: '#ffffff',
            fontSize: '9px',
            fontWeight: 'bold'
          },
          icon: {
            path: 'M 0,0 C -2,-20 -12,-20 -12,-30 A 12,12 0 1,1 12,-30 C 12,-20 2,-20 0,0 Z',
            scale: 1.1,
            fillColor: bidInfo.isLowest ? '#059669' : '#003CF5',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            labelOrigin: new window.google.maps.Point(0, -30)
          },
          zIndex: bidInfo.isLowest ? 800 : 700
        });

        marker.addListener('click', () => {
          showSupplierInfoWindow(s, marker);
          setActiveSupplierFilter(s.id);
        });

        markersMap[s.id] = marker;
      });

      supplierMarkersMapRef.current = markersMap;

      // Fit bounds to show both venue and suppliers nicely
      setTimeout(() => {
        fitAllBounds();
      }, 300);

    } catch (err) {
      console.error('Error initializing Google Maps:', err);
      setMapError(true);
    }
  }, [mapLoaded]);

  // Handle external focusedSupplierId changes
  useEffect(() => {
    if (!focusedSupplierId || !mapInstanceRef.current) return;
    const target = SUPPLIERS.find(s => s.id === focusedSupplierId);
    if (target) {
      focusSupplier(target);
    }
  }, [focusedSupplierId]);

  // Update center when activeLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    if (activeLocation.lat && activeLocation.lng) {
      const newPos = { lat: activeLocation.lat, lng: activeLocation.lng };
      if (destMarkerRef.current) {
        destMarkerRef.current.setPosition(newPos);
        destMarkerRef.current.setTitle(activeLocation.name || activeLocation.address);
      }
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setCenter(newPos);
      }
    }
  }, [activeLocation, deliveryType]);

  return (
    <div className="relative w-full h-full min-h-[360px] overflow-hidden rounded-2xl flex flex-col">
      {/* Top Floating Header Row (Hamburger & Location Pill) */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 pointer-events-none flex items-center justify-between gap-2">
        {onOpenDrawer ? (
          <button
            type="button"
            onClick={onOpenDrawer}
            className="pointer-events-auto relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/90 flex flex-col items-center justify-center gap-1 hover:bg-white transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Open Menu"
          >
            <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
            <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
            <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
            <span className="absolute top-2 right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
        ) : <div />}

        {onOpenLocationPicker && (
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={onOpenLocationPicker}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/90 hover:bg-white flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-900 transition-all hover:scale-105 active:scale-95 group cursor-pointer max-w-[60vw] sm:max-w-[280px]"
            >
              <span className="truncate">
                {activeLocation.name ? activeLocation.name : 'Set delivery venue'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#003CF5] transition-colors shrink-0" />
            </button>

            <button
              type="button"
              onClick={onOpenLocationPicker}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-[#003CF5] hover:bg-white transition-all active:scale-95 shrink-0 cursor-pointer"
              title="Search App & Locations"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 hover:text-[#003CF5]" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Re-center Target Button (Matching inspo Navigation Arrow) */}
      <div className="absolute bottom-[60vh] right-4 sm:right-6 lg:bottom-6 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={focusVenue}
          className="w-11 h-11 rounded-full bg-white shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#003CF5] hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          title="Center on Venue"
        >
          <Navigation className="w-5 h-5 -rotate-45" />
        </button>
      </div>

      {/* Real Interactive Google Maps Canvas */}
      <div 
        ref={mapContainerRef} 
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          mapLoaded && !mapError ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Fallback Simulation Map (Matching inDrive style with centered black pin [ ! ]) */}
      {(!mapLoaded || mapError) && (
        <div className="absolute inset-0 w-full h-full bg-[#E5ECF6] flex items-center justify-center overflow-hidden select-none">
          {/* Subtle clean vector map roads (NO DOTS) */}
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 700">
            {/* Waterway / Pasig River */}
            <path d="M-50,320 C180,310 260,370 420,350 C580,330 680,410 850,390 C950,380 1050,420 1100,430" fill="none" stroke="#BFDBFE" strokeWidth="24" strokeLinecap="round" />
            <path d="M-50,320 C180,310 260,370 420,350 C580,330 680,410 850,390 C950,380 1050,420 1100,430" fill="none" stroke="#93C5FD" strokeWidth="18" strokeLinecap="round" />
            
            {/* Major Arteries / EDSA / C5 / Roxas Blvd */}
            <path d="M120,-50 L260,750" fill="none" stroke="#FFFFFF" strokeWidth="10" />
            <path d="M480,-50 L520,750" fill="none" stroke="#FFFFFF" strokeWidth="12" />
            <path d="M820,-50 L780,750" fill="none" stroke="#FFFFFF" strokeWidth="8" />
            <path d="M-50,180 L1050,220" fill="none" stroke="#FFFFFF" strokeWidth="10" />
            <path d="M-50,480 L1050,460" fill="none" stroke="#FFFFFF" strokeWidth="9" />
            
            {/* Secondary Streets */}
            <path d="M220,100 L450,100 M480,140 L780,140 M300,280 L520,280 M520,540 L820,540" fill="none" stroke="#E2E8F0" strokeWidth="4" />
            <path d="M350,-50 L380,750 M650,-50 L640,750" fill="none" stroke="#E2E8F0" strokeWidth="4" />
          </svg>

          {/* Sourcing Area Radius Pulse (Electric Blue) */}
          <div className="absolute w-72 h-72 rounded-full border border-[#003CF5]/30 bg-[#003CF5]/5 animate-pulse pointer-events-none" />

          {/* Centered Aygo Delivery Venue Pin */}
          <div className="relative z-10 flex flex-col items-center -translate-y-5 pointer-events-none">
            <div className="w-11 h-11 rounded-2xl bg-[#003CF5] border-2 border-white shadow-xl shadow-blue-500/30 flex items-center justify-center text-white">
              <MapPin className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#003CF5] -mt-0.5" />
            <div className="w-3 h-1 rounded-full bg-blue-900/30 blur-[1px] mt-0.5" />
            
            {/* City Label under pin */}
            <span className="mt-1.5 text-[11px] font-black text-slate-800 bg-white/95 px-2.5 py-0.5 rounded-full shadow-md border border-slate-200 backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#003CF5] animate-ping" />
              <span>{activeLocation.name || 'Delivery Venue'}</span>
            </span>
          </div>

          {/* Google Logo Bottom-Left Watermark */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 opacity-70 pointer-events-none select-none font-bold text-sm tracking-tight text-slate-600">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>
        </div>
      )}
    </div>
  );
}
