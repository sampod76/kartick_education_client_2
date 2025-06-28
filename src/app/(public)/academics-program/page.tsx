'use client';
import { ENUM_PAGE_BUILDER_TYPE } from '@/components/PageBuilder/interface.pagebuilder';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Empty } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
//

const AcademicsProgram = () => {
  const { data, isLoading } = useGetAllPageBuilderQuery({
    pageType: ENUM_PAGE_BUILDER_TYPE.academicsProgram,
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
        <div className="">
          <div className="relative">
            <Image
              src={fileObjectToLink(value.bannerImage)}
              width={1900}
              height={750}
              alt=""
              className="h-full w-full overflow-auto bg-cover bg-no-repeat lg:h-[75vh] lg:w-[100vw]"
              unoptimized
            />
            <div>
              {/* Center Heading */}
              <h1 className="absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-[35px] bg-white bg-opacity-50 px-5 py-3 text-center text-xl text-black lg:right-1/2 lg:px-16 lg:text-2xl">
                {value.heading}
              </h1>

              {/* Desktop Buttons */}
              {(value.allBottomLinks?.length ?? 0) > 0 && (
                <div className="hidden lg:absolute left-1/2 top-3/4 w-full -translate-x-1/2 -translate-y-1/2 transform px-5 text-center lg:block">
                  <div className="mx-auto max-w-[1200px] rounded-[35px] bg-white bg-opacity-50 px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-4">
                      {value.allBottomLinks?.map((btn, index) => (
                        <a
                          key={index}
                          href={btn.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-blue-600 px-6 py-2 text-white text-sm lg:text-base hover:bg-blue-700 transition"
                        >
                          {btn.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="h-10 bg-primary"></div>

          {/* Mobile Buttons */}
          {(value?.allBottomLinks?.length ?? 0) > 0 && (
            <div className="block lg:hidden mx-auto max-w-[1200px] rounded-[35px] bg-white bg-opacity-50 px-4 py-4 overflow-x-auto">
              <div className="grid grid-cols-3 gap-3">
                {value.allBottomLinks?.map((btn, index) => (
                  <a
                    key={index}
                    data-aos={index % 2 == 0 ? 'zoom-in' : 'zoom-out'}
                    href={btn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-full bg-blue-600 px-6 py-2 text-white text-sm hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    {btn.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className=" flex flex-col items-center justify-center space-y-5 px-5 py-7 text-center lg:space-y-12 lg:px-28 ">
            <h1
              data-aos="zoom-in"
              className="mt-2 text-3xl font-bold lg:mt-6 lg:text-4xl"
            >
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
                <div className="  self-center  w-fit  mt-6 rounded-3xl p-1 border-2 border-primary">
                  <button className="bg-primary p-2 rounded-3xl px-5  text-[12px] lg:text-base text-white  w-full ">
                    <p className="text-xl">
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
              className="bg-black p-5 py-10 text-start text-white lg:py-10"
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
      </div>
      <SupportDonateHelpDesk />
    </div>
  );
};

export default AcademicsProgram;

// /* eslint-disable react/no-unescaped-entities */
// 'use client';
// import Image from 'next/image';
// import React from 'react';
// import dynamic from 'next/dynamic';
// import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
// import Link from 'next/link';

// const DynamicInput = dynamic(() => import('antd/es/input'), { ssr: false });
// export default function Academicsprogram() {
//   return (
//     <div className="">
//       <div className="">
//         <div className="relative">
//           <Image
//             src={'/banner/academics-program.png'}
//             width={1900}
//             height={750}
//             alt=""
//             className="w-full overflow-auto mx-auto lg:w-[50vw] h-full lg:h-[40vh]"
//           />
//           <div>
//             <h1
//               //   data-aos="zoom-out"
//               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-5 lg:px-14 py-3  rounded-[35px] bg-white bg-opacity-50 w-fit mx-auto text-black whitespace-nowrap text-center text-xl lg:text-2xl"
//             >
//               Academic Program
//             </h1>
//           </div>
//         </div>
//         <div className="h-10 bg-blue-600 "></div>
//         <div className=" mb-20 py-7 space-y-5  text-center px-5 lg:px-28 ">
//           <h1
//             //data-aos="zoom-in"
//             className="bodyHeaderText mt-2 lg:mt-6 "
//           >
//             Academic Program
//           </h1>
//           <p data-aos="zoom-in" className="bodyText lg:pb-6">
//             We believe that a rigorous academic program combined with a supportive social
//             and emotional curriculum leads to scholars’ success. We believe that this
//             should not only happen in Brick N Mortar settings but also in homes with the
//             support of family members. The iBLossomLearn curriculum reflects the best
//             practices that are associated with such ideals for our scholars, while
//             embracing their diverse backgrounds at every level. At iBlossomLearn, we not
//             only allow students to work at their own pace but also address the needs of
//             the whole child. Our partnership with each student is built on timely
//             check-ins, reinforcing the material learned and providing continuous support.
//             This approach nurtures both academic and social-emotional development. With
//             the flexibility to advance at their own speed, students have the opportunity
//             to complete our programs earlier while benefiting from a well-rounded
//             educational experience that focuses on their overall growth.
//           </p>
//           <br />
//           <br />
//         </div>
//         <div
//           className="relative px-5 lg:px-28 text-center bg-cover bg-center bg-no-repeat bg-gray-200 p-8 lg:mt-5 text-white w-full "
//           style={{
//             backgroundImage: "url('/banner/academics-program-bg.png')",
//           }}
//         >
//           <div className=" absolute inset-0 bg-black opacity-5"></div>
//           <div className="py-9">
//             <h1 className="text-xl lg:text-2xl">
//               Continuous Assessment in iBlossomLearn
//             </h1>
//             <p className=" lg:text-lg lg:mt-3">
//               At iBlossomLearn, continuous assessment is integral to our approach,
//               ensuring each student’s progress is closely monitored and supported. Our
//               program includes regular check-ins where data-driven instruction is guided
//               by assessments in core areas like Reading, Writing, and Math. Students
//               undergo four interim assessments annually to measure progress towards
//               grade-level standards. Personalized learning plans are developed based on
//               assessment data, allowing students to work at their own pace while ensuring
//               they meet or exceed academic goals. Additionally, standardized testing
//               provides a comprehensive overview of student mastery and growth.
//             </p>
//           </div>
//           <div className="flex justify-center items-center">
//             <div className="my-6 lg:my-16 space-y-3 lg:space-y-6 ">
//               <div
//                 data-aos="zoom-out"
//                 className=" self-center bg-[#5373fe] w-96 rounded-3xl p-1 border-2 border-primary"
//               >
//                 <Link
//                   href={'/home/iblossom-private-academy'}
//                   className=" p-2   rounded-3xl px-5   text-white  w-full text-base lg:text-xl whitespace-nowrap"
//                 >
//                   <p className=" text-base lg:text-xl whitespace-nowrap ">
//                     iBLossomLearn Private School
//                   </p>
//                 </Link>
//               </div>
//               <div
//                 data-aos="zoom-out"
//                 className=" self-center w-96 bg-[#5373fe] rounded-3xl p-1 border-2 border-primary"
//               >
//                 <Link
//                   href={'/home/flex-accredited'}
//                   className=" p-2   rounded-3xl px-5   text-white  w-full "
//                 >
//                   <p className=" text-base lg:text-xl whitespace-nowrap">
//                     iBLossomLearn Flex Accredited K12
//                   </p>
//                 </Link>
//               </div>
//               <div
//                 data-aos="zoom-out"
//                 className=" self-center w-96 bg-[#5373fe] rounded-3xl p-1 border-2 border-primary"
//               >
//                 <Link
//                   href={'/home/ibinstitute'}
//                   className=" p-2   rounded-3xl px-5   text-white  w-full "
//                 >
//                   <p className=" text-base lg:text-xl whitespace-nowrap">
//                     iBLossomLearn Language Institute
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <SupportDonateHelpDesk />
//     </div>
//   );
// }
