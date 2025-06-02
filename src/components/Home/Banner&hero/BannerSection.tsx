'use client';
import { useState } from 'react';
// import bannerBG from "@/assets/banner/bannerBG.png";
import bannerBG from '@/assets/banner/header.png';
import StudentVoicesUnited from '@/components/ui/Button/StudentVoicesUnited';
import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import { Tooltip } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
const BannerSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHover = () => {
    setIsModalOpen(true);
    // setTimeout(() => setIsModalOpen(false), 5000);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-14">
      <div className="lg-10 w-full pt-5">
        <div className="mx-auto grid w-full grid-cols-2 py-5 md:h-[480px]">
          <div data-aos="zoom-in-down">
            <Image
              alt="sdfsdf"
              width={1200}
              height={1200}
              src={'/home.png'}
              className="xl h-full w-full pr-5 lg:h-[460px] 2xl:w-[87%]"
            />
          </div>

          <div data-aos="zoom-in-left" className="">
            <Image
              alt="sdfsdf"
              width={1200}
              height={1200}
              src={bannerBG}
              className="h-[70%] w-full pr-5 lg:h-[300px]"
            />
            <div
              data-aos="zoom-in-right"
              className="mx-auto flex justify-end  items-center animate-bounce w-full mt:1 lg:mt-5 "
              onMouseEnter={handleHover}
            >
              <Tooltip>
                <Link
                  href={
                    'https://docs.google.com/forms/d/e/1FAIpQLSdZM5iX_fEYMswQ5VGY4LdkZyD49RC_TXJha9w5brvoUPGIUw/viewform?usp=sharing&ouid=116144235359474354275'
                  }
                  target="_blank"
                  className="flex justify-center items-center "
                >
                  <CustomImageTag
                    //@ts-ignore
                    style={{ animationDuration: '20s' }}
                    src={'/summerprogmar.png'}
                    className="lg:w-12 w-5 animate-spin "
                  />{' '}
                  <StudentVoicesUnited
                    className="text-xs leading-4 -tracking-tighter"
                    text="Summer Program Registration (25% off)"
                  />
                </Link>
              </Tooltip>
            </div>
            <div
              data-aos="zoom-in-left"
              className="mx-auto flex justify-end  items-center animate-bounce w-full mt-5 "
            >
              <Tooltip title="Join our community on Discord">
                <Link
                  href={'https://discord.gg/zqKWVTTF'}
                  target="_blank"
                  className="flex justify-center items-center "
                >
                  <CustomImageTag
                    //@ts-ignore
                    style={{ animationDuration: '2s' }}
                    src={'/voiceicon.png'}
                    className="lg:w-10 w-5 animate-ping "
                  />{' '}
                  <StudentVoicesUnited text="Student Voices United" />
                </Link>
              </Tooltip>
            </div>
            {/* <Modal
              title="Special Offer"
              open={isModalOpen}
              onCancel={handleClose}
              footer={null}
              width={500}
            >
              <p>sampods</p>
            </Modal> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;

// <Image alt="" src={"/banner/v2Banner.png"} className="object-cover -z-10 w-[100vw] h-[50vh] lg:h-[80vh] 2xl:h-[45.75rem] -mt-[3.5rem]" width={1900} height={1900} />
// <div
//   className="-mt-[3.5rem] min-h-[50rem] w-full relative flex flex-col justify-end re"
//   style={{
//     backgroundImage: `url('/banner/v2Banner.png')`,
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover", // or "contain"
//   }}
// >

//   {/* <AnimatePresenceWrapper>
//     <div className="w-full lg:w-[60%] px-5 md:py-[5rem] xl:py-[6rem]">
//       <div className=" text-black  uppercase space-y-3 ">
//         <h1
//           className=" text-[24px] whitespace-nowrap md:text-[48px] lg:text-[50px]  leading-[1] xl:text-[64px]
//           font-[700] lg:font-[800]"
//         >
//           Feel bored or anxious
//         </h1>
//         <h1
//           className="text-[24px] whitespace-nowrap  lg:text-[50px] leading-[1] xl:text-[64px]
//           font-[700] lg:font-[800]"
//         >
//           About{" "}
//           <span className="text-secondary whitespace-nowrap">
//             Math or English ?
//           </span>
//         </h1>
//       </div>
//       <p className="mt-[1rem]  md:whitespace-nowrap text-[20px] lg:text-[2rem] xl:text-[2rem] leading-[1.3]">
//         Overcome challenges with
//         <span className="text-secondary  text-[20px] lg:text-[2rem] xl:text-[2rem] mx-1 leading-[1.5]">
//           iBlossomLearn
//         </span>
//         classes.
//       </p>
//       <p className="text-[20px] lg:text-[2rem] xl:text-[2rem] leading-[1.3] lg:whitespace-nowrap">
//         Your adventure in learning awaits!
//       </p>
//       <div className="mt-2 md:mt-[1.5rem] h-[3.8rem] flex">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => handleChange(e)}
//           placeholder="Search here"
//           className="border-2 outline-none text-lg lg:text-xl text-[#949494 text-slate-800  border-primary rounded-l-[8px] w-full md:max-w-md p-2 bg-[#ADADFA40] h-[2.8rem] lg:h-[3.8rem]"
//         />
//         <h3 className="bg-primary p-[16px] rounded-r-[8px] max-w-[3.7rem] h-[2.8rem] lg:h-[3.8rem]">
//           <SearchOutlined
//             style={{
//               minHeight: "24px",
//               width: "24px",
//               color: "white",
//               fontWeight: "700",
//             }}
//           />
//         </h3>

//         {resetValue && searchValue?.length > 0 && (
//           <button
//             onClick={handleReset}
//             className="bg-white p-[16px] rounded-r-[8px] max-w-[3.7rem] h-[2.8rem] lg:h-[3.8rem]"
//           >
//             <ReloadOutlined
//               style={{
//                 minHeight: "24px",
//                 width: "24px",
//                 color: "black",
//                 fontWeight: "700",
//               }}
//             />
//           </button>
//         )}
//       </div>
//       <div className="mt-2 md:mt-[2rem] lg:mt-[3rem] flex  gap-3 text-[1.2rem] text-white font-[700] uppercase ">
//         <Link
//           className=" w-fit text-xs md:text-sm lg:text-lg bg-primary  p-3 rounded-[8px]"
//           href="/learning"
//         >
//           Get started new
//         </Link>
//         <Link
//           className="w-fit text-xs md:text-sm lg:text-lg  bg-secondary  p-3 flex justify-center items-center rounded-[8px]"
//           href="/subscription"
//         >
//           Join now
//         </Link>
//       </div>
//     </div>
//   </AnimatePresenceWrapper> */}

//   {/* <div className="w-full lg:w-[40%]  hidden lg:flex justify-end lg:-mt-[2rem] ">
//     <Image
//       className="w-[80%] lg:w-[60%]  h-full  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300  py-2"
//       src={treeBoy}
//       height={602}
//       width={510}
//       alt="treeboy"
//     />
//   </div> */}

// </div>

/*  <div className="w-full px-20 mt-14">
      <div className="w-full  pt-5 lg-10 2xl:px-16">
        <div className="grid grid-cols-2 w-full 2xl:w-[85%] mx-auto py-5 md:h-[480px]">
          <div data-aos="zoom-in-down">
            <Image
              alt=""
              width={1200}
              height={1200}
              src={"/HeroChild.png"}
              className="pr-5 w-full h-full 2xl:w-[87%]  lg:h-[460px]"
            />
          </div>

          <div data-aos="zoom-in-left" className="">
            <Image
              alt=""
              width={1200}
              height={1200}
              src={bannerBG}
              className="pr-5 w-full h-[70%] lg:h-[300px]  "
            />

            <h2
              data-aos="zoom-in-left"
              className="text-xs lg:text-4xl 2xl:text-5xl mt-2 text-center"
            >
              Your Path to Success <br /> Starts Here
            </h2>
          </div>
        </div>
      </div>
    </div> */
