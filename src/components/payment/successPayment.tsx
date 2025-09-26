'use client';
import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';

export default function PaymentSuccessComponent({
  orderNumber = '',
}: {
  orderNumber: string;
}) {
  return (
    <div>
      <Result
        status="success"
        title="Payment Successfully"
        subTitle={`Thank you so much`}
        extra={[
          <Link
            href={`/dashboard`}
            key={'dd'}
            className="rounded bg-green-600 px-3 py-[5px] "
          >
            Go Dashboard
          </Link>,
        ]}
      />
    </div>
  );
}
