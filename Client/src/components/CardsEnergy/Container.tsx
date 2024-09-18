import React from 'react';
import CardConsume from './CardConsume';
import CardGenerated from './CardGenerated';
import CardEnergy from './CardEnergy';

interface ContainerProps {
  energyGenerated: any;
  energyGenerating: any;
  consumedCalculate: any;
  tokens: any;
  claimReward: any;
}

const Container: React.FC<ContainerProps> = ({
  energyGenerated,
  energyGenerating,
  consumedCalculate,
  tokens,
  claimReward
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-5 p-2 justify-center graficos items-center">
      <CardGenerated total={energyGenerated} moment={energyGenerating} />
      <CardConsume supply={consumedCalculate} />
      <CardEnergy reward={claimReward} supply={tokens} />
    </div>
  );
};

export default Container;
