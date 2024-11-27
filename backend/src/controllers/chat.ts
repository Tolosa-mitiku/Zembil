// import { Request, Response } from "express";
// // import admin from "firebase-admin"; // Firebase Admin SDK for Firestore/Realtime DB
// // import serviceAccount from "../firebase-service-account.json";
// import { Chat } from "../models/chat"; // Import the Chat model
// import { User } from "../models/users"; // Import the User model

// // Initialize Firebase Admin SDK
// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// // });

// // Firestore Reference (use for Firestore-based chat storage)
// // const firestore = admin.firestore();

// // Start a new chat between buyer and seller
// export const startNewChat = async (req: Request, res: Response) => {
//   const { buyerId, sellerId } = req.body;

//   try {
//     // Check if a chat already exists between the buyer and seller
//     let chat = await Chat.findOne({ buyerId, sellerId });

//     if (!chat) {
//       // Create a new chat if it doesn't exist
//       const chatRoomId = `chat_${buyerId}_${sellerId}`;
//       chat = new Chat({
//         buyerId,
//         sellerId,
//         chatRoomId,
//         lastMessage: "",
//         unreadMessagesCount: 0,
//       });
//       await chat.save();
//     }

//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: "Error starting new chat", error });
//   }
// };

// // Send a new message in a chat (Firebase will store the messages)
// export const sendMessage = async (req: Request, res: Response) => {
//   const { chatId, senderId, messageText } = req.body;

//   try {
//     // Find the chat in MongoDB
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // Send the message to Firebase (Firestore or Realtime Database)
//     const messageData = {
//       senderId,
//       messageText,
//       timestamp: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     // Store the message in Firestore under the chatRoomId
//     await firestore
//       .collection("chats")
//       .doc(chat.chatRoomId)
//       .collection("messages")
//       .add(messageData);

//     // Update the last message and increment the unread message count
//     chat.lastMessage = messageText;
//     chat.unreadMessagesCount += 1;
//     chat.updatedAt = new Date();
//     await chat.save();

//     // Optionally, send a push notification using Firebase Cloud Messaging (FCM)
//     const payload = {
//       notification: {
//         title: "New Message",
//         body: messageText,
//       },
//       data: {
//         chatId: chatId.toString(),
//       },
//     };

//     // Send FCM notification (use logic to get the recipient's FCM token)
//     const recipientId =
//       chat.buyerId.toString() === senderId
//         ? chat.sellerId.toString()
//         : chat.buyerId.toString();
//     const fcmToken = await getFCMTokenForUser(recipientId);
//     if (fcmToken) {
//       admin.messaging().sendToDevice(fcmToken, payload);
//     }

//     res.status(201).json({ message: "Message sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error sending message", error });
//   }
// };

// // Get chat history from Firebase
// export const getChatHistory = async (req: Request, res: Response) => {
//   const { chatId } = req.params;

//   try {
//     // Find the chat in MongoDB
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // Retrieve the chat messages from Firestore
//     const messagesSnapshot = await firestore
//       .collection("chats")
//       .doc(chat.chatRoomId)
//       .collection("messages")
//       .orderBy("timestamp", "asc")
//       .get();

//     const messages = messagesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching chat history", error });
//   }
// };

// // Get unread messages count for a chat
// export const getUnreadMessagesCount = async (req: Request, res: Response) => {
//   const { chatId } = req.params;

//   try {
//     // Find the chat in MongoDB
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // Return the unread messages count
//     res.status(200).json({ unreadMessagesCount: chat.unreadMessagesCount });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching unread messages count", error });
//   }
// };

// // Function to get FCM token for a user (implement token retrieval logic)
// async function getFCMTokenForUser(userId: string): Promise<string | null> {
//   // Retrieve the FCM token for the user from your database (e.g., MongoDB)
//   const user = await User.findById(userId); // Assuming you have a User model
//   return user?.fcmToken || null;
// }
