/* eslint-disable react/no-unescaped-entities */
'use client';
import { Empty, message } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import SupportDonateHelpDesk from '../widgets/SupportDonate';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import fileObjectToLink from '@/utils/fileObjectToLink';

export default function CareerOpportunitiesComponents() {
  const { data: pdata, isLoading: ploading } = useGetAllPageBuilderQuery({
    pageType: 'careerOpportunities',
  });
  if (ploading) {
    return <LoadingSkeleton />;
  }
  const value = pdata?.data?.length ? pdata?.data[0] : null;
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
        <div className="space-y-5 px-5 py-7 text-center lg:space-y-6 lg:px-40">
          <h1 className="text-2xl font-bold lg:mt-10 lg:text-4xl">{value.heading}</h1>
          {value?.firstParagraphs?.map((value, i) => {
            const email =
              i === 1 && value?.h1.split(' ').find((words) => words.includes('@'));
            const other =
              i === 1 && value?.h1.split(' ').filter((words) => !words.includes('@'));
            return (
              <p
                key={i}
                data-aos={i % 2 == 0 ? 'zoom-in' : 'zoom-out'}
                className="bodyText "
              >
                {i === 1 && other && other.join(' ')}{' '}
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(email ? email : '');
                    message.success('Email copy your clipboard');
                  }}
                  className="cursor-pointer text-blue-400"
                >
                  {email ? email : ''}
                </span>
                {i !== 1 && value.h1}
              </p>
            );
          })}
          {/* <h3 className="lg:pb-6">
            Submit your CV with a cover to{' '}
            <span
              onClick={() => {
                navigator.clipboard.writeText('hello@iblossomlearn-academy.org');
                message.success('Email copy your clipboard');
              }}
              className="cursor-pointer text-blue-400"
            >
              hello@iblossomlearn-academy.org
            </span>
             
          </h3> */}
        </div>
        <Image
          src={'/banner/careropp2.png'}
          width={1900}
          height={750}
          alt=""
          className="h-full w-[100vw] lg:h-[90vh]"
        />
      </div>
      <SupportDonateHelpDesk />
    </div>
  );
}
