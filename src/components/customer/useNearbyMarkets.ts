import { useCallback, useState } from 'react';
import { api, errorMessage } from '../../services/api';

type Status = 'idle' | 'locating' | 'ready' | 'denied' | 'error';

/**
 * "Markets near me": asks the browser for the user's location (needs HTTPS or localhost),
 * then asks the backend for every market's distance (GET /api/getNearbyMarkets).
 */
export const useNearbyMarkets = (radiusKm = 100) => {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setMessage('Your browser does not support location.');
      return;
    }
    setStatus('locating');
    setMessage('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        try {
          const res = await api.get(`/getNearbyMarkets?lat=${lat}&lng=${lng}&km=${radiusKm}`);
          const map: Record<string, number> = {};
          res.markets.forEach((m: any) => {
            map[m._id] = m.distanceKm;
          });
          setDistances(map);
          setStatus('ready');
          setMessage(res.markets.length ? '' : `No markets within ${radiusKm} km of you.`);
        } catch (err) {
          setStatus('error');
          setMessage(errorMessage(err, 'Could not load nearby markets'));
        }
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
        setMessage(err.code === err.PERMISSION_DENIED ? 'Location permission was denied. Allow it in your browser to see markets near you.' : 'Could not get your location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5 * 60 * 1000 }
    );
  }, [radiusKm]);

  const clear = () => {
    setStatus('idle');
    setDistances({});
    setCoords(null);
    setMessage('');
  };

  return { status, message, distances, coords, locate, clear };
};

export const formatDistance = (km?: number) =>
  km === undefined ? '' : km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
