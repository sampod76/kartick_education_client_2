'use client';
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import { USER_ROLE } from '@/constants/role';
import { isLoggedIn } from '@/services/auth.service';
import { Row, Space, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const userLoggedIn = isLoggedIn();
  const { userInfo } = useGlobalContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (!userInfo?.role) {
      router.push('/login');
    } else if (userInfo?.role !== USER_ROLE.ADMIN) {
      router.back();
    }
    setIsLoading(false);
  }, [router, isLoading, userLoggedIn, userInfo?.role]);

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

export default AdminLayout;

// export default dynamic(() => Promise.resolve(AdminLayout), {
//   ssr: false,
// });
