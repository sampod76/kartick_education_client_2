/* eslint-disable react/no-unescaped-entities */
import aboutOwner from '@/assets/about/about_Owner.jpeg';
import aboutCourse1 from '@/assets/about/aboutCourse1.png';
import aboutCourse2 from '@/assets/about/aboutCourse2.png';
import aboutCourse3 from '@/assets/about/aboutCourse3.png';
import CustomeHero from '@/components/widgets/CustomeHero';
import {
  DollarOutlined,
  FieldTimeOutlined,
  FileDoneOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const aboutFooterData = [
    {
      title: 'Affordable Tuition',
      description:
        'IBLossomLearn’s affordable tuition allows families to have a full-stack program with a variety of discounted tuition rates and payment plans. Our interest-free payment plans offer affordability to almost all families. Our goal is to provide an affordable, quality education to any student that desires the opportunity to succeed. Our admission specialist will be sure to inform you of all your options, allowing you to choose the one that is most comfortable for you.',
      icon: (
        <DollarOutlined
          style={{
            fontSize: '1rem',
            padding: '8px',
            border: '2px solid black',
            borderRadius: '50%',
          }}
        />
      ),
    },
    {
      title: 'Enroll Anytime, Anywhere',
      description:
        'In our Online program, you can begin at Any time and from Any location that has Internet access. We will ship everything directly to you if you are a member of our Book Program.',
      icon: (
        <FileDoneOutlined
          style={{
            fontSize: '1rem',
            padding: '8px',
            border: '2px solid black',
            borderRadius: '50%',
          }}
        />
      ),
    },
    {
      title: 'Flexible Schedule',
      description:
        "Our parents have the freedom to set their children's school schedules in a way that fits their demanding daily routines.",
      icon: (
        <FieldTimeOutlined
          style={{
            fontSize: '1rem',
            padding: '8px',
            border: '2px solid black',
            borderRadius: '50%',
          }}
        />
      ),
    },
    {
      title: 'Flexible Program Structure',
      description:
        "Our parents have the freedom to set their children's school schedules in a way that fits their demanding daily routines.",
      icon: (
        <SolutionOutlined
          style={{
            fontSize: '1rem',
            padding: '8px',
            border: '2px solid black',
            borderRadius: '50%',
          }}
        />
      ),
    },
  ];

  const aboutCourseData = [
    {
      title: 'Explore Your Creative Side!',
      description:
        'Our art and craft ideas are perfect for parents and teachers of kids of all ages. E.g. baby handprint art, toddler craft projects, preschool art and craft ideas, kindergarten art based learning resources and many more art and craft ideas to inspire creativity and have fun!',
      img: aboutCourse1,
    },
    {
      title: 'Discover Fun Activities In Culinary Arts',
      description:
        'Our art and craft ideas are perfect for parents and teachers of kids of all ages. E.g. baby handprint art, toddler craft projects, preschool art and craft ideas, kindergarten art based learning resources and many more art and craft ideas to inspire creativity and have fun!',
      img: aboutCourse2,
    },
    {
      title: 'Stories Podcast',
      description:
        "Stories play a powerful role in our culture. they do not just entertain and inform us. they are tools to create connections between people. so it's no surprise that we wanted to bring some of your favorite narratives. Enjoy recorded sessions 24 hours per day.",
      img: aboutCourse3,
    },
  ];
  return (
    // <div>
    //   {/* about banner */}
    //   {/* <div className="-mt-[6.8rem] mb-4 lg:mb-6 ">
    //     <div className="w-full min-h-[7rem] bg-[#BEDDF9]"></div>
    //     <BannerAbout />
    //   </div> */}

    //   {/* about hero  */}
    //   {/* <div className="flex flex-wrap-reverse items-center lg:flex justify-between mt-2 lg:mt-[4rem]  xl:justify-end container mx-auto p-2">
    //     <div className="w-full lg:w-[55%] text-sm lg:text-xl mx-auto text-[#000000] font-[400] px-5 pr-3 md:lg:pr-[5rem] lg:pr-[7rem] ">
    //       <p>
    //         Sabah Kunle, holding an Ed.D. in Curriculum and Instruction, serves
    //         as the driving force behind IBLossomLearn as its Founder and CEO.
    //         With over a decade of classroom experience, she brings a wealth of
    //         practical knowledge to her role, adeptly blending pedagogical
    //         insights with curriculum design expertise. 'Sabah\'s' doctoral
    //         studies have equipped her with a deep understanding of instructional
    //         methodologies and learning theories, providing a solid foundation
    //         for crafting innovative educational programs tailored to diverse
    //         student needs.
    //       </p>
    //       <p className="hidden md:flex lg:flex mt-5">
    //         Sabah's commitment to ongoing professional development shines
    //         through her extensive training in reading and literacy instruction.
    //         Actively engaging in workshops and seminars, she stays abreast of
    //         the latest research and best practices in literacy education,
    //         constantly refining her teaching approach. This continuous learning
    //         journey empowers Sabah to leverage evidence-based strategies and
    //         cutting-edge techniques in developing dynamic literacy programs that
    //         foster student growth and success..
    //       </p>
    //       <p className=" mt-5">
    //         Fueled by her unwavering passion for education, Sabah has channeled
    //         her expertise into creating the Grammar & Literacy program at
    //         IBLossomLearn. By synthesizing her classroom experience, academic
    //         background, and professional training, Sabah has curated a
    //         comprehensive program that empowers educators to seamlessly
    //         integrate literacy approaches into their teaching practice. Through
    //         her visionary leadership and innovative approach, Sabah is
    //         revolutionizing literacy education, equipping teachers with the
    //         tools and support they need to unlock their students' full potential
    //         and drive academic excellence.
    //       </p>
    //     </div>
    //     <div className=" mx-auto">
    //       <Image
    //         className=""
    //         height={400}
    //         width={550}
    //         src={aboutOwner}
    //         alt="aboutHero"
    //       />
    //     </div>
    //   </div> */}
    //   {/* course sections */}

    //   <div className="container mx-auto bg-[#A9DDF421]  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-[5rem] px-2">
    //     {aboutCourseData?.map((course: any, index: number) => {
    //       return (
    //         <div
    //           className=" bg-white  mx-auto border border-[#51ADD4] rounded-lg p-2"
    //           key={index + 1}
    //         >
    //           <Image
    //             className="w-full h-[14rem] lg:h-[20rem]"
    //             src={course?.img}
    //             height={350}
    //             width={400}
    //             alt="course"
    //           />
    //           <div className="px-3">
    //             <h2 className="text-2xl  font-semibold my-3 text-center">
    //               {course?.title}
    //             </h2>
    //             <p className="my-4 py-5">
    //               {/* {course?.description} */}
    //               <EllipsisMiddle suffixCount={3} maxLength={220}>
    //                 {course?.description}
    //               </EllipsisMiddle>
    //             </p>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>

    //   {/* footer sections */}
    //   {/* <div className="mt-5 container mx-auto  max-w-[950px] bg-white py-5 px-7">
    //             <h2 className='text-center text-4xl font-semibold '>Why Choose iBlossomLearn?</h2>

    //             <div className=" w-full  mx-auto flex flex-col gap-7 mt-5">
    //                 {
    //                     aboutFooterData?.map((about: any, index: number) => <div key={index} className=''>
    //                         <div className="flex items-center gap-3">
    //                             <p>  {about?.icon}</p>
    //                             <h2 className='font-bold text-xl capitalize'>  {about?.title}</h2>
    //                         </div>

    //                         <p className='px-9 w-full  ml-3 my-2'>
    //                             {about?.description}
    //                         </p>

    //                     </div>)
    //                 }

    //             </div>
    //         </div> */}
    //   <div className="w-full bg-[#0f0a05] py-3 text-white">
    //     <div className="text-center flex flex-col gap-3">
    //       <h3 className="text-[#FB8500] font-bold w-fit mx-auto p-1 bg-[#fb86002d]">
    //         WHY US
    //       </h3>
    //       <h2 className="text-4xl">
    //         Why Choose{" "}
    //         <span className="text-[#FB8500] font-bold">iBlossomLearn?</span>
    //       </h2>
    //     </div>
    //     <div className="mt-5 container mx-auto  max-w-[950px]  py-5 px-7">
    //       <div className="grid md:grid-cols-2 gap-6 mt-5 p-5">
    //         <div className="flex flex-col gap-4">
    //           <div className="flex flex-col gap-5">
    //             <h1 className="text-5xl text-gray-400 font-bold">01.</h1>
    //             <h1 className="text-2xl font-semibold">Affordable Tuition</h1>
    //           </div>
    //           <div>
    //             <p>
    //               IBLossomLearn’s affordable tuition allows families to have a
    //               full-stack program with a variety of discounted tuition rates
    //               and payment plans. Our interest-free payment plans offer
    //               affordability to almost all families. Our goal is to provide
    //               an affordable, quality education to any student that desires
    //               the opportunity to succeed. Our admission specialist will be
    //               sure to inform you of all your options, allowing you to choose
    //               the one that is most comfortable for you.
    //             </p>
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-4">
    //           <div className="flex flex-col gap-5">
    //             <h1 className="text-5xl text-gray-400 font-bold">02.</h1>
    //             <h1 className="text-2xl font-semibold">
    //               Enroll Anytime, Anywhere
    //             </h1>
    //           </div>
    //           <div>
    //             <p>
    //               In our Online program, you can begin at Any time and from Any
    //               location that has Internet access. We will ship everything
    //               directly to you if you are a member of our Book Program.
    //             </p>
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-4">
    //           <div className="flex flex-col gap-5">
    //             <h1 className="text-5xl text-gray-400 font-bold">03.</h1>
    //             <h1 className="text-2xl font-semibold">Flexible Schedule</h1>
    //           </div>
    //           <div>
    //             <p>
    //               Our parents have the freedom to set their children's school
    //               schedules in a way that fits their demanding daily routines.
    //             </p>
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-4">
    //           <div className="flex flex-col gap-5">
    //             <h1 className="text-5xl text-gray-400 font-bold">04.</h1>
    //             <h1 className="text-2xl font-semibold">
    //               Flexible Program Structure
    //             </h1>
    //           </div>
    //           <div>
    //             <p>
    //               Our parents have the freedom to set their children's school
    //               schedules in a way that fits their demanding daily routines.
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="w-full">
      <CustomeHero title={'About Us'} image={'/privateHero.png'} />
      <div className="w-[90%] mx-auto">
        <div className=" items-center mt-6">
          <div className="flex justify-center  py-6">
            <Image
              src={aboutOwner}
              height={1200}
              width={1200}
              alt=""
              className=" h-[320px] w-[320px] rounded-lg border-4 border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-5xl font-semibold text-center ">Our Story</h1>
            <p className="text-center leading-8 font-semibold">
              The story of iBlossomLearn began in the midst of the pandemic, a time when
              learning gaps widened, and traditional education methods were challenged.
              Recognizing the urgent need for a flexible and supportive learning
              environment, Sabah Kunle, with her 13 years of classroom experience and
              expertise in curriculum development, set out to create a solution. <br />
              Sabah envisioned an innovative educational platform that would cater to the
              diverse needs of homeschooling families. She founded iBlossomLearn, a
              top-tier private school, with a mission to offer a comprehensive and
              holistic curriculum. One of her standout creations was the Social and
              Emotional Learning (SEL) curriculum, designed specifically to support
              homeschooling families. This curriculum aimed to help students not only
              excel academically but also develop essential life skills and emotional
              resilience. <br />
              The introduction of Iblossomlearn P.D Institute marked another milestone in
              this journey. This unique platform allowed students to access reading
              materials through engaging podcasts, perfect for listening while commuting
              or multitasking. It also provided a space for students to create and share
              their own audio stories, fostering creativity and enhancing their
              communication skills. <br />
              Sabah's Grammar & Literacy program was crafted to integrate literacy into
              skill acquisition seamlessly, ensuring students could achieve their highest
              potential. Her passion for education and her effective literacy framework
              inspired other educators to adopt her methods, leading to greater student
              engagement and success. <br />
              With iBlossomLearn, Sabah Kunle created a nurturing and adaptable learning
              environment that addressed the needs of the whole child. By focusing on both
              academic excellence and personal growth, iBlossomLearn equips students with
              the tools they need to thrive in an ever-changing world.
            </p>
            {/* <p>
              The goal of her in-depth Grammar & Literacy  program is to help
              scholars learn how to effectively reach their highest achievement
              levels. Sabah’s passion for education and love of sharing her
              experiences with other educators has led to many others
              implementing her literacy framework into their own classrooms to
              help engage their students in greater buy-ins as committed allies
              to learning. Thus increasing and improving their chances for
              overall academic and social success..
            </p> */}
          </div>
        </div>
        {/* <div className="grid grid-cols-2 items-center mt-5 bg-[#fb860028]">
            <div className="flex flex-col gap-6 w-[70%] px-5">
              <h1 className="text-3xl font-semibold relative top-0">
                Discover Fun Activities In Culinary Arts
              </h1>
              <p>
                Our art and craft ideas are perfect for parents and teachers of
                kids of all ages. E.g. baby handprint art, toddler craft projects,
                preschool art and craft ideas, kindergarten art based learning
                resources and many more...un!
              </p>
            </div>
            <div className="flex justify-end ">
              <Image src={aboutHero} alt="" className="bg-[#fb860050] h-[450px] " />
            </div>
          </div> */}
      </div>
      <div className="w-full bg-black mt-10 text-white py-[30px]">
        <div className="w-[90%] mx-auto flex flex-col justify-center py-5">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-4xl">Why Choose iBlossomLearn?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 p-5">
            <div className="flex flex-col gap-4 px-5">
              <div className="flex flex-col gap-5 ">
                <h2 className="text-2xl font-semibold">Affordable Tuition</h2>
              </div>
              <div>
                <p>
                  IBLossomLearn’s affordable tuition allows families to have a full-stack
                  program with a variety of discounted tuition rates and payment plans.
                  Our interest-free payment plans offer affordability to almost all
                  families. Our goal is to provide an affordable, quality education to any
                  student that desires the opportunity to succeed. Our admission
                  specialist will be sure to inform you of all your options, allowing you
                  to choose the one that is most comfortable for you.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-5">
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold">Enroll Anytime, Anywhere</h2>
              </div>
              <div>
                <p>
                  In our Online program, you can begin at Any time and from Any location
                  that has Internet access. We will ship everything directly to you if you
                  are a member of our Book Program.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-5">
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold">Flexible Schedule</h2>
              </div>
              <div>
                <p>
                  Our parents have the freedom to set their children's school schedules in
                  a way that fits their demanding daily routines.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-5">
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold">Flexible Program Structure</h2>
              </div>
              <div>
                <p>
                  Our parents have the freedom to set their children's school schedules in
                  a way that fits their demanding daily routines.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="mx-auto p-1 mt-5 text-lg  text-white border-2 border-primary w-fit rounded-3xl">
              <button className="bg-primary p-1 px-12 rounded-3xl uppercase">
                <Link href={'/contact'}>Contact IBlossomLearn for Details</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
