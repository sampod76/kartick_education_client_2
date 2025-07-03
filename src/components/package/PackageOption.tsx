'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllPackagesV2Query } from '@/redux/api/public/packageV2';
import { useGetPurchasePackageLinkMutation } from '@/redux/api/public/paymentApi';
import { Button, message } from 'antd';
import { useState } from 'react';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';

export default function PackageBuilderPage() {
  const { data, isLoading } = useGetAllPackagesV2Query({ status: 'active' });
  const apiData = data?.data || [];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <DynamicPackageOptions packages={apiData} />
    </div>
  );
}

function DynamicPackageOptions({ packages }: { packages: any[] }) {
  const [purchasePackage, { isLoading }] = useGetPurchasePackageLinkMutation();
  const [selected, setSelected] = useState<{
    grade: string;
    type: string;
    packageId: string;
    planId: string;
  } | null>(null);

  const isSelected = (grade: string, type: string) =>
    selected?.grade === grade && selected?.type === type;

  const handleSelect = (
    grade: string,
    type: string,
    packageId: string,
    planId: string,
  ) => {
    setSelected({ grade, type, packageId, planId });
  };

  const handlePayment = async () => {
    try {
      if (!selected) return;

      const { packageId, planId } = selected;
      console.log('🚀 Sending to payment:', { packageId, planId });

      const response = await purchasePackage({
        packageId,
        planId,
        annualTestingFee: 185, // fixed fee
      }).unwrap();

      console.log('✅ Payment URL:', response.url);

      const popup = window.open(
        response.url,
        'PaymentPopup',
        'width=500,height=700,top=100,left=200,scrollbars=yes',
      );

      if (!popup) {
        message.error('Popup blocked! Please allow popups in your browser.');
        return;
      }

      // Listen for success message from popup
      const messageHandler = (event: MessageEvent) => {
        // ✅ Replace with your actual domain!
        console.log(event.data, event.origin);
        const allowedOrigin = 'https://your-main-domain.com';

        if (event.origin !== allowedOrigin) return;

        if (event.data === 'payment-success') {
          console.log('🎉 Payment completed!');
          popup.close();
          window.removeEventListener('message', messageHandler);
          message.success('Payment Successful! 🎉');
          // You can redirect or update UI here
        }
      };

      window.addEventListener('message', messageHandler);
    } catch (error) {
      console.error('❌ Error during payment:', error);
      message.error('Error during payment');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-sm">
      <div className="bg-green-100 text-green-800 text-center p-2 rounded-md font-semibold">
        🎓 Registration Fee: $185 (Annual Testing fees included)
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages?.map((pkg) => (
          <Card key={pkg._id} className="border shadow rounded-xl">
            <CardContent className="space-y-4 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold">{pkg.label}</h3>
                <Badge>{pkg.badge}</Badge>
              </div>

              <div className="space-y-3">
                {pkg.plans.map((opt: any) => {
                  const isDisabled = opt.status === 'inactive';
                  const selected = isSelected(pkg.grade, opt.type);

                  return (
                    <label
                      key={opt.planId}
                      className={`flex items-start gap-3 border rounded p-3 transition text-sm ${
                        selected
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-white border-gray-300'
                      } ${!isDisabled ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
                    >
                      <input
                        type="radio"
                        name={`plan-${pkg.grade}`}
                        value={opt.type}
                        disabled={isDisabled}
                        checked={selected}
                        onChange={() =>
                          !isDisabled &&
                          handleSelect(pkg.grade, opt.type, pkg._id, opt.planId)
                        }
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />
                      <div className="w-full">
                        <p className="font-medium">{opt.type}</p>
                        <p className="text-xs text-gray-800">
                          {opt.billing === 'monthly'
                            ? `$${opt.amount}/month`
                            : opt.billing === 'yearly'
                              ? `$${opt.amount}/year`
                              : `One-time $${opt.amount}`}
                        </p>
                        <p className="text-xs text-gray-500">{opt.note}</p>
                        {opt.email && (
                          <p className="text-xs text-gray-400 pt-2 border-t mt-2">
                            📧 {opt.email}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="text-center pt-6">
          <Button type="primary" size="large" onClick={handlePayment}>
            🔐 Proceed to Payment
          </Button>
        </div>
      )}
    </div>
  );
}
