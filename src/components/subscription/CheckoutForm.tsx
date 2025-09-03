import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { PLAN_DETAILS } from '../../lib/stripe';
import { SubscriptionTier } from '../../types/user';
import { redirectToCheckout } from '../../lib/stripe';

interface CheckoutFormProps {
  userId: string;
  selectedTier: SubscriptionTier;
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  onCancel: () => void;
}

export function CheckoutForm({
  userId,
  selectedTier,
  sessionId,
  isLoading,
  error,
  onCancel,
}: CheckoutFormProps) {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  const planDetails = PLAN_DETAILS[selectedTier];

  // Redirect to Stripe checkout when sessionId is available
  useEffect(() => {
    if (sessionId && !redirecting && !redirectError) {
      const redirect = async () => {
        setRedirecting(true);
        const { error } = await redirectToCheckout(sessionId);
        if (error) {
          setRedirectError(error);
          setRedirecting(false);
        }
      };
      redirect();
    }
  }, [sessionId, redirecting, redirectError]);

  if (isLoading || redirecting) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {redirecting ? 'Redirecting to checkout...' : 'Preparing your checkout...'}
            </h3>
            <p className="text-gray-500 mt-2 text-center">
              Please wait while we set up your subscription.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || redirectError) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Checkout Error</h3>
            <p className="text-red-500 mt-2 text-center">{error || redirectError}</p>
            <div className="mt-6 flex space-x-4">
              <Button variant="outline" onClick={onCancel}>
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Confirm Your Subscription</CardTitle>
        <CardDescription>
          You're subscribing to the {planDetails.name} plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="font-medium">{planDetails.name} Plan</span>
            <span className="text-lg font-bold">${planDetails.price}/month</span>
          </div>

          <div>
            <h4 className="font-medium mb-2">Plan includes:</h4>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p>
              You'll be charged ${planDetails.price} monthly. You can cancel anytime from your
              account settings.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          disabled={!sessionId || redirecting}
        >
          Proceed to Payment
        </Button>
      </CardFooter>
    </Card>
  );
}

