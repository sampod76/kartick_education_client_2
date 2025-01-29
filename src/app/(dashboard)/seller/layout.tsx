'use client';

import { USER_ROLE } from '@/constants/role';
import { Row, Space, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import dynamic from 'next/dynamic';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useGlobalContext();
  //
  //
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (!userInfo?.role || userInfo?.role !== USER_ROLE.SELLER) {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router, isLoading, userInfo?.role]);

  if (isLoading) {
    return (
      <Row
        justify="center"
        align="middle"
        style={{
          height: '100vh',
        }}
      >
        <Space>
          <Spin size="large"></Spin>
        </Space>
      </Row>
    );
  }

  return <>{children}</>;
};

// export default DashboardLayout;

export default dynamic(() => Promise.resolve(AdminLayout), {
  ssr: false,
});
