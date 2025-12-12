import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PurchaseOrder {
  id: number;
  po_number: string;
  material_code: string;
  material_description: string;
  quantity: number;
  vendor: string;
  status: string;
}

interface GoodsReceiptProps {
  onNavigate: (screen: string) => void;
  onGRNPosted: () => void;
}

export function GoodsReceipt({ onNavigate, onGRNPosted }: GoodsReceiptProps) {
  const [openPOs, setOpenPOs] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadOpenPOs();
  }, []);

  const loadOpenPOs = async () => {
    const { data } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('status', 'Open')
      .order('created_at', { ascending: false });

    if (data) {
      setOpenPOs(data);
    }
  };

  const handlePostGRN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const grnNumber = `GRN${Date.now().toString().slice(-8)}`;

      const { error: grnError } = await supabase.from('goods_receipts').insert({
        grn_number: grnNumber,
        po_id: selectedPO.id,
        po_number: selectedPO.po_number,
        received_quantity: parseInt(receivedQuantity),
        status: 'Posted',
      });

      if (grnError) throw grnError;

      const { error: updateError } = await supabase
        .from('purchase_orders')
        .update({ status: 'Received' })
        .eq('id', selectedPO.id);

      if (updateError) throw updateError;

      setMessage({
        type: 'success',
        text: `Goods Receipt ${grnNumber} posted successfully! PO ${selectedPO.po_number} updated.`,
      });
      setSelectedPO(null);
      setReceivedQuantity('');
      loadOpenPOs();
      onGRNPosted();

      setTimeout(() => {
        onNavigate('dashboard');
      }, 2500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to post goods receipt. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-semibold">SAP MM Demo System</h1>
        <p className="text-blue-100 text-sm mt-1">Goods Receipt</p>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Goods Receipt Entry</h2>
            <p className="text-sm text-gray-500 mt-1">MIGO - Goods Receipt for Purchase Order</p>
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Purchase Order *
            </label>
            <select
              value={selectedPO?.id || ''}
              onChange={(e) => {
                const po = openPOs.find((p) => p.id === parseInt(e.target.value));
                setSelectedPO(po || null);
                setReceivedQuantity(po ? po.quantity.toString() : '');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select a Purchase Order --</option>
              {openPOs.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.po_number} - {po.material_description} (Qty: {po.quantity})
                </option>
              ))}
            </select>
          </div>

          {selectedPO && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Purchase Order Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">PO Number:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedPO.po_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Material Code:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedPO.material_code}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedPO.material_description}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vendor:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedPO.vendor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ordered Quantity:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedPO.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium text-orange-600">{selectedPO.status}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePostGRN}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedPO.quantity}
                    value={receivedQuantity}
                    onChange={(e) => setReceivedQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter received quantity"
                  />
                </div>

                <div className="pt-6 border-t border-gray-200 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isSubmitting ? 'Posting...' : 'Post GRN'}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
