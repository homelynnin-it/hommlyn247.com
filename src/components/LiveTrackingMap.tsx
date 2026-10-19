import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';

interface LiveTrackingMapProps {
  booking: Booking;
  className?: string;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ booking, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Bangalore base coordinates (default center if no geo)
    const baseLat = 12.9716;
    const baseLng = 77.5946;

    // Slight offsets for simulation
    const customerLat = baseLat + 0.006;
    const customerLng = baseLng + 0.008;

    // Partner moves closer depending on status
    let partnerLat = baseLat - 0.008;
    let partnerLng = baseLng - 0.005;

    if (booking.status === 'en_route') {
      partnerLat = customerLat - 0.003;
      partnerLng = customerLng - 0.002;
    } else if (booking.status === 'arrived' || booking.status === 'in_progress' || booking.status === 'completed') {
      partnerLat = customerLat;
      partnerLng = customerLng;
    }

    // Initialize Leaflet Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [(customerLat + partnerLat) / 2, (customerLng + partnerLng) / 2],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Customer Marker Icon
      const customerIcon = L.divIcon({
        className: 'custom-customer-marker',
        html: `
          <div style="background-color: #0F4A42; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(15,74,66,0.4); border: 2px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });

      L.marker([customerLat, customerLng], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<b>${booking.customer?.name || 'Customer Location'}</b><br/>${booking.customer?.address || 'Service Destination'}`);

      // Custom Partner Marker Icon with Pulsing Effect
      const partnerIcon = L.divIcon({
        className: 'custom-partner-marker',
        html: `
          <div style="position: relative; width: 38px; height: 38px;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(13,148,136,0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; background: linear-gradient(135deg, #0D9488, #0F4A42); color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(13,148,136,0.5); border: 2.5px solid white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      L.marker([partnerLat, partnerLng], { icon: partnerIcon })
        .addTo(map)
        .bindPopup(`<b>${booking.helper?.name || 'hommlyn247 Pro'}</b><br/>${booking.helper?.categoryTitle || 'Verified Partner'} • Speed: 28 km/h`);

      // Polyline route between partner and customer
      const routePoints: [number, number][] = [
        [partnerLat, partnerLng],
        [(partnerLat + customerLat) / 2 + 0.001, (partnerLng + customerLng) / 2 - 0.001],
        [customerLat, customerLng]
      ];

      L.polyline(routePoints, {
        color: '#0D9488',
        weight: 4,
        dashArray: '8, 8',
        lineCap: 'round',
        opacity: 0.85
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [booking.id, booking.status]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.974, 77.597], 14, { animate: true });
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 ${className}`}>
      {/* Map Surface */}
      <div ref={mapContainerRef} className="w-full h-72 sm:h-80 z-0" />

      {/* Floating Status Overlay Badge */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <Navigation className="w-4 h-4 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-xs font-black text-slate-900">
              {booking.status === 'en_route' && 'Partner Moving (ETA: ~8 mins)'}
              {booking.status === 'arrived' && 'Partner At Doorstep'}
              {booking.status === 'in_progress' && 'Service in Progress'}
              {booking.status === 'completed' && 'Service Completed'}
              {booking.status === 'pending' || booking.status === 'assigned' ? 'Dispatched from Hub' : ''}
            </p>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Live telemetry • Bangalore Central Zone • Verified Route
          </p>
        </div>
      </div>

      {/* Re-center / Map Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleRecenter}
          className="p-2 bg-white/95 backdrop-blur-md rounded-xl text-slate-700 hover:text-teal-700 shadow-md border border-slate-200 cursor-pointer"
          title="Recenter Route"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Security Pill */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#0F4A42] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
        <span>Hommlyn SafeZone GPS Tracking</span>
      </div>
    </div>
  );
};
