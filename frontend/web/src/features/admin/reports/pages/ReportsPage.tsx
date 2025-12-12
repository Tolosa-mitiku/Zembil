import { useState } from 'react';
import { useGetReportsQuery, useGenerateReportMutation } from '../api/reportsApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon, 
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const ReportsPage = () => {
  const { data: reports, isLoading } = useGetReportsQuery();
  const [generateReport] = useGenerateReportMutation();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Advanced Reports</h1>
        <p className="text-body-small text-grey-600">Generate and download detailed analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-dashed border-grey-200 flex flex-col items-center justify-center p-8 hover:border-gold-300 transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-100 transition-colors">
            <ChartBarIcon className="w-8 h-8 text-gold-600" />
          </div>
          <h3 className="font-bold text-grey-900 mb-1">Create Custom Report</h3>
          <p className="text-sm text-grey-500 text-center">Design a new report with custom metrics and filters</p>
        </Card>

        {reports?.map((report) => (
          <Card key={report.id}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DocumentChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium bg-grey-100 px-2 py-1 rounded">
                {report.format.toUpperCase()}
              </span>
            </div>
            
            <h3 className="font-bold text-grey-900 mb-2">{report.name}</h3>
            
            <div className="space-y-2 text-sm text-grey-500 mb-6">
              <div className="flex justify-between">
                <span>Schedule:</span>
                <span className="capitalize text-grey-900">{report.schedule}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Run:</span>
                <span className="text-grey-900">{formatDate(report.lastRun)}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Latest
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;














