/* eslint-disable react/no-unescaped-entities */
'use client';
import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import SupportDonateHelpDesk from '@/components/widgets/SupportDonate';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import 'react-h5-audio-player/lib/styles.css';
const DynamicInput = dynamic(() => import('antd/es/input'), { ssr: false });
export default function CareerOpportunitiesComponents() {
  return (
    <div className="">
      <div className="">
        <div className="relative">
          <Image
            src={'/CastHero.png'}
            width={1900}
            height={750}
            alt=""
            className="h-full w-full overflow-auto lg:h-[65vh] lg:w-[100vw]"
          />
          <div>
            <h1
              //   data-aos="zoom-out"
              className="absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-[35px] bg-white bg-opacity-50 px-5 py-3 text-center text-xl text-black lg:px-16 lg:text-2xl"
            >
              Iblossomlearn P.D Institute
            </h1>
          </div>
        </div>
        <div className="h-10 bg-primary"></div>
        <div className="mb-20 flex flex-col items-center justify-center space-y-5 px-5 py-7 text-center lg:space-y-8 lg:px-28 lg:text-xl">
          <h1 data-aos="zoom-in" className="bodyHeaderText mt-2 lg:mt-6">
            Iblossomlearn P.D Institute
          </h1>
          <p data-aos="zoom-in" className="bodyText lg:pb-2">
            iBlossomLearn offers a diverse range of professional development courses
            designed to cater to various fields and interests. Whether you're looking to
            enhance your business acumen, refine your technical writing skills, or delve
            into the world of hospitality, iBlossomLearn has you covered. Their courses
            are meticulously crafted to provide practical knowledge and skills that can be
            immediately applied in the workplace, ensuring that learners are well-equipped
            to meet the demands of their respective industries.
          </p>

          <CustomImageTag
            src={
              'https://d30hkubekb1969.cloudfront.net/upload/images/page11-1733516489362.png'
            }
          />

          <p data-aos="zoom-in" className="bodyText lg:pb-2">
            Moreover, iBlossomLearn's commitment to personalized learning means that each
            course is tailored to meet the unique needs of its students. This
            individualized approach not only fosters a deeper understanding of the subject
            matter but also encourages continuous professional growth. By investing in
            iBlossomLearn's professional development courses, individuals can stay ahead
            in their careers, unlock new opportunities, and achieve their full potential.
          </p>
          <CustomImageTag
            src={
              'https://d30hkubekb1969.cloudfront.net/upload/images/pasdfdsge11-1733516570519.png'
            }
          />
          <p className="bodyText lg:pb-2">
            iBlossomLearn provides students with an excellent opportunity to align their
            learning experience with their career aspirations. By enrolling in courses
            that are directly relevant to their career goals, students can build a strong
            foundation of knowledge and skills that will serve them well in their
            professional journeys. Whether it's gaining insights into the latest business
            strategies, mastering the art of technical writing, or acquiring essential
            hospitality management skills, iBlossomLearn’s courses offer a clear pathway
            to career advancement. This targeted approach ensures that students not only
            excel academically but also gain the practical expertise needed to thrive in
            their chosen fields.
          </p>

          <Link href={'/course?category=65b7dad8e838e88e3a7b2c11'}>
            <div
              data-aos="zoom-out"
              className="mt-6 w-80 self-center rounded-3xl border-2 border-primary p-1"
            >
              <button className="w-full rounded-3xl bg-primary p-2 px-5 text-[12px] text-white lg:text-base">
                <p className="text-xl">Ready, Set, Go</p>
              </button>
            </div>
          </Link>
          {/* <Link
            href={
              'https://docs.google.com/forms/d/e/1FAIpQLScPZDeLe5XJPpVQMWf6fcET6Y_FhzC97JKbRc_UwOq6-wGfFg/viewform'
            }
          >
            <div
              data-aos="zoom-out"
              className="mt-6 w-80 self-center rounded-3xl border-2 border-primary p-1"
            >
              <button className="w-full rounded-3xl bg-primary p-2 px-5 text-[12px] text-white lg:text-base">
                <p className="text-xl">Ready, Set, Create</p>
              </button>
            </div>
          </Link> */}
        </div>
      </div>
      <SupportDonateHelpDesk />
    </div>
  );
}
