import { useOffline } from '@/lib/useOffline';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline - Limited functionality</span>
    </div>
  );
}
