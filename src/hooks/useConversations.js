import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const useConversations = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("userId", "==", userId),
        orderBy("lastMessageAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const convosList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setConversations(convosList);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching conversations:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("Error setting up conversations listener:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  return { conversations, loading, error };
};

export const useConversationMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    try {
      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messagesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMessages(messagesList);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching messages:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("Error setting up messages listener:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [conversationId]);

  return { messages, loading, error };
};
