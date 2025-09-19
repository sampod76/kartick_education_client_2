import type { MenuProps } from 'antd';
import Link from 'next/link';

export const homeNavItems = (role: string | null): MenuProps['items'] => {
  const defaultNavItem = [
    {
      label: (
        <Link className="text-[16px] font-extrabold capitalize 2xl:text-[20px]" href="/">
          HOME
        </Link>
      ),
      key: '1',
    },
    {
      label: (
        <Link
          className="text-[16px] 2xl:text-[20px]   font-extrabold capitalize"
          href="/subscription/package"
        >
          SUBSCRIPTION
        </Link>
      ),
      key: '/subscription',
    },
    {
      label: (
        <h1 className="text-[16px] font-extrabold capitalize text-black hover:text-black 2xl:text-[20px]">
          ABOUT
        </h1>
      ),
      key: '/sdfsd',

      children: [
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/aboutUs">
              About Us
            </Link>
          ),

          key: '/about',
        },
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/board-of-trustees">
              Board Of Trustees
            </Link>
          ),

          key: '/board-of-trustees',
        },
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/leadership">
              Leadership
            </Link>
          ),

          key: '/leadership',
        },
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/staff">
              Staff
            </Link>
          ),

          key: '/staff',
        },
        {
          label: (
            <Link
              className="text-[14px] font-bold capitalize"
              href="/career-opportunities"
            >
              Career Opportunities
            </Link>
          ),

          key: '/career-opportunities',
        },
      ],
    },

    {
      label: (
        // <Link
        //   className="text-[16px] 2xl:text-[20px] text-black hover:text-black  font-extrabold capitalize"
        //   //  href="/instruction"
        //   href="/"
        // >
        //   INSTRUCTION
        // </Link>
        <h1 className="text-[16px] font-extrabold capitalize text-black hover:text-black 2xl:text-[20px]">
          INSTRUCTION
        </h1>
      ),
      key: '/instruction',
      children: [
        {
          label: (
            <Link
              className="text-[14px] font-bold capitalize"
              href="/nav/how-it-works-in-iblossomlearn"
            >
              How It Works in iBLossomLearn
            </Link>
          ),

          key: '/How It Works in iBLossomLearn',
        },
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/academics-program">
              Academics Program
            </Link>
          ),

          key: '/academics-program',
        },
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/inclusion-approach">
              Inclusion Approach
            </Link>
          ),

          key: '/inclusion-Approach',
        },
        {
          label: (
            <Link
              className="text-[14px] font-bold capitalize"
              href="/transition-to-high-school"
            >
              Transition to high school
            </Link>
          ),

          key: '/transition-to-high-school',
        },
      ],
    },
    {
      label: (
        <div
          className="text-[16px] font-extrabold capitalize !text-[#1d1c1c] hover:text-[#1d1c1c] 2xl:text-[20px]"
          // href="/resources"
        >
          RESOURCES
        </div>
      ),

      key: '/resources',
      children: [
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/students/elibrary">
              eLibrary
            </Link>
          ),

          key: '/students/E-Library',
        },

        {
          label: (
            <Link
              className="text-[14px] font-bold capitalize"
              href="/students/supplemental-activities"
            >
              Supplemental Activities
            </Link>
          ),

          key: '/students/supplemental-activities',
        },
      ],
    },

    {
      label: (
        <Link
          className="text-[16px] font-extrabold capitalize text-[#1d1c1c] hover:text-[#1d1c1c] 2xl:text-[20px]"
          // href="/enroll"
          href="/enroll"
        >
          COURSES
        </Link>
      ),
      key: '/enroll',
    },

    {
      label: (
        <p className="text-[16px] capitalize lg:font-extrabold 2xl:text-[20px]">
          STUDENT
        </p>
      ),

      key: '/students',
      children: [
        {
          label: (
            <Link className="text-[14px] font-bold capitalize" href="/students/podcast">
              Podcast
            </Link>
          ),

          key: '/students/Podcast',
        },

        {
          label: (
            <Link
              className="text-[14px] font-bold capitalize"
              href="/students/learning-act"
            >
              The Learning Arc Tutoring
            </Link>
          ),

          key: '/students/learning-act',
        },
      ],
    },
  ];

  const loginUserNavItem = [...defaultNavItem];
  if (role === 'seller') {
    loginUserNavItem.push({
      label: (
        <Link
          className="text-[16px] font-extrabold capitalize 2xl:text-[20px]"
          href="/analytics"
        >
          ANALYTICS
        </Link>
      ),
      key: '/analytics',
    });
    return loginUserNavItem;
  } else if (role) {
    // console.log(loginUserNavItem);
    return loginUserNavItem;
  } else {
    return defaultNavItem;
  }
};
