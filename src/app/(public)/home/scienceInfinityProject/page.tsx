'use client';
import { ENUM_PAGE_BUILDER_TYPE } from '@/components/PageBuilder/interface.pagebuilder';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Empty } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

export default function ScienceInfinityProject() {
  const { data, isLoading } = useGetAllPageBuilderQuery({
    pageType: ENUM_PAGE_BUILDER_TYPE.scienceInfinityProject,
  });
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  const value = data?.data?.length ? data?.data[0] : null;
  if (!value) {
    return <Empty></Empty>;
  }
  return (
    <div className="">
      <div className="">
        <div className="relative">
          <Image
            // src={'/banner/about-us.png'}
            src={fileObjectToLink(value.bannerImage)}
            width={1900}
            height={750}
            alt=""
            className="h-full w-full overflow-auto bg-cover bg-no-repeat lg:h-[75vh] lg:w-[100vw]"
            unoptimized
          />
          <div>
            <h1
              //   data-aos="zoom-out"
              className="absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-[35px] bg-white bg-opacity-50 px-5 py-3 text-center text-xl text-black lg:right-1/2 lg:px-16 lg:text-2xl"
            >
              {/* About Us */}
              {value.heading}
            </h1>
          </div>
        </div>
        <div className="h-10 bg-primary"></div>
        <div className=" flex flex-col items-center justify-center space-y-5 px-5 py-7 text-center lg:space-y-12 lg:px-28 ">
          <h1 data-aos="zoom-in" className="mt-2 text-3xl font-bold lg:mt-6 lg:text-4xl">
            {/* About Us */}
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
        {value?.actionButton?.link && (
          <div className="flex justify-center items-center ">
            <Link href={value?.actionButton?.link} target="_blank">
              <div className="  self-center  w-fit mt-6 rounded-3xl p-1 border-2 border-primary">
                <button className="bg-primary p-2 rounded-3xl px-5  text-[12px] lg:text-base text-white  w-full ">
                  <p className="text-xl">
                    {' '}
                    {value?.actionButton?.title || 'Ready, Set, Go'}
                  </p>
                </button>
              </div>
            </Link>
          </div>
        )}
        {value?.firstItems?.length ? (
          <div
            // data-aos="zoom-out"
            className="bg-black p-5 py-10 text-start text-white lg:py-24"
          >
            <ul className="list-outside list-disc space-y-5 px-5 text-lg lg:px-28 2xl:text-xl">
              <h1 data-aos="zoom-in">{value.firstItemTitle}</h1>
              {value?.firstItems?.map((value, i) => {
                let strongText = '';
                let remaning = '';
                const valueSprite = value?.h1?.split(':');

                if (valueSprite?.length > 0) {
                  strongText = valueSprite[0];
                  remaning = valueSprite.splice(1).join(':');
                }
                return (
                  <li key={i} data-aos={i % 2 == 0 ? 'zoom-in' : 'zoom-out'} className="">
                    <strong>{strongText} : </strong>
                    <strong>{remaning}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
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
      <SupportDonateHelpDesk />
    </div>
  );
}
