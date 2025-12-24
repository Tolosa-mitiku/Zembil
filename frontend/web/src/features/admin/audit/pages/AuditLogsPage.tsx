import { useGetAuditLogsQuery } from '../api/auditApi';
import Card from '@/shared/components/Card';
import { formatDate } from '@/core/utils/format';
import { 
  ClipboardDocumentCheckIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const AuditLogsPage = () => {
  const { data: logs, isLoading } = useGetAuditLogsQuery();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Audit Logs</h1>
        <p className="text-body-small text-grey-600">Track all administrative actions and system changes</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200">
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Action</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Admin</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Target</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Details</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">IP & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((log) => (
                <tr key={log.id} className="border-b border-grey-100 hover:bg-grey-50">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs bg-grey-100 px-2 py-1 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-grey-400" />
                      <span className="text-sm font-medium text-grey-900">{log.adminName}</span>
                    </div>
                    <span className="text-xs text-grey-500 ml-6">{log.adminId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-grey-900 capitalize">{log.targetType}</span>
                    <span className="text-xs text-grey-500 block">{log.targetId}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-grey-600 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col text-xs text-grey-500">
                      <span className="flex items-center">
                        <ComputerDesktopIcon className="w-3 h-3 mr-1" />
                        {log.ipAddress}
                      </span>
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
















