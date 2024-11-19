import Inbox from './inbox';

export default function MessageBox() {
  return <Inbox />;
}

// 'use client';
// import { Drawer, Layout } from 'antd';
// import { useEffect, useState } from 'react';
// import { BsLayoutTextSidebar } from 'react-icons/bs';
// import ChatList from './chat-list';
// import Inbox from './inbox';

// const { Sider, Content } = Layout;

// const ChatLayout = () => {
//   // const searchQuery = useSearchParams();
//   // const friendShipId = searchQuery.get('friendShipId');

//   const [isMobile, setIsMobile] = useState(false);
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     handleResize(); // Initial check
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const showDrawer = () => setIsDrawerVisible(true);
//   const closeDrawer = () => setIsDrawerVisible(false);

//   return (
//     <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
//       <div className="relative">
//         {isMobile ? (
//           <div style={{ backgroundColor: 'white' }} className="">
//             {/* Button to open Drawer on mobile */}

//             <p className="p-1" onClick={showDrawer}>
//               <BsLayoutTextSidebar />
//             </p>

//             {/* Drawer for ChatList on mobile */}
//             <Drawer
//               title="Chats"
//               placement="left"
//               onClose={closeDrawer}
//               open={isDrawerVisible}
//               bodyStyle={{ padding: 0 }}
//               // Set a smaller width for better mobile view
//             >
//               <ChatList closeDrawer={closeDrawer} />
//             </Drawer>
//           </div>
//         ) : (
//           /* Render ChatList directly on larger screens */
//           <Sider
//             width={380}
//             style={{
//               padding: '10px',
//               backgroundColor: 'white',
//               overflowY: 'auto',
//             }}
//           >
//             <ChatList />
//           </Sider>
//         )}
//       </div>

//       {/* Inbox Content */}
//       <Content
//         style={{
//           margin: '10px',
//           padding: '20px',
//           borderRadius: '10px',
//           overflowY: 'auto',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: '#ffffff',
//             padding: '15px',
//             borderRadius: '10px',
//           }}
//         >
//           <Inbox />
//         </div>
//       </Content>
//       {/* <ChatGlobal /> */}
//     </Layout>
//   );
// };

// export default ChatLayout;
