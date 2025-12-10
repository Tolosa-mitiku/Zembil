import { useGetSystemHealthQuery, useClearCacheMutation } from '../api/systemApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import { 
  ServerStackIcon, 
  CpuChipIcon, 
  TrashIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SystemPage = () => {
  const { data: health, isLoading } = useGetSystemHealthQuery();
  const [clearCache] = useClearCacheMutation();

  const handleClearCache = async () => {
    try {
      await clearCache().unwrap();
      toast.success('System cache cleared');
    } catch (err) {
      toast.error('Failed to clear cache');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">System Status</h1>
        <p className="text-body-small text-grey-600">Monitor server health and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${
          health?.status === 'healthy' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center space-x-3">
            <ServerStackIcon className={`w-8 h-8 ${
              health?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
            }`} />
            <div>
              <p className="text-sm font-medium text-grey-600">System Status</p>
              <h3 className="text-xl font-bold capitalize text-grey-900">{health?.status}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <CpuChipIcon className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-grey-600">CPU Usage</p>
              <h3 className="text-xl font-bold text-grey-900">{health?.cpuUsage}%</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <CircleStackIcon className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-grey-600">Memory Usage</p>
              <h3 className="text-xl font-bold text-grey-900">{health?.memoryUsage}%</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
              <span className="text-gold-700 font-bold">V</span>
            </div>
            <div>
              <p className="text-sm font-medium text-grey-600">Version</p>
              <h3 className="text-xl font-bold text-grey-900">{health?.version}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-grey-900 mb-4">Maintenance Actions</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-grey-50 rounded-lg">
              <div>
                <h4 className="font-medium text-grey-900">Clear Application Cache</h4>
                <p className="text-sm text-grey-500">Remove temporary files and data</p>
              </div>
              <Button onClick={handleClearCache} variant="outline" className="text-red-600 border-red-200">
                <TrashIcon className="w-4 h-4 mr-2" /> Clear Cache
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemPage;












