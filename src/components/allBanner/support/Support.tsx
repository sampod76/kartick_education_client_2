/* eslint-disable react/no-unescaped-entities */
'use client';
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
import { useGetAllMemberQuery } from '@/redux/api/adminApi/memberApi';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import { useDebounced } from '@/redux/hooks';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Empty } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { RiMessage2Fill } from 'react-icons/ri';
export default function SupportCom() {
  const { userInfo } = useGlobalContext();
  const router = useRouter();
  const pathName = usePathname();

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>('serial_number');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = 'active';
  query['memberType'] = 'boardOfTrustees';
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  //
  const { data: pdata, isLoading: ploading } = useGetAllPageBuilderQuery({
    pageType: 'boardOrTrustees',
  });
  const { data, isLoading } = useGetAllMemberQuery(query);
  if (ploading) {
    return <LoadingSkeleton />;
  }
  const value = pdata?.data?.length ? pdata?.data[0] : null;
  const Administartions = data?.data || [];
  if (!value) {
    return <Empty></Empty>;
  }
  return (
    <div className="">
      <div className="">
        <div className="relative">
          <Image
            src={fileObjectToLink(value.bannerImage)}
            width={1900}
            height={750}
            alt=""
            className="h-full w-full overflow-auto lg:h-[50vh] lg:w-[100vw]"
          />
          <h1 className="absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-[35px] bg-white bg-opacity-50 px-5 py-3 text-xl text-black lg:px-10 lg:text-2xl">
            {value.heading}
          </h1>
        </div>
        <div className="h-10 bg-primary"></div>
        <div className="mb-20 flex flex-col items-center justify-center space-y-5 px-5 py-7 text-center lg:space-y-12 lg:px-28">
          <h1 data-aos="zoom-in" className="bodyHeaderText mt-2 lg:mt-6">
            {value.heading}
          </h1>
          {value?.firstParagraphs?.map((value, i) => {
            return (
              <p
                key={i}
                data-aos={i % 2 == 0 ? 'zoom-in' : 'zoom-out'}
                className="bodyText lg:pb-6"
              >
                {value?.h1}
              </p>
            );
          })}
        </div>
        <div>
          <div>
            <div className="space-y-2 bg-black px-5 py-4 text-white lg:py-10">
              <h1 className="bodyHeaderText text-center">Officers of the Board</h1>
              <p data-aos="zoom-in" className="text-center text-xl">
                {value.firstItemTitle}
              </p>

              <div className="bodyText flex justify-center">
                <ul className="mx-auto w-fit list-inside list-disc space-y-2 py-4 text-xl">
                  {value?.firstItems?.map((value, i) => {
                    let strongText = '';
                    let remaning = '';
                    const valueSprite = value?.h1?.split(':');

                    if (valueSprite?.length > 0) {
                      strongText = valueSprite[0];
                      remaning = valueSprite.splice(1).join(':');
                    }
                    return (
                      <li
                        key={i}
                        data-aos={i % 2 == 0 ? 'zoom-in' : 'zoom-out'}
                        className=""
                      >
                        <strong>{strongText} : </strong>
                        <strong>{remaning}</strong>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="px-10">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="flex flex-wrap justify-center gap-10 py-[30px]">
                {Administartions?.map((item: any, index: any) => {
                  return (
                    <div
                      data-aos={index % 2 == 0 ? 'zoom-in' : 'zoom-out'}
                      // data-aos={index % 2 == 0 ? "flip-right" : "flip-left"}
                      key={index}
                      className="flex max-h-[500px] max-w-[290px] flex-col items-center justify-start rounded-xl bg-[#e4dfdf] pb-7 text-center shadow-lg"
                    >
                      <div className="">
                        <CustomImageTag
                          src={item?.image}
                          alt=""
                          width={900}
                          height={900}
                          className="h-52 rounded-t-xl bg-cover"
                        />
                      </div>
                      {/* <div>
                        {userInfo?.userId &&
                        userInfo?.userId !== '65bf7cd4ab18ffccd57fb09f' ? (
                          <Link
                            href={`/${userInfo?.role}/chat?friendUserId=${'65bf7cd4ab18ffccd57fb09f'}`}
                            className="flex items-center gap-2"
                          >
                            <RiMessage2Fill />
                            Message
                          </Link>
                        ) : (
                          <button
                            className="flex items-center gap-2"
                            onClick={() => {
                              if (userInfo?.id !== '65bf7cd4ab18ffccd57fb09f') {
                                router.push(`/login?redirect=${pathName}`);
                              }
                            }}
                          >
                            <RiMessage2Fill />
                            Message
                          </button>
                        )}
                      </div> */}
                      <div
                        className={`${(userInfo?.id === item?.userId || !item?.userId) && 'hidden'}`}
                      >
                        {userInfo?.userId ? (
                          <Link
                            href={`/${userInfo?.role}/chat?friendUserId=${item?.userId}`}
                            className="flex items-center gap-2"
                          >
                            <RiMessage2Fill />
                            Message
                          </Link>
                        ) : (
                          <button
                            className="flex items-center gap-2"
                            onClick={() => {
                              if (userInfo?.id !== '657e0613cf50ca51e691ce92') {
                                router.push(`/login?redirect=${pathName}`);
                              }
                            }}
                          >
                            <RiMessage2Fill />
                            Message
                          </button>
                        )}
                      </div>
                      <div className="my-2 px-5">
                        <h4 className="text-lg font-bold"> {item?.title}</h4>
                        <h5>{item?.sub1}</h5>
                        <h5 className="my-2">{item?.sub2}</h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div data-aos="zoom-out" className="my-10 px-5 lg:my-16 lg:px-28">
            <p className="bodyText text-center">
              {value?.secondParagraphs?.map((value, i) => {
                return (
                  <p
                    key={i}
                    data-aos={i % 2 == 0 ? 'zoom-in' : 'zoom-out'}
                    className="bodyText lg:pb-6"
                  >
                    {value?.h1}
                  </p>
                );
              })}
            </p>
          </div>
        </div>
      </div>
      <SupportDonateHelpDesk />
    </div>
  );
}
