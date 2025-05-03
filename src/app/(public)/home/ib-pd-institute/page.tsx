/* eslint-disable react/no-unescaped-entities */
'use client';
import { ENUM_PAGE_BUILDER_TYPE } from '@/components/PageBuilder/interface.pagebuilder';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Empty } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import 'react-h5-audio-player/lib/styles.css';
const DynamicInput = dynamic(() => import('antd/es/input'), { ssr: false });
export default function IBPdInstitute() {
  const { data, isLoading } = useGetAllPageBuilderQuery({
    pageType: ENUM_PAGE_BUILDER_TYPE.iBLossomLearnPDInstitute,
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

// <div className="">
// <div className="">
//   <div className="relative">
//     <Image
//       src={'/CastHero.png'}
//       width={1900}
//       height={750}
//       alt=""
//       className="h-full w-full overflow-auto lg:h-[65vh] lg:w-[100vw]"
//     />
//     <div>
//       <h1
//         //   data-aos="zoom-out"
//         className="absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-[35px] bg-white bg-opacity-50 px-5 py-3 text-center text-xl text-black lg:px-16 lg:text-2xl"
//       >
//         Iblossomlearn P.D Institute
//       </h1>
//     </div>
//   </div>
//   <div className="h-10 bg-primary"></div>
//   <div className="mb-20 flex flex-col items-center justify-center space-y-5 px-5 py-7 text-center lg:space-y-8 lg:px-28 lg:text-xl">
//     <h1 data-aos="zoom-in" className="bodyHeaderText mt-2 lg:mt-6">
//       Iblossomlearn P.D Institute
//     </h1>
//     <p data-aos="zoom-in" className="bodyText lg:pb-2">
//       iBlossomLearn offers a diverse range of professional development courses
//       designed to cater to various fields and interests. Whether you're looking to
//       enhance your business acumen, refine your technical writing skills, or delve
//       into the world of hospitality, iBlossomLearn has you covered. Their courses
//       are meticulously crafted to provide practical knowledge and skills that can be
//       immediately applied in the workplace, ensuring that learners are well-equipped
//       to meet the demands of their respective industries.
//     </p>

//     <CustomImageTag
//       src={
//         'https://d30hkubekb1969.cloudfront.net/upload/images/page11-1733516489362.png'
//       }
//     />

//     <p data-aos="zoom-in" className="bodyText lg:pb-2">
//       Moreover, iBlossomLearn's commitment to personalized learning means that each
//       course is tailored to meet the unique needs of its students. This
//       individualized approach not only fosters a deeper understanding of the subject
//       matter but also encourages continuous professional growth. By investing in
//       iBlossomLearn's professional development courses, individuals can stay ahead
//       in their careers, unlock new opportunities, and achieve their full potential.
//     </p>
//     <CustomImageTag
//       src={
//         'https://d30hkubekb1969.cloudfront.net/upload/images/pasdfdsge11-1733516570519.png'
//       }
//     />
//     <p className="bodyText lg:pb-2">
//       iBlossomLearn provides students with an excellent opportunity to align their
//       learning experience with their career aspirations. By enrolling in courses
//       that are directly relevant to their career goals, students can build a strong
//       foundation of knowledge and skills that will serve them well in their
//       professional journeys. Whether it's gaining insights into the latest business
//       strategies, mastering the art of technical writing, or acquiring essential
//       hospitality management skills, iBlossomLearn’s courses offer a clear pathway
//       to career advancement. This targeted approach ensures that students not only
//       excel academically but also gain the practical expertise needed to thrive in
//       their chosen fields.
//     </p>

//     <Link href={'/course?category=65b7dad8e838e88e3a7b2c11'}>
//       <div
//         data-aos="zoom-out"
//         className="mt-6 w-80 self-center rounded-3xl border-2 border-primary p-1"
//       >
//         <button className="w-full rounded-3xl bg-primary p-2 px-5 text-[12px] text-white lg:text-base">
//           <p className="text-xl">Ready, Set, Go</p>
//         </button>
//       </div>
//     </Link>
//     {/* <Link
//       href={
//         'https://docs.google.com/forms/d/e/1FAIpQLScPZDeLe5XJPpVQMWf6fcET6Y_FhzC97JKbRc_UwOq6-wGfFg/viewform'
//       }
//     >
//       <div
//         data-aos="zoom-out"
//         className="mt-6 w-80 self-center rounded-3xl border-2 border-primary p-1"
//       >
//         <button className="w-full rounded-3xl bg-primary p-2 px-5 text-[12px] text-white lg:text-base">
//           <p className="text-xl">Ready, Set, Create</p>
//         </button>
//       </div>
//     </Link> */}
//   </div>
// </div>
// <SupportDonateHelpDesk />
// </div>
