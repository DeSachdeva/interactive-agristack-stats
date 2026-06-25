import React from 'react';
import { 
  Sprout, 
  Umbrella, 
  HandCoins, 
  Wheat, 
  Eye, 
  Coins, 
  Bug, 
  HeartHandshake, 
  Activity, 
  CloudSun, 
  Landmark, 
  CreditCard,
  User,
  Flower,
  Scale
} from 'lucide-react';

const iconMap = {
  Sprout,
  Umbrella,
  HandCoins,
  Wheat,
  Eye,
  Coins,
  Bug,
  HeartHandshake,
  Activity,
  CloudSun,
  Landmark,
  CreditCard,
  User,
  Flower,
  Scale
};

export const ServiceIcon = ({ name, className, size = 24, color }) => {
  const IconComponent = iconMap[name] || Sprout;
  return <IconComponent className={className} size={size} style={{ color }} />;
};
