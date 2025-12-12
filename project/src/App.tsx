import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { CreatePO } from './components/CreatePO';
import { GoodsReceipt } from './components/GoodsReceipt';
import { supabase } from './lib/supabase';

type Screen = 'dashboard' | 'create-po' | 'goods-receipt';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [stats, setStats] = useState({
    totalPOs: 0,
    openPOs: 0,
    totalGRNs: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: allPOs } = await supabase.from('purchase_orders').select('*');
    const { data: openPOs } = await supabase.from('purchase_orders').select('*').eq('status', 'Open');
    const { data: grns } = await supabase.from('goods_receipts').select('*');

    setStats({
      totalPOs: allPOs?.length || 0,
      openPOs: openPOs?.length || 0,
      totalGRNs: grns?.length || 0,
    });
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  return (
    <>
      {currentScreen === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} stats={stats} />
      )}
      {currentScreen === 'create-po' && (
        <CreatePO onNavigate={handleNavigate} onPOCreated={loadStats} />
      )}
      {currentScreen === 'goods-receipt' && (
        <GoodsReceipt onNavigate={handleNavigate} onGRNPosted={loadStats} />
      )}
    </>
  );
}

export default App;
