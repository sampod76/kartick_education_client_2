import { Dropdown, Menu } from 'antd';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
const HomeLinkSection = () => {
  return (
    <div>
      <div className=" py-[20px] lg:py-[60px] bg-black container mx-auto text-center border ">
        <div>
          <h2 className="text-lg sm:text-2xl md:text-3xl 2xl:text-4xl text-center text-white font-semibold p-5 -mt-3">
            <Typewriter
              options={{
                strings: ['Empowering Educators, Students, and Families with'],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
            <br className="hidden lg:block" />
            <span className=" lg:mt-2 my-3 ml-20">Tailored Support</span>
          </h2>
        </div>

        <div className="space-y-6 md:space-y-10 md:mb-6 px-6">
          {/* first 2 */}
          <div className="space-y-6 md:space-y-0 md:flex justify-between  items-center gap-8 2xl:gap-28 h-full  ">
            <div
              data-aos="fade-right"
              className="p-1 lg:ml-10  text-lg w-full lg:w-[28%] border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
            >
              <div className="hover:bg-primary  bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-0 xl:px-6 2xl:px-12 rounded-3xl">
                <Dropdown
                  placement="bottomLeft"
                  arrow
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="details"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/talkeasi-unlimited'}
                        >
                          i-TalkEasi Unlimited
                        </Link>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Link
                    className="text-black w-full whitespace-break-spaces xl:whitespace-nowrap hover:text-white"
                    href={'/home/ibinstitute'}
                  >
                    iBLossomLearn Language Institute
                  </Link>
                </Dropdown>
              </div>
            </div>
            <div
              data-aos="fade-right"
              className="p-1 lg:ml-10  text-lg w-full lg:w-[28%] border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
            >
              <div className="hover:bg-primary  bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-0 xl:px-6 2xl:px-12 rounded-3xl">
                <Dropdown
                  placement="bottomLeft"
                  arrow
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="details"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/flex-accredited'}
                        >
                          Flex Accredited K12
                        </Link>
                      </Menu.Item>

                      <Menu.Item
                        key="details8844"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/writingProject'}
                        >
                          The Writing Project
                        </Link>
                      </Menu.Item>
                      <Menu.Item
                        key="details4411"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/scienceInfinityProject'}
                        >
                          The Science Infinity Project
                        </Link>
                      </Menu.Item>
                      <Menu.Item
                        key="details4411"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/ib-pd-institute'}
                        >
                          Iblossomlearn P.D Institute
                        </Link>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Link
                    className="text-black w-full whitespace-break-spaces xl:whitespace-nowrap hover:text-white"
                    href={'/home/iblossom-private-academy'}
                  >
                    iBLossomLearn Private Academy
                  </Link>
                </Dropdown>
              </div>
            </div>
            <div
              data-aos="fade-right"
              className="p-1 lg:ml-10  text-lg w-full lg:w-[28%] border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
            >
              <div className="hover:bg-primary  bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-0 xl:px-6 2xl:px-12 rounded-3xl">
                <Dropdown
                  placement="bottomLeft"
                  arrow
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="details"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/wholeChildSeries'}
                        >
                          The Whole Child Series
                        </Link>
                      </Menu.Item>

                      <Menu.Item
                        key="details8844"
                        className="   transition-all duration-700 border-b-2"
                      >
                        <Link
                          className="text-black whitespace-nowrap hover:text-white"
                          href={'/home/peacefulFamilyDynamics'}
                        >
                          Peaceful Family Dynamics
                        </Link>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Link
                    className="text-black w-full whitespace-break-spaces xl:whitespace-nowrap hover:text-white"
                    href={'/home/thriveInstitute'}
                  >
                    The Thrive Institute
                  </Link>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLinkSection;

// import Link from 'next/link';

// const HomeLinkSection = () => {
//   return (
//     <div>
//       <div className=" py-[20px] lg:py-[40px] bg-black container mx-auto text-center border ">
//         <div>
//           <h2 className="text-lg sm:text-2xl md:text-3xl  2xl:text-5xl  text-center text-white font-semibold p-5  -mt-3">
//             Empowering Educators, Students, and Families with{' '}
//             <br className="hidden lg:block" />
//             <span className=" lg: mt-7">Tailored Support</span>
//           </h2>
//         </div>

//         <div className="space-y-6 md:space-y-10 md:mb-6 px-6">
//           {/* first 2 */}
//           <div className="space-y-6 md:space-y-0 md:flex justify-between  items-center gap-8 2xl:gap-28 h-full  ">
//             <div
//               data-aos="fade-right"
//               className="p-1 lg:ml-10  text-lg w-full lg:w-[28%] border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
//             >
//               <div className="hover:bg-primary  bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-0 xl:px-6 2xl:px-12 rounded-3xl">
//                 <Link
//                   className="text-black w-full whitespace-break-spaces xl:whitespace-nowrap hover:text-white"
//                   href={'/ibinstitute'}
//                 >
//                   iBLossomLearn Language Institute
//                 </Link>
//               </div>
//             </div>
//             <div
//               data-aos="fade-left"
//               className="p-1 lg:mr-10 text-lg w-full lg:w-[28%] border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
//             >
//               <div className="hover:bg-primary     bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-5 xl:px-6 2xl:px-12 rounded-3xl">
//                 <Link
//                   className="text-black whitespace-nowrap hover:text-white"
//                   href={'/iblossom-private-academy'}
//                 >
//                   iBLossomLearn Private Academy
//                 </Link>
//               </div>
//             </div>
//           </div>
//           {/* secound 2 */}
//           <div className="flex flex-col md:gap-6 w-full space-y-6 h-full">
//             <div
//               // data-aos="zoom-in"
//               className="p-1  text-lg w-full lg:w-[30%]  border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
//             >
//               <div className="hover:bg-primary   bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-5 xl:px-6 2xl:px-12 rounded-3xl">
//                 <Link
//                   className="text-black whitespace-nowrap hover:text-white"
//                   href={'/flex-accredited'}
//                 >
//                   Flex Accredited K12
//                 </Link>
//               </div>
//             </div>
//             <div
//               data-aos="zoom-in"
//               className="p-1  text-lg w-full lg:w-[30%]  border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
//             >
//               <div className="hover:bg-primary   bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-5 xl:px-6 2xl:px-12 rounded-3xl">
//                 <Link
//                   className="text-black whitespace-break-spaces 2xl:whitespace-nowrap hover:text-white"
//                   href={'/talkeasi-unlimited'}
//                 >
//                   i-TalkEasi Unlimited
//                 </Link>
//               </div>
//             </div>
//           </div>
//           {/* third 2 */}
//           <div className="space-y-6 md:space-y-0 md:flex justify-between gap-28 items-center h-full">
//             <div
//               data-aos="fade-right"
//               className="p-1 lg:ml-10 text-lg w-full lg:w-[28%]  border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
//             >
//               <div className="hover:bg-primary  w-full bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-5 xl:px-6 2xl:px-12 rounded-3xl">
//                 <Link
//                   className="text-black whitespace-nowrap hover:text-white"
//                   href={'/ibhomeschool'}
//                 >
//                   SEL for Homeschooling Families
//                 </Link>
//               </div>
//             </div>
//             <div
//               data-aos="fade-left"
//               className="p-1 lg:mr-10 text-lg w-full lg:w-[28%]  border-2 transition-all duration-700 hover:border-primary  rounded-3xl mx-auto font-semibold"
//             >
//               <div className="hover:bg-primary   bg-gray-300 transition-all duration-700 p-1 px-5 md:px-6 lg:px-5 xl:px-6 2xl:px-12 rounded-3xl">
//                 <Link
//                   className="text-black whitespace-nowrap hover:text-white"
//                   href={'/ibcast'}
//                 >
//                   Iblossomlearn P.D Institute
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeLinkSection;
