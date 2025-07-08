'use client';
import { authKey } from '@/constants/storageKey';
import { getUserInfo, IDecodedInfo } from '@/services/auth.service';
import { getFromLocalStorage } from '@/utils/local-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
export const GlobalContext = createContext({});
export const useGlobalContext = () => {
  return useContext(GlobalContext) as IContextType;
};
export type IContextType = {
  userInfo: Partial<IDecodedInfo> | null | undefined;
  userInfoLoading: boolean;
  token: string | null;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function GlobalContextApi({ children }: { children: React.ReactNode }) {
  // const userInfo = getUserInfo() as any;
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<Partial<IDecodedInfo>>({
    email: '',
    id: '',
    role: undefined,
  });
  const [refetch, setRefetch] = useState(false);

  // const memoizedFetchUserInfo = useMemo(
  //   () => async () => {
  //     const userInfo = await getUserInfo();
  //     setUserInfo(userInfo);
  //     setUserInfoLoading(false);
  //   },
  //   []
  // ); // Empty dependency array means this function will be memoized once

  // useEffect(() => {
  //   // Call the memoized function to fetch user info asynchronously
  //   memoizedFetchUserInfo();
  // }, [memoizedFetchUserInfo]);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUserInfo(userInfo);
    setUserInfoLoading(false);
  }, [refetch]);

  const value: IContextType = {
    userInfo,
    userInfoLoading,
    setRefetch,
    token: getFromLocalStorage(authKey),
  };
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}
