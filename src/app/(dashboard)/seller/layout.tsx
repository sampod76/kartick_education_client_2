'use client';

import { USER_ROLE } from '@/constants/role';
import { getUserInfo } from '@/services/auth.service';
import { Row, Space, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const userInfo: any = getUserInfo();
  //
  //
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (!userInfo?.role && userInfo?.role !== USER_ROLE.SELLER) {
      router.push('/login');
    } else if (userInfo?.role !== USER_ROLE.SELLER) {
      router.back();
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
