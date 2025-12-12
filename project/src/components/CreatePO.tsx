import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreatePOProps {
  onNavigate: (screen: string) => void;
  onPOCreated: () => void;
}

export function CreatePO({ onNavigate, onPOCreated }: CreatePOProps) {
  const [formData, setFormData] = useState({
    materialCode: '',
    materialDescription: '',
    quantity: '',
    vendor: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const poNumber = `PO${Date.now().toString().slice(-8)}`;

      const { error } = await supabase.from('purchase_orders').insert({
        po_number: poNumber,
        material_code: formData.materialCode,
        material_description: formData.materialDescription,
        quantity: parseInt(formData.quantity),
        vendor: formData.vendor,
        status: 'Open',
      });

      if (error) throw error;

      setMessage({ type: 'success', text: `Purchase Order ${poNumber} created successfully!` });
      setFormData({ materialCode: '', materialDescription: '', quantity: '', vendor: '' });
      onPOCreated();

      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create purchase order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-semibold">SAP MM Demo System</h1>
        <p className="text-blue-100 text-sm mt-1">Create Purchase Order</p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Purchase Order Entry</h2>
            <p className="text-sm text-gray-500 mt-1">ME21N - Create Purchase Order</p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.materialCode}
                    onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., MAT-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.materialDescription}
                  onChange={(e) => setFormData({ ...formData, materialDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., Steel Rods 10mm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., ABC Suppliers Ltd."
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Creating...' : 'Create PO'}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
