import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Simple test query - just check if we can connect
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        setError(error.message);
        setConnectionStatus('error');
      } else {
        setConnectionStatus('connected');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-semibold text-gray-800 mb-2">Supabase Connection</h3>
      {connectionStatus === 'testing' && (
        <div className="flex items-center text-blue-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          Testing...
        </div>
      )}
      {connectionStatus === 'connected' && (
        <div className="flex items-center text-green-600">
          <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
          Connected ✓
        </div>
      )}
      {connectionStatus === 'error' && (
        <div className="text-red-600">
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
            Not Connected ✗
          </div>
          <p className="text-xs text-gray-600">
            {error?.includes('relation "users" does not exist') 
              ? 'Database tables not created yet. Run the SQL schema in Supabase.' 
              : error}
          </p>
        </div>
      )}
    </div>
  );
}