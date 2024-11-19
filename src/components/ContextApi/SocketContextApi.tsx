export default function SocketContextApi() {
  return <div>SocketContextApi</div>;
}

// 'use client';

// import { getSocketBaseUrl } from '@/helpers/config/envConfig';
// import { notification } from 'antd';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useGlobalContext } from './GlobalContextApi';

// export const SocketContext = createContext({});
// export const useSocket = () => {
//   return useContext(SocketContext) as {
//     socket: Socket;
//     socketLoading: boolean;
//     error: any;
//     friendShipId: string;
//     setFriendShipId: any;
//   };
// };

// export const SocketProvider = ({ children }: any) => {
//   const [socketLoading, setLoading] = useState(false);
//   const [socket, setSocket] = useState<Socket | undefined>(undefined);

//   const { userInfo: user, token } = useGlobalContext();

//   // console.log("🚀 ~ SocketProvider ~ token:", token);
//   // const pathname = usePathname();
//   // console.log('🚀 ~ ChatList ~ pathname:', pathname);

//   useEffect(() => {
//     setLoading(true);
//     const socketStore = io(`${getSocketBaseUrl()}`, {
//       extraHeaders: { authorization: token as string },
//       auth: { accessToken: token },
//       //backend--> socketStore.handshake.headers.authorization; //socketStore.handshake.auth.token;
//       reconnectionDelayMax: 2000,
//       query: {
//         'my-key': 'my-value',
//       },
//       reconnection: true, // Enable reconnection
//       reconnectionAttempts: 5, // Number of reconnection attempts before giving up
//       reconnectionDelay: 2000, // Time between reconnection attempts (2 seconds)
//       timeout: 10000,
//       rejectUnauthorized: false,
//       //--solve polling error --> some time it is not working . it is creating problem server in not send token
//       // transports: ["websocket", "polling"],

//       transports: ['websocket', 'polling'],
//       forceNew: true, // Forces a new connection

//       // agent: false, // [2] Please don't set this to true
//       // upgrade: false,
//     });

//     socketStore.on('connection', (data, callback) => {
//       setSocket(socketStore);

//       notification.success({ message: data.message });
//       callback({
//         success: true,
//         message: 'client connection successfully established',
//       });
//     });
//     socketStore.on(`notification::${user?.userId}`, (data, callback) => {
//       notification.success({ message: data.message });
//     });

//     socketStore.on('error', (data) => {
//       console.log('🚀 ~ socketStore.on ~ data:', data);
//       if (data && data.message) {
//         // notification.error({ message: data.message });
//       } else {
//         // notification.error({ message: 'An error occurred on the server' });
//       }
//     });
//     socketStore.on('disconnect', (data) => {
//       // console.log("🚀 ~ socketStore.on ~ data:", data);
//       // notification.error({ message: 'Disconnected from server' });
//       console.log('Disconnected from server');
//     });

//     socketStore.on('reconnect_attempt', (attempt) => {
//       console.log(`Reconnection attempt ${attempt}`);
//       // notification.error({ message: `Reconnection attempt ${attempt}` });
//     });

//     socketStore.on('reconnect_failed', () => {
//       console.log('Reconnection failed after multiple attempts');
//       // notification.error({
//       //   message: 'Reconnection failed after multiple attempts',
//       // });
//     });

//     socketStore.on('reconnect', (attempt) => {
//       console.log(`Successfully reconnected on attempt ${attempt}`);
//       // notification.error({
//       //   message: `Successfully reconnected on attempt ${attempt}`,
//       // });
//     });

//     socketStore.on('connect_error', (error) => {
//       console.error('Connection error:', error);
//       // notification.error("Connection error:", error.message);
//     });

//     setLoading(false);
//     return () => {
//       socketStore.disconnect();
//     };
//   }, [token]);

//   return (
//     <SocketContext.Provider value={{ socket, socketLoading }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
