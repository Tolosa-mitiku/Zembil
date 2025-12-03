import { useState } from 'react';
import { useGetOperationsQuery, useCreateOperationMutation } from '../api/bulkApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import { 
  ArrowUpTrayIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BulkOperationsPage = () => {
  const { data: operations, isLoading } = useGetOperationsQuery();
  const [createOperation] = useCreateOperationMutation();
  const [selectedType, setSelectedType] = useState('import_products');

  const handleStartOperation = async () => {
    try {
      await createOperation({ type: selectedType }).unwrap();
      toast.success('Bulk operation started');
    } catch (err) {
      toast.error('Failed to start operation');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Bulk Operations</h1>
        <p className="text-body-small text-grey-600">Perform mass updates and data imports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-title-medium font-bold text-grey-900 mb-4">Start New Operation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-grey-700 mb-2">Operation Type</label>
                <select 
                  className="w-full p-2 border border-grey-300 rounded-lg"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="import_products">Import Products (CSV)</option>
                  <option value="update_prices">Bulk Price Update</option>
                  <option value="approve_sellers">Approve All Pending Sellers</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-grey-300 rounded-lg text-center bg-grey-50">
                <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-grey-400 mb-2" />
                <p className="text-sm text-grey-600">Drag & drop CSV file here</p>
                <p className="text-xs text-grey-400 mt-1">or click to browse</p>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleStartOperation}
              >
                <PlayIcon className="w-5 h-5 mr-2" /> Start Processing
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-title-medium font-bold text-grey-900 mb-4">Recent Operations</h3>
            <div className="space-y-4">
              {operations?.map((op) => (
                <div key={op.id} className="p-4 border border-grey-100 rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-grey-900 capitalize">
                        {op.type.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-grey-500">ID: {op.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      op.status === 'completed' ? 'bg-green-100 text-green-800' :
                      op.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {op.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-grey-600 mb-1">
                      <span>Progress</span>
                      <span>{op.progress}%</span>
                    </div>
                    <div className="w-full bg-grey-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          op.status === 'completed' ? 'bg-green-500' : 
                          op.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${op.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-grey-500">
                    <span>Processed: {op.processedItems}/{op.totalItems}</span>
                    <span>Started: {formatDate(op.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsPage;












