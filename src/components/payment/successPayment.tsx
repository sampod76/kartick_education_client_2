'use client';
import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';

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
            href={'/'}
            key={'dd'}
            className="rounded bg-green-600 px-3 py-[5px] text-white"
          >
            Go Home
          </Link>,
          <Button key="buy">Buy Again</Button>,
        ]}
      />
    </div>
  );
}
