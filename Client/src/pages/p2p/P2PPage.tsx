import { useEffect } from 'react';
import P2pFilterSection from '@/components/p2p/P2pFilterSection';

const P2PPage: React.FC = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='h-full ml-20'>
      <P2pFilterSection/>
    </div>
  );
};

export default P2PPage;