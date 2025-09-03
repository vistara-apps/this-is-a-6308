import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Check, Crown, AlertCircle, ExternalLink } from 'lucide-react';
import { PLAN_DETAILS } from '../../lib/stripe';
import { SubscriptionTier } from '../../types/user';

interface SubscriptionManagerProps {
  userId: string;
  currentTier: SubscriptionTier;
  currentPeriodEnd?: string;
  isLoading: boolean;
  onManageSubscription: () => void;
  onCancelSubscription: () => Promise<boolean>;
}

export function SubscriptionManager({
  userId,
  currentTier,
  currentPeriodEnd,
  isLoading,
  onManageSubscription,
  onCancelSubscription,
}: SubscriptionManagerProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const planDetails = PLAN_DETAILS[currentTier];
  const isPaidTier = currentTier !== 'free';

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    setCancelError(null);
    
    try {
      const success = await onCancelSubscription();
      if (success) {
        setCancelSuccess(true);
      } else {
        setCancelError('Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      setCancelError('An unexpected error occurred. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                {currentTier === 'premium' && (
                  <Crown className="w-5 h-5 mr-2 text-purple-500" />
                )}
                {planDetails.name} Plan
              </CardTitle>
              <CardDescription>
                {isPaidTier
                  ? `Your subscription renews on ${formatDate(currentPeriodEnd)}`
                  : 'Free tier with limited features'}
              </CardDescription>
            </div>
            <div className="text-2xl font-bold">${planDetails.price}/mo</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">Your plan includes:</h4>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isPaidTier ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                disabled={isLoading}
              >
                Cancel Subscription
              </Button>
              <Button
                onClick={onManageSubscription}
                disabled={isLoading}
                className="flex items-center"
              >
                Manage Subscription
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={onManageSubscription}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Upgrade Your Plan
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your {planDetails.name} subscription?
            </DialogDescription>
          </DialogHeader>

          {cancelSuccess ? (
            <div className="py-4 text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Subscription Cancelled
              </h3>
              <p className="text-gray-500">
                Your subscription has been cancelled. You'll have access to premium features until the end of your current billing period.
              </p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 text-sm">
                        You'll lose access to premium features at the end of your current billing period on{' '}
                        <strong>{formatDate(currentPeriodEnd)}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {cancelError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{cancelError}</p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  disabled={cancelLoading}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

