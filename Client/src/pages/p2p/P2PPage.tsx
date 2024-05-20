import P2PTable from '../../components/p2p/p2pTAble';
import P2PFilterBar from '../../components/p2p/p2pFilterBar';
import { useState } from 'react';
import P2pFilterSection from '@/components/p2p/P2pFilterSection';

const P2PPage: React.FC = () => {

  const [mode, setMode] = useState<'Buy' | 'Sell'>('Buy');

  return (
    <div className='p-24'>
      <P2pFilterSection/>
    </div>
  );
};

export default P2PPage;