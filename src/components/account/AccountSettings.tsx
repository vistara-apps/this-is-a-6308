import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { SubscriptionManager } from '../subscription/SubscriptionManager';
import { BillingHistory } from './BillingHistory';
import { UsageStats } from './UsageStats';
import { User } from '../../types/user';
import { useSubscription } from '../../hooks/useSubscription';

interface AccountSettingsProps {
  user: User;
  onUpdateProfile: (updates: Partial<Omit<User, 'id' | 'email'>>) => Promise<void>;
}

export function AccountSettings({ user, onUpdateProfile }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  
  const {
    tier,
    currentPeriodEnd,
    isLoading,
    openCustomerPortal,
    cancelUserSubscription,
  } = useSubscription();
  
  const handleManageSubscription = async () => {
    const portalUrl = await openCustomerPortal(user.id);
    if (portalUrl) {
      window.open(portalUrl, '_blank');
    }
  };
  
  const handleCancelSubscription = async () => {
    return await cancelUserSubscription(user.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and subscription</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings user={user} onUpdateProfile={onUpdateProfile} />
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionManager
            userId={user.id}
            currentTier={tier || user.subscription_tier}
            currentPeriodEnd={currentPeriodEnd}
            isLoading={isLoading}
            onManageSubscription={handleManageSubscription}
            onCancelSubscription={handleCancelSubscription}
          />
        </TabsContent>
        
        <TabsContent value="billing">
          <BillingHistory userId={user.id} />
        </TabsContent>
        
        <TabsContent value="usage">
          <UsageStats userId={user.id} userTier={user.subscription_tier} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

