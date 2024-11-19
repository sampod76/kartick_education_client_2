'use client';
import { AllImage } from '@/assets/AllImge';
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import { Button, Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomImageTag from '../CustomTag/CustomImageTag';
const UserAvatarUI = () => {
  const router = useRouter();
  const { setRefetch, userInfo } = useGlobalContext();
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href={'/profile'}> Profile</Link>,
    },
    {
      key: '1sdf',
      label: (
        <Link href={`/profile/update/${userInfo?.roleBaseUserId}?role=${userInfo?.role}`}>
          {' '}
          Update Profile
        </Link>
      ),
    },
    {
      key: '55',
      label: <Link href={'/change-password'}> Change password</Link>,
    },
    {
      key: '2',
      label: <Link href={'/dashboard'}>Dashboard</Link>,
    },

    {
      key: '6',
      label: (
        <Button
          onClick={() => {
            localStorage.clear();
            setRefetch((c) => !c);
            router.push('/login');
          }}
          type="default"
          style={{ color: 'black' }}
        >
          Log out
        </Button>
      ),
    },
  ];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        // marginLeft: "24px",
      }}
    >
      <Link href={`/${userInfo?.role}/chat`}>
        <CustomImageTag className="w-10" src={'/chaticon.png'} width={100} height={100} />
      </Link>
      <Dropdown
        menu={{ items }}
        overlayStyle={{
          minWidth: '100px',
        }}
      >
        <button style={{ opacity: '0px' }} className="">
          {/* <Avatar
            style={{
              fontSize: "",
              color: "black",
            }}
            size={50}
            icon={}
          /> */}
          <Image
            src={userInfo?.img || AllImage.profileAvater || ''}
            width={550}
            height={550}
            className="h-8 w-8 rounded-full md:h-12 md:w-12"
            alt=""
          />
        </button>
      </Dropdown>
    </div>
  );
};

export default UserAvatarUI;

// export default dynamic(() => Promise.resolve(UserAvatarUI), {
//   ssr: false,
// });
