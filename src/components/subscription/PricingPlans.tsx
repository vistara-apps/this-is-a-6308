import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Check, Crown, X } from 'lucide-react';
import { PLAN_DETAILS } from '../../lib/stripe';
import { SubscriptionTier } from '../../types/user';

interface PricingPlansProps {
  currentTier: SubscriptionTier;
  onSelectPlan: (tier: SubscriptionTier) => void;
  isLoading?: boolean;
}

export function PricingPlans({ currentTier, onSelectPlan, isLoading = false }: PricingPlansProps) {
  const plans = Object.entries(PLAN_DETAILS).map(([key, plan]) => ({
    id: key as SubscriptionTier,
    ...plan,
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-2 text-gray-600">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentTier === plan.id;
          const isPremium = plan.id === 'premium';

          return (
            <Card
              key={plan.id}
              className={`flex flex-col ${
                isPremium ? 'border-purple-500 shadow-lg relative overflow-hidden' : ''
              }`}
            >
              {isPremium && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  BEST VALUE
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center">
                  {plan.id === 'premium' && <Crown className="w-5 h-5 mr-2 text-purple-500" />}
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    isPremium ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  {isLoading
                    ? 'Loading...'
                    : isCurrentPlan
                    ? 'Current Plan'
                    : `Upgrade to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          All plans include a 14-day free trial. No credit card required for free tier.
          <br />
          You can cancel or change your plan at any time.
        </p>
      </div>
    </div>
  );
}

