'use client';
import { ENUM_PAGE_BUILDER_TYPE } from '@/components/PageBuilder/interface.pagebuilder';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Empty } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const FlexAccredited = () => {
  const { data, isLoading } = useGetAllPageBuilderQuery({
    pageType: ENUM_PAGE_BUILDER_TYPE.flexAccreditedK12,
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
            </div>
          </div>

          {/* Spacer */}
          <div className="h-10 bg-primary"></div>

          {/* Mobile Buttons */}
          <div className="block lg:hidden mx-auto max-w-[1200px] rounded-[35px] bg-white bg-opacity-50 px-4 py-4 overflow-x-auto">
            <div className="grid grid-cols-3 gap-3">
              {value.allBottomLinks?.map((btn, index) => (
                <a
                  key={index}
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
        <div className="-mt-16 flex flex-col items-center">
          <div className="w-full bg-black text-white">
            <div className="container mx-auto py-6 lg:py-12">
              <div className="flex flex-wrap items-center justify-around gap-3">
                <div className="w-fit rounded-3xl border-2 border-primary p-1 text-lg text-white">
                  <button className="rounded-3xl bg-primary p-1 px-12">
                    <Link href={'/word-wonders'}>iblossom Word wonders</Link>
                  </button>
                </div>
                <div className="w-fit rounded-3xl border-2 border-primary p-1 text-lg text-white">
                  <button className="rounded-3xl bg-primary p-1 px-12">
                    <Link href={'/comprehensive'}>iblossom Comprehensive</Link>
                  </button>
                </div>
                <div className="w-fit rounded-3xl border-2 border-primary p-1 text-lg text-white">
                  <button className="rounded-3xl bg-primary p-1 px-12">
                    <Link href={'/essential-pathways'}>iblossom Essential Pathways</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SupportDonateHelpDesk />
    </div>
  );
};

export default FlexAccredited;

/* 
<div>
      <CustomeHero title={"Flex Accredited K12"} image={"/flexBanner.jpeg"} />
      <div className="sm:container mx-auto py-[30px] p-2 font-semibold font-serif">
        <p className="leading-8 text-center">
          {
            "Flex Education is an excellent approach to homeschool independently. It offers a flexible, personalized learning experience that allows students to progress at their own pace while receiving comprehensive support tailored to their individual needs."
          }
          {
            "At iBlossomLearn, we provide K-12 learners with an accredited core curriculum ensuring all educational bases are covered. Our self-paced classes allow your child to progress at their own speed, whether fast or slow. In addition to our affordable core program, we offer various electives and language courses as add-ons at a low cost. Students earn their high school diploma upon completion, which serves as proof of their eligibility to attend college or pursue another area of study."
          }
          {
            "We partner with parents to support the unique homeschooling journey, whether it's traditional homeschooling, roadschooling, worldschooling, unschooling, eclectic homeschooling, classical homeschooling, Montessori homeschooling, or homeschooling with unit studies. iBlossomLearn Flex  ensures a personalized and flexible educational experience for your child."
          }
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="p-1 text-lg  text-white border-2 border-primary w-fit rounded-3xl">
          <button className="bg-primary p-1 px-12 rounded-3xl">
            iBLossomLearn Flex K12
          </button>
        </div>
        <div className="sm:container mx-auto py-[30px] p-2 font-semibold font-serif">
          <p className="leading-8 text-center">
            {
              "Perfect for Traveling Students Stay on top of your young learner’s core classes, electives, and state testing while traveling anywhere in the USA or around the world. All you need is access to our curriculum."
            }
            {
              "Ideal for Unschoolers iBlossomLearn provides engaging courses that keep your child ready to learn more, while allowing their educational passion to shine. Our electives cater to your child’s unique learning path."
            }
          </p>
        </div>
        <div className="bg-black w-full text-white ">
          <div className="py-6 lg:py-12 container mx-auto">
            <div className="flex flex-wrap justify-around items-center gap-3">
              <div className="p-1 text-lg  text-white border-2 border-primary w-fit rounded-3xl">
                <button className="bg-primary p-1 px-12 rounded-3xl">
                  <Link href={"/word-wonders"}>iblossom Word wonders</Link>
                </button>
              </div>
              <div className="p-1 text-lg  text-white border-2 border-primary w-fit rounded-3xl">
                <button className="bg-primary p-1 px-12 rounded-3xl">
                  <Link href={"/comprehensive"}>iblossom Comprehensive</Link>
                </button>
              </div>
              <div className="p-1 text-lg  text-white border-2 border-primary w-fit rounded-3xl">
                <button className="bg-primary p-1 px-12 rounded-3xl">
                  <Link href={"/essential-pathways"}>
                    iblossom Essential Pathways
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

*/
