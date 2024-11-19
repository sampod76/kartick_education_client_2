import Image from 'next/image';

export default function Inbox() {
  return (
    <div className="flex justify-center items-center">
      <Image
        src={
          'https://d30hkubekb1969.cloudfront.net/upload/images/liveccat-1731863820592.png'
        }
        alt=""
        width={1000}
        height={1000}
        className=" w-[100%] h-[90vh]  border-2 rounded-2xl"
      />
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// 'use client';
// import { useGetCheckUserIdToExistFriendShipQuery } from '@/redux/api/AllApi/friendShipApi';
// import { useGetAllChatMessageQuery } from '@/redux/api/AllApi/messageApi';
// import {
//   IChatMessage,
//   setFastPositionMultipleMessages,
//   setSingleMessage,
// } from '@/redux/features/chatAllMessage';
// import {
//   addSingleFriendship,
//   sortAscAndAddFriendships,
// } from '@/redux/features/chatListSlice';
// import getChatTimer from '@/utils/ChatTimer';

// import fileObjectToLink from '@/utils/fileObjectToLink';

// import { ErrorModal } from '@/utils/modalHook';
// import { PaperClipOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
// import { Badge, Button, Form, Input, message, Skeleton, Tooltip } from 'antd';
// import { saveAs } from 'file-saver';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
// import useSound from 'use-sound';
// import { useSocket } from '../ContextApi/SocketContextApi';

// import { debounceFunction, useAppSelector } from '@/redux/hooks';
// import { IFileAfterUpload } from '@/types/globalType';
// import { ENUM_SOCKET_EMIT_ON_TYPE } from '@/types/socketTypes';
// import { useGlobalContext } from '../ContextApi/GlobalContextApi';

// import { ENUM_MIMETYPE } from '@/constants/globalEnums';
// import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
// import CustomImageTag from '../ui/CustomTag/CustomImageTag';
// import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
// import AudioRecordV2 from './audio-record-v2';
// // import EmojiPicker from "emoji-picker-react";
// const LazyEmojiPicker = React.lazy(() => import('emoji-picker-react'));
// export default function Inbox() {
//   const { userInfo: user } = useGlobalContext();
//   const { socket, socketLoading } = useSocket();
//   const dispatch = useDispatch();
//   const [form] = Form.useForm();
//   //
//   const [play] = useSound(
//     'https://d30hkubekb1969.cloudfront.net/upload/audios/toon-1731631020355.mp3',
//     {
//       volume: 0.2,
//       preload: 'auto',
//     },
//   );
//   const router = useRouter();
//   const searchQuery = useSearchParams();
//   const paramsToFriendShipId = searchQuery.get('friendShipId');
//   const paramsToFriendUserId = searchQuery.get('friendUserId');
//   const friendUserId = paramsToFriendUserId;
//   // console.log('🚀 ~ Inbox ~ friendUserId:', friendUserId);
//   //
//   const chatContainerRef = useRef<any>(null);
//   const scrollRef = useRef<any>(null);
//   const isDisabledLoadMore = useRef<any>(false);
//   const isScrollTop = useRef<any>(false);
//   //
//   const [isOnline, setIsOnline] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [messageLoading, setMessageLoading] = useState(false);
//   const [scroll, setScrollTop] = useState(false);
//   //
//   const [selectedFiles, setSelectedFiles] = useState<any[]>([]); // Local state to store selected file
//   const audioFileLiveUrlRef = useRef<any>({}); // Local state to store selected file
//   const isReset = useRef(false);
//   //

//   const {
//     data: checkFriendDate,
//     isLoading: cfLoading,
//     isFetching: cfFetching,
//     error: cfError,
//   } = useGetCheckUserIdToExistFriendShipQuery(
//     friendUserId + '?createFriendShip=yes',
//     // friendUserId,
//   );
//   // console.log('checkFriendDate', checkFriendDate);
//   const friendShipId = paramsToFriendShipId || checkFriendDate?._id;

//   const allMessages =
//     useAppSelector((state) => state.allChatMessages[friendShipId]) || [];
//   //
//   const query: Record<string, any> = {};
//   const [page, setPage] = useState<{ friendShipId: string; value: number }[]>([]); //[{ friendShipId: friendShipId, value: 1 }]

//   const [limit, setLimit] = useState(20);
//   query['limit'] = limit;
//   query['page'] = page?.find((c) => c?.friendShipId === friendShipId)?.value || 1;
//   query['friendShipId'] = friendShipId;
//   const { data, isLoading, error, isFetching, refetch } = useGetAllChatMessageQuery(
//     query,
//     {
//       skip: !Boolean(friendShipId),
//     },
//   );

//   if (error) {
//     ErrorModal(error);
//     console.log(error);
//   }
//   // const allMessages = data?.data || [];
//   const meta = data?.meta;
//   //---------db query start---------
//   /** //? ***********database to get message****************
//    * socket useEffect
//    */
//   useEffect(() => {
//     if (!isFetching && !isLoading) {
//       /*
//       const sortedData = [...allMessages]?.sort(
//         (a, b) =>
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//       );
//       setAllMessage((c) => [...sortedData, ...c]);
//        */
//       // setAllMessage((c) => [...data?.data, ...c]);
//       if (data?.data) {
//         //Default use this -> when get database messages then add first serial
//         dispatch(
//           setFastPositionMultipleMessages({
//             friendShipId: friendShipId,
//             messages: data?.data, //[message]
//           }),
//         );
//         setScrollTop(true); // when clicked load-more button then need scroll to top
//         isScrollTop.current = true;
//       }
//     }
//   }, [isFetching, isLoading]);

//   useEffect(() => {
//     const selectedFriendPage = page?.find((c) => c?.friendShipId === friendShipId);
//     if (!selectedFriendPage) {
//       setPage((c) => [...c, { friendShipId: friendShipId, value: 1 }]);
//     }
//     //!----disable--loading more buttons ----
//     if (selectedFriendPage?.value) {
//       //default sidebar user
//       const requestTotalMessages = selectedFriendPage?.value * limit;
//       const isDisabled = requestTotalMessages >= meta?.total! ? true : false;
//       isDisabledLoadMore.current = isDisabled;
//     }
//   }, [friendShipId, isFetching, isLoading]);

//   //---------db-to-message loading end-------------

//   /** //? ***********socket useEffect****************
//    * socket useEffect
//    * @param {1st} //messageFunction
//    * @param {2st} //onlineOfflineUser
//    */

//   const messageFunction = useCallback(
//     (data: { data: IChatMessage }) => {
//       // Dispatch the message
//       dispatch(
//         setSingleMessage({
//           friendShipId: data?.data?.friendShipId,
//           message: data?.data,
//         }),
//       );

//       if (friendShipId !== data?.data?.friendShipId) {
//         dispatch(
//           sortAscAndAddFriendships({
//             friendShipId: data?.data?.friendShipId,
//             message: data?.data?.message,
//           }),
//         );

//         // Play sound notification

//         // Check for notification permission
//         if (Notification.permission === 'granted') {
//           const notification = new Notification('New Message', {
//             body: data?.data?.message || 'You have a new message!',
//           });

//           // Close the notification when the tab becomes visible
//           document.addEventListener('visibilitychange', () => {
//             if (document.visibilityState === 'visible') {
//               notification.close();
//             }
//           });
//         } else if (Notification.permission !== 'denied') {
//           Notification.requestPermission().then((permission) => {
//             if (permission === 'granted') {
//               const notification = new Notification('New Message', {
//                 body: data?.data?.message || 'You have a new message!',
//               });
//             }
//           });
//           play();
//         }

//         message.success(JSON.stringify(data?.data?.message));
//       }
//     },
//     [friendShipId],
//   );

//   const onlineOfflineUser = useCallback(
//     (data: { data: IChatMessage; message: string }) => {
//       if (data?.data?.isOnline) {
//         setIsOnline(true);
//         message.success(JSON.stringify(data?.message));
//       } else {
//         setIsOnline(false);
//         message.error(JSON.stringify(data?.message));
//       }
//     },
//     [],
//   );
//   useEffect(() => {
//     if (socket) {
//       // socket.on(
//       //   ENUM_SOCKET_EMIT_ON_TYPE.server_to_client_personal_message,
//       //   messageFunction,
//       // );
//       // when your are same friend in chat. then on time your friend online or offline then notify
//       socket.on(
//         ENUM_SOCKET_EMIT_ON_TYPE.online_offline_user + friendUserId,
//         onlineOfflineUser,
//       );
//       return () => {
//         // socket.off(
//         //   ENUM_SOCKET_EMIT_ON_TYPE.server_to_client_personal_message,
//         //   messageFunction,
//         // );
//         socket.off(
//           ENUM_SOCKET_EMIT_ON_TYPE.online_offline_user + friendUserId,
//           onlineOfflineUser,
//         );
//       };
//     }
//   }, [socket, socketLoading, friendUserId, friendShipId]);

//   /** //? ***********scroll useEffect****************
//    * scroll useEffect
//    * @param {1st} //when click loadmore button then scroll top
//    * @param {2st} //when any user message then scroll down
//    */
//   useEffect(() => {
//     if (scrollRef.current) {
//       if (allMessages?.allMessage?.length && scroll) {
//         scrollRef.current.scrollTop = 0; // Scroll to the top
//         setScrollTop(false);
//         isScrollTop.current = false;
//       } else {
//         scrollRef.current?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'nearest',
//         });
//       }
//     }
//   }, [allMessages?.allMessage?.length]);
//   //? ********************end************************

//   /** //? ***********friendship useEffect****************
//    * scroll useEffect
//    * @param {1st} //first time check user id to get already friendship existing
//    * @param {2st} //not existing then creating
//    */
//   useEffect(() => {
//     if (
//       checkFriendDate?._id &&
//       checkFriendDate?.isNewAccount &&
//       !cfLoading &&
//       !cfFetching
//     ) {
//       // If friendship already exists, update it with new messages
//       dispatch(
//         addSingleFriendship({
//           singleFriendShipData: checkFriendDate,
//         }),
//       );

//       router.replace(`?friendShipId=${checkFriendDate._id}&friendUserId=${friendUserId}`);
//     }
//     if (!paramsToFriendShipId && paramsToFriendUserId && checkFriendDate?._id) {
//       router.replace(`?friendShipId=${checkFriendDate._id}&friendUserId=${friendUserId}`);
//     }

//     // Ensure useEffect only runs once when dependencies change (avoid infinite re-renders)
//   }, [checkFriendDate?._id, cfLoading, cfFetching]);
//   // **************end **************---- --

//   const myFriendDetails = useMemo(() => {
//     if (!checkFriendDate || !user?.userId) {
//       return null; // Return a default value or null if data is not available
//     }

//     return checkFriendDate?.sender?.userId === user?.userId
//       ? checkFriendDate?.receiver?.details
//       : checkFriendDate?.sender?.details;
//   }, [checkFriendDate, user?.userId]); // Keep the hook consistent on every render

//   const handleInputChange = useCallback(
//     debounceFunction((value: any) => {
//       form.setFieldsValue({ message: value });
//     }, 300),
//     [],
//   );
//   if (cfLoading || socketLoading) {
//     return <LoadingSkeleton />;
//   }
//   const onFinish = async (values: any) => {
//     try {
//       // console.log('Received values of form: ', values);
//       if (
//         !values.message &&
//         !selectedFiles.length &&
//         !audioFileLiveUrlRef?.current?.path
//       ) {
//         return;
//       }
//       if (values.message) {
//         values.message = values.message.trim();
//       }
//       // console.log(selectedFiles, 'selectedFiles');
//       if (selectedFiles.length) {
//         setMessageLoading(true);
//         const filePath = await multipleFilesUploaderS3(selectedFiles);
//         values.files = filePath;
//       }
//       if (audioFileLiveUrlRef && audioFileLiveUrlRef?.current?.path) {
//         if (values?.files?.length) {
//           values.files.push(audioFileLiveUrlRef?.current);
//         } else {
//           values.files = [audioFileLiveUrlRef?.current];
//         }
//       }

//       socket.emit(
//         ENUM_SOCKET_EMIT_ON_TYPE.client_to_server_personal_message,
//         {
//           ...values,
//           friendShipId,
//         },
//         (response: { data: any }) => {
//           if (response?.data) {
//             // setAllMessage((e) => [...e, response.data]);
//             dispatch(
//               setSingleMessage({
//                 friendShipId: friendShipId,
//                 message: response.data,
//               }),
//             );
//             dispatch(
//               sortAscAndAddFriendships({
//                 friendShipId: friendShipId,
//               }),
//             );
//             form.resetFields();
//             isReset.current = true;
//             setSelectedFiles([]);
//           }
//         },
//       );
//     } catch (error) {
//       console.log('🚀 ~ onFinish ~ error:', error);
//       ErrorModal(error); // Handle errors through the modal
//     } finally {
//       setMessageLoading(false);
//     }
//   };

//   const handleFileChange = (e: any) => {
//     // const file = e.target.files[0]; // Get the first selected file
//     // setSelectedFile(file);
//     const files: any[] = Array.from(e.target.files); // Convert FileList to array
//     setSelectedFiles(files); // Set multiple selected files to state
//   };
//   const handleEmojiClick = (emojiObject: { emoji: any }) => {
//     // setMessage((c)=>(c+emojiObject))

//     const currentMessage = form.getFieldValue('message') || ''; // Get current value of message
//     form.setFieldsValue({
//       message: currentMessage + emojiObject.emoji, // Append emoji to the message
//     });
//   };

//   /**
//    * Query for documents with pagination
//    * @param {1st} প্রথমে আমি জানিনা কে ফ্রেন্ড রিকোয়েস্ট সেন্ড করেছে
//    * @param {2nd} আমি ধরে নিলাম ফ্রেন্ড রিকুয়েস্টটা আমি সেন্ড করেছি তাহলে আমি sender, তাহলে আমার এই সিঙ্গেল ফ্রেন্ডশিপ(checkFriendDate) ডিটেলস ভিতরে যে sender আছে তার userId যদি আমার সাথে মিলে যায় তার মানে আমি sender / না হলে আমি receiver
//    * @param {3nd} আমার দরকার আমার ফ্রেন্ডের এর ডিটেলস | তাহলে আমার userId সাথে যদি sender.userId আইডি মিলে যায় তাহলে checkFriendDate in-> receiver হচ্ছে আমার ফ্রেন্ড

//   */

//   return (
//     <div className="flex flex-col items-center justify-between">
//       {/* top - user */}

//       <div className="flex w-full items-center gap-x-4 bg-blue-300 p-4">
//         {/* <Avatar shape="square" src={userAvatar.src} size={45} /> */}
//         <div className="min-w-8">
//           <CustomImageTag
//             src={myFriendDetails?.profileImage}
//             height={700}
//             width={700}
//             className="h-8 w-8 rounded-full"
//           />
//         </div>

//         <div>
//           <h4 className="font-kumbh-sans text-primary-white font-bold">
//             {myFriendDetails?.name?.firstName + ' ' + myFriendDetails?.name?.lastName}
//           </h4>
//           {myFriendDetails?.isOnline || isOnline ? (
//             <div className="flex items-center gap-x-2">
//               <div className="h-2 w-2 rounded-full bg-green-600"></div>
//               <p className="text-primary-white/70 font-semibold">Online</p>
//             </div>
//           ) : (
//             <div className="flex items-center gap-x-2">
//               <div className="h-2 w-2 rounded-full bg-red-600"></div>
//               <p className="text-primary-white/70 font-semibold">Offline</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="relative w-full bg-white">
//         <div className=" ">
//           {isLoading ? (
//             <LoadingSkeleton />
//           ) : checkFriendDate?.sender?.userId === user?.userId ||
//             checkFriendDate?.receiver?.userId === user?.userId ? (
//             <div
//               ref={chatContainerRef}
//               className="flex h-[68vh] flex-col gap-8 overflow-y-scroll rounded-lg border px-2 py-10"
//             >
//               {!isDisabledLoadMore.current && (
//                 <Button
//                   disabled={isDisabledLoadMore.current}
//                   loading={isFetching}
//                   onClick={() =>
//                     setPage((friendPage: any) => {
//                       const anotherFriend =
//                         friendPage?.filter(
//                           (c: { friendShipId: any }) => c?.friendShipId !== friendShipId,
//                         ) || [];
//                       const friend = friendPage?.find(
//                         (c: { friendShipId: any }) => c?.friendShipId == friendShipId,
//                       );
//                       return [
//                         ...anotherFriend,
//                         {
//                           friendShipId: friend?.friendShipId,
//                           value: friend?.value + 1,
//                         },
//                       ];
//                     })
//                   }
//                   className="-my-6 flex w-fit self-center px-3"
//                 >
//                   Load more...
//                 </Button>
//               )}
//               {/* {isFetching && <p>Loading more...</p>} */}
//               {allMessages?.allMessage?.map((message) => {
//                 const messageSenderDetails =
//                   message?.sender?.userId === checkFriendDate?.sender?.userId
//                     ? checkFriendDate?.sender?.details
//                     : checkFriendDate?.receiver?.details;

//                 const messageReceiverDetails =
//                   message?.receiver?.userId === checkFriendDate?.sender?.userId
//                     ? checkFriendDate?.receiver?.details
//                     : checkFriendDate?.sender?.details;
//                 // Function to render the files in the message
//                 const renderFiles = (files: IFileAfterUpload[]) => {
//                   return files?.map((file, index) => {
//                     if (file.mimetype.startsWith('image/')) {
//                       // If the file is an image, display it directly
//                       return (
//                         <CustomImageTag
//                           key={index}
//                           src={file}
//                           preview={true}
//                           alt={file.filename}
//                           className="h-20 w-20 rounded-lg"
//                         />
//                       );
//                     } else if (file.mimetype === 'application/pdf') {
//                       // If the file is a PDF, show a PDF icon
//                       return (
//                         <a
//                           key={index}
//                           href={fileObjectToLink(file)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center gap-2"
//                         >
//                           <FaFilePdf />
//                           <span>
//                             {file?.filename?.length > 8
//                               ? file.filename.slice(0, 8) + '..'
//                               : file.filename}
//                           </span>
//                         </a>
//                       );
//                     } else if (
//                       file.mimetype === 'application/zip' ||
//                       file.mimetype.includes('compressed') ||
//                       file.mimetype === ENUM_MIMETYPE.doc1 ||
//                       file.mimetype === ENUM_MIMETYPE.doc2 ||
//                       file.mimetype === ENUM_MIMETYPE.ppt1 ||
//                       file.mimetype === ENUM_MIMETYPE.ppt2 ||
//                       file.mimetype === ENUM_MIMETYPE.xls1
//                     ) {
//                       // If the file is a ZIP file, show a ZIP icon
//                       return (
//                         <button
//                           key={index}
//                           onClick={() => {
//                             saveAs(fileObjectToLink(file), file?.filename);
//                           }}
//                           className="flex items-center gap-2"
//                         >
//                           <i className="fas fa-file-archive text-yellow-500"></i>
//                           <span className="to-current">{file.filename}</span>
//                         </button>
//                       );
//                     } else if (file.mimetype.includes('audio')) {
//                       // If the file is an audio file, show an audio icon
//                       return (
//                         <audio key={index} controls>
//                           <source src={fileObjectToLink(file)} type="audio/mpeg" />
//                           Your browser does not support the audio element.
//                         </audio>
//                       );
//                     } else {
//                       return null;
//                     }
//                   });
//                 };
//                 return message?.sender?.userId === user?.userId ? (
//                   <div
//                     key={message._id}
//                     className="flex items-start justify-end gap-3 border-b pb-1"
//                     ref={scrollRef}
//                   >
//                     <div>
//                       <h1 className="items-center justify-end gap-2 text-end text-base font-semibold lg:flex">
//                         <p className="text-xs font-normal">
//                           {getChatTimer(message?.createdAt)}
//                         </p>
//                       </h1>
//                       {/* Render files if any */}
//                       <div className="flex flex-wrap justify-end gap-2">
//                         {message?.files && renderFiles(message?.files)}
//                       </div>
//                       <p className="text-end">{message?.message}</p>
//                     </div>
//                     <div className="flex flex-col items-center justify-end">
//                       {/* <p>
//                         {" "}
//                         {message?.sender?.details?.name?.firstName +
//                           " " +
//                           message?.sender?.details?.name?.lastName}
//                       </p> */}
//                       {/* <p>
//                         {" "}
//                         {messageSenderDetails?.name?.firstName +
//                           " " +
//                           messageSenderDetails?.name?.lastName}
//                       </p> */}
//                       {/* <CustomImageTag
//                         src={messageSenderDetails?.profileImage}
//                         className="h-14 w-14 rounded-full"
//                         alt="user"
//                         height={100}
//                         width={100}
//                       /> */}
//                     </div>
//                   </div>
//                 ) : (
//                   <div
//                     key={message._id}
//                     ref={scrollRef}
//                     className="flex items-start justify-start gap-3 border-b pb-1"
//                   >
//                     <div className="flex min-w-14 flex-col items-center justify-start">
//                       {/* <span>
//                         {messageReceiverDetails?.name?.firstName +
//                           " " +
//                           messageReceiverDetails?.name?.lastName}
//                       </span> */}
//                       <CustomImageTag
//                         src={messageReceiverDetails?.profileImage}
//                         className="h-12 w-12 rounded-full"
//                         alt="user"
//                         height={100}
//                         width={100}
//                         preview={true}
//                       />
//                     </div>
//                     <div>
//                       <h1 className="text-start text-base font-semibold">
//                         <span className="mr-3 text-xs font-normal">
//                           {getChatTimer(message?.createdAt)}
//                         </span>
//                       </h1>
//                       {/* Render files if any */}
//                       <div className="flex flex-wrap justify-end gap-2">
//                         {message?.files && renderFiles(message?.files)}
//                       </div>
//                       <p className="text-start">{message?.message}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//               {isFetching ? (
//                 <div className="flex items-start justify-start gap-2 p-5">
//                   <Skeleton.Avatar active={true} size="small" shape="circle" />
//                   <Skeleton.Avatar active={true} size="small" shape="circle" />
//                   <Skeleton.Avatar active={true} size="small" shape="circle" />
//                   <Skeleton.Avatar active={true} size="small" shape="circle" />
//                   <Skeleton.Avatar active={true} size="small" shape="circle" />
//                 </div>
//               ) : null}
//             </div>
//           ) : (
//             <div>
//               {/* <p className="text-center text-7xl font-bold text-red-500">
//                 You are not friends
//               </p> */}
//             </div>
//           )}
//         </div>

//         <div
//           className="relative flex items-center justify-center border-t p-2 shadow-lg lg:justify-start"
//           // style={{ background: "#F0F2F5" }}
//         >
//           <Form
//             form={form}
//             layout="inline"
//             onFinish={onFinish}
//             className="flex w-full items-center"
//           >
//             <div className="flex w-full flex-wrap items-center justify-center lg:justify-start">
//               {/* Input Field */}
//               <Form.Item
//                 name="message"
//                 // style={{ width: "75%" }}
//                 className="flex-grow"
//               >
//                 <Input
//                   size="large"
//                   allowClear
//                   placeholder="Aa"
//                   className="!min-w-64 !rounded-full px-4 !shadow-none lg:!min-w-[750px]"
//                   style={{
//                     // minWidth: "30rem",
//                     minHeight: '40px',

//                     // background: "#fff",
//                   }}
//                   onChange={(e) => {
//                     handleInputChange(e.target.value);
//                   }}
//                 />
//               </Form.Item>
//               {/* File Upload Button */}
//               <Form.Item className="relative">
//                 <input
//                   type="file"
//                   id="fileUpload"
//                   multiple // Allow selecting multiple files
//                   style={{ display: 'none' }}
//                   onChange={(e) => {
//                     handleFileChange(e);
//                   }}
//                   accept="image/*, .doc, .docx, .ppt, .pptx, .pdf, .zip" // Accept all image formats, PDF, and ZIP files
//                 />
//                 <Button
//                   type="text"
//                   icon={
//                     <Badge count={selectedFiles?.length}>
//                       <PaperClipOutlined style={{ fontSize: '20px', color: '#0084ff' }} />
//                     </Badge>
//                   }
//                   //@ts-ignore
//                   onClick={() => document.getElementById('fileUpload').click()}
//                   style={{
//                     backgroundColor: 'transparent',
//                     border: 'none',
//                     marginLeft: '1px',
//                     fontSize: '24px',
//                     cursor: 'pointer',
//                   }}
//                 />
//               </Form.Item>

//               {/* Emoji Button */}
//               <Form.Item className="relative">
//                 <Button
//                   type="text"
//                   icon={<SmileOutlined style={{ fontSize: '20px', color: '#0084ff' }} />}
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   style={{
//                     backgroundColor: 'transparent',
//                     border: 'none',
//                     marginLeft: '1px',
//                     fontSize: '24px',
//                     cursor: 'pointer',
//                   }}
//                 />
//                 {showEmojiPicker && (
//                   <div
//                     className="emoji-picker"
//                     style={{
//                       position: 'absolute',
//                       bottom: '50px',
//                       zIndex: 1000,
//                       right: '0',
//                     }}
//                   >
//                     {/* <EmojiPicker onEmojiClick={handleEmojiClick} /> */}
//                     <React.Suspense fallback={<Skeleton />}>
//                       {showEmojiPicker && (
//                         <LazyEmojiPicker onEmojiClick={handleEmojiClick} />
//                       )}
//                     </React.Suspense>
//                   </div>
//                 )}
//               </Form.Item>

//               {/* Send Button */}
//               <Form.Item>
//                 <Button
//                   type="default"
//                   htmlType="submit"
//                   icon={<SendOutlined style={{ fontSize: '20px', color: '#0084ff' }} />}
//                   loading={messageLoading}
//                   className="send-button"
//                   style={{
//                     backgroundColor: 'transparent',
//                     border: 'none',
//                     fontSize: '24px',
//                     marginLeft: '',
//                     cursor: 'pointer',
//                   }}
//                 />
//               </Form.Item>
//             </div>
//             <br />
//             {/* <div className="my-3 flex w-full items-center justify-center rounded-2xl border shadow-lg">
//               <AudioRecord
//                 audioFileLiveUrlRef={audioFileLiveUrlRef}
//                 form={form}
//                 isReset={isReset}
//               />
//             </div> */}
//             <div className="my-3 flex items-center rounded-2xl border shadow-lg lg:justify-center">
//               <div className="w-full">
//                 <Tooltip title="Click and start record, Return click Same point then stop">
//                   <AudioRecordV2
//                     audioFileLiveUrlRef={audioFileLiveUrlRef}
//                     form={form}
//                     isReset={isReset}
//                   />
//                 </Tooltip>
//               </div>
//             </div>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }
