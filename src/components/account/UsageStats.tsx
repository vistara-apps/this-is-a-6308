import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { Loader2, Image, Wand2, Download } from 'lucide-react';
import { SubscriptionTier } from '../../types/user';

interface UsageStatsProps {
  userId: string;
  userTier: SubscriptionTier;
}

interface UsageStat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  used: number;
  limit: number;
  unlimited?: boolean;
}

export function UsageStats({ userId, userTier }: UsageStatsProps) {
  const [stats, setStats] = useState<UsageStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demo purposes
  useEffect(() => {
    const fetchUsageStats = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Define limits based on tier
      const limits = {
        free: {
          exports: 10,
          backgroundRemovals: 5,
          storage: 100, // MB
        },
        pro: {
          exports: 100,
          backgroundRemovals: 50,
          storage: 1000, // MB
        },
        premium: {
          exports: -1, // unlimited
          backgroundRemovals: -1, // unlimited
          storage: 10000, // MB
        },
      };
      
      const tierLimits = limits[userTier];
      
      // Mock usage stats
      const mockStats: UsageStat[] = [
        {
          id: 'exports',
          name: 'Exports',
          description: 'Number of designs exported this month',
          icon: <Download className="w-5 h-5 text-blue-500" />,
          used: 3,
          limit: tierLimits.exports,
          unlimited: tierLimits.exports === -1,
        },
        {
          id: 'backgroundRemovals',
          name: 'Background Removals',
          description: 'AI background removals used this month',
          icon: <Wand2 className="w-5 h-5 text-purple-500" />,
          used: 2,
          limit: tierLimits.backgroundRemovals,
          unlimited: tierLimits.backgroundRemovals === -1,
        },
        {
          id: 'storage',
          name: 'Storage',
          description: 'Storage space used for your designs and assets',
          icon: <Image className="w-5 h-5 text-green-500" />,
          used: 25, // MB
          limit: tierLimits.storage,
        },
      ];
      
      setStats(mockStats);
      setIsLoading(false);
    };
    
    fetchUsageStats();
  }, [userId, userTier]);
  
  const formatUsage = (stat: UsageStat) => {
    if (stat.id === 'storage') {
      return `${stat.used} MB / ${stat.unlimited ? 'Unlimited' : `${stat.limit} MB`}`;
    }
    return `${stat.used} / ${stat.unlimited ? 'Unlimited' : stat.limit}`;
  };
  
  const calculatePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // For unlimited
    return Math.min(Math.round((used / limit) * 100), 100);
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>
          Monitor your usage and limits for the current billing period
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {stats.map((stat) => {
              const percentage = calculatePercentage(stat.used, stat.limit);
              const progressColor = getProgressColor(percentage);
              
              return (
                <div key={stat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">{stat.icon}</div>
                      <div>
                        <h4 className="font-medium">{stat.name}</h4>
                        <p className="text-sm text-gray-500">{stat.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatUsage(stat)}</div>
                      {!stat.unlimited && (
                        <p className="text-xs text-gray-500">
                          {percentage}% used
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {!stat.unlimited && (
                    <Progress
                      value={percentage}
                      className="h-2"
                      indicatorClassName={progressColor}
                    />
                  )}
                </div>
              );
            })}
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
              <p>
                {userTier === 'free'
                  ? 'Upgrade to Pro or Premium for higher usage limits and additional features.'
                  : userTier === 'pro'
                  ? 'Upgrade to Premium for unlimited exports and background removals.'
                  : 'You are on the Premium plan with the highest usage limits.'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

