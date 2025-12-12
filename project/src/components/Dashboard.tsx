import { FileText, Package, BarChart3 } from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  stats: {
    totalPOs: number;
    openPOs: number;
    totalGRNs: number;
  };
}

export function Dashboard({ onNavigate, stats }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-semibold">SAP MM Demo System</h1>
        <p className="text-blue-100 text-sm mt-1">Materials Management - Purchase Order to Goods Receipt</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Overview</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Purchase Orders</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">{stats.totalPOs}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Purchase Orders</p>
                  <p className="text-3xl font-bold text-orange-700 mt-1">{stats.openPOs}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-500" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Goods Receipts Posted</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">{stats.totalGRNs}</p>
                </div>
                <Package className="w-10 h-10 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('create-po')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Create Purchase Order
            </button>

            <button
              onClick={() => onNavigate('goods-receipt')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Post Goods Receipt
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>SAP MM Training Demo System v1.0 | For Presentation Purposes Only</p>
        </div>
      </div>
    </div>
  );
}
