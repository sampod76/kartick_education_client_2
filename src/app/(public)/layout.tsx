'use client';
import CourseStatistics from '@/components/Course/CourseStatistics';
import MilestoneList from '@/components/Course/MilestoneHomeList';
import CartDrawer from '@/components/Home/Cart/CartDrawer';

import BannerCourses from '@/components/Home/Banner&hero/BannerCourses';
import SupportHero from '@/components/Home/Banner&hero/SupportHero';
// import NavbarPublic from "@/components/shared/Headers/Navbar/NavbarPublic";

import TopBar from '@/components/shared/Headers/TopBar';
// const TopBar = React.lazy(() => import("@/components/shared/Headers/TopBar"));
// const NavbarPublic = React.lazy(
//   () => import("@/components/shared/Headers/Navbar/NavbarPublic")
// );
const Footer = React.lazy(() => import('@/components/Home/Footer'));

import { Layout, Row, Space, Spin } from 'antd';
import React, { useState } from 'react';
import NavbarPublic from '@/components/shared/Headers/Navbar/NavbarPublic';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="sticky -top-[0rem] z-40 lg:-top-[0.3rem]">
        <NavbarPublic />
      </div>

      {/* <BannerCourses /> */}
      {/* <BannerCourses /> */}
      {/* <CourseStatistics /> */}
      {/* <CartDrawer /> */}

      <div className="">{children}</div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
