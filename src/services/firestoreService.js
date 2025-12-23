/**
 * Firestore Service
 * Handles all Firestore database operations
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// ========== PERSONAS ==========

/**
 * Create a new persona
 */
export const createPersona = async (userId, personaData) => {
  try {
    const personasRef = collection(db, "personas");
    const docRef = await addDoc(personasRef, {
      ...personaData,
      userId,
      upvotes: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating persona:", error);
    throw error;
  }
};

/**
 * Update a persona
 */
export const updatePersona = async (personaId, updates) => {
  try {
    const personaRef = doc(db, "personas", personaId);
    await updateDoc(personaRef, updates);
  } catch (error) {
    console.error("Error updating persona:", error);
    throw error;
  }
};

/**
 * Delete a persona
 */
export const deletePersona = async (personaId) => {
  try {
    const personaRef = doc(db, "personas", personaId);
    await deleteDoc(personaRef);
  } catch (error) {
    console.error("Error deleting persona:", error);
    throw error;
  }
};

/**
 * Get a single persona by ID
 */
export const getPersona = async (personaId) => {
  try {
    const personaRef = doc(db, "personas", personaId);
    const personaDoc = await getDoc(personaRef);

    if (personaDoc.exists()) {
      return { id: personaDoc.id, ...personaDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting persona:", error);
    throw error;
  }
};

/**
 * Get multiple personas by IDs
 */
export const getPersonasByIds = async (personaIds) => {
  try {
    const personas = await Promise.all(personaIds.map((id) => getPersona(id)));
    return personas.filter((p) => p !== null);
  } catch (error) {
    console.error("Error getting personas by IDs:", error);
    throw error;
  }
};

// ========== CONVERSATIONS ==========

/**
 * Create a new conversation
 */
export const createConversation = async (
  userId,
  personaIds,
  mode = "single"
) => {
  try {
    const conversationsRef = collection(db, "conversations");
    const docRef = await addDoc(conversationsRef, {
      userId,
      personaIds,
      mode,
      title: "New Conversation",
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

/**
 * Update conversation (e.g., title, last message time)
 */
export const updateConversation = async (conversationId, updates) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      ...updates,
      lastMessageAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (conversationId) => {
  try {
    // Delete all messages first
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const messagesSnapshot = await getDocs(messagesRef);

    const deletePromises = messagesSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);

    // Delete conversation
    const conversationRef = doc(db, "conversations", conversationId);
    await deleteDoc(conversationRef);
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

/**
 * Get a single conversation
 */
export const getConversation = async (conversationId) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (conversationDoc.exists()) {
      return { id: conversationDoc.id, ...conversationDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting conversation:", error);
    throw error;
  }
};

// ========== MESSAGES ==========

/**
 * Add a message to a conversation
 */
export const addMessage = async (conversationId, messageData) => {
  try {
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: serverTimestamp(),
    });

    // Update conversation's last message time
    await updateConversation(conversationId, {});

    return docRef.id;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

/**
 * Get all messages for a conversation
 */
export const getMessages = async (conversationId) => {
  try {
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

// ========== UPVOTES ==========

/**
 * Upvote a persona
 */
export const upvotePersona = async (personaId, userId) => {
  try {
    console.log("upvotePersona called:", { personaId, userId });
    const upvoteRef = doc(db, "personaUpvotes", `${userId}_${personaId}`);
    const upvoteDoc = await getDoc(upvoteRef);

    if (!upvoteDoc.exists()) {
      console.log("Creating upvote record...");
      // Add upvote
      await setDoc(upvoteRef, {
        userId,
        personaId,
        createdAt: serverTimestamp(),
      });
      console.log("Upvote record created");

      // Increment persona upvote count
      console.log("Incrementing persona upvote count...");
      const personaRef = doc(db, "personas", personaId);
      await updateDoc(personaRef, {
        upvotes: increment(1),
      });
      console.log("Persona upvote count incremented successfully");

      return true;
    }

    console.log("Already upvoted this persona");
    return false; // Already upvoted
  } catch (error) {
    console.error("Error upvoting persona:", error);
    console.error("Error details:", error.message, error.code);
    throw error;
  }
};

/**
 * Check if user has upvoted a persona
 */
export const hasUpvoted = async (personaId, userId) => {
  try {
    const upvoteRef = doc(db, "personaUpvotes", `${userId}_${personaId}`);
    const upvoteDoc = await getDoc(upvoteRef);
    return upvoteDoc.exists();
  } catch (error) {
    console.error("Error checking upvote:", error);
    throw error;
  }
};

/**
 * Remove upvote from a persona
 */
export const removeUpvote = async (personaId, userId) => {
  try {
    const upvoteRef = doc(db, "personaUpvotes", `${userId}_${personaId}`);
    const upvoteDoc = await getDoc(upvoteRef);

    if (upvoteDoc.exists()) {
      // Remove upvote
      await deleteDoc(upvoteRef);

      // Decrement persona upvote count
      const personaRef = doc(db, "personas", personaId);
      await updateDoc(personaRef, {
        upvotes: increment(-1),
      });

      return true;
    }

    return false; // Wasn't upvoted
  } catch (error) {
    console.error("Error removing upvote:", error);
    throw error;
  }
};

// ========== PUBLIC PERSONAS ==========

/**
 * Get public personas (for marketplace)
 */
export const getPublicPersonas = async (limitCount = 50) => {
  try {
    const personasRef = collection(db, "personas");
    const q = query(
      personasRef,
      where("isPublic", "==", true),
      orderBy("upvotes", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting public personas:", error);
    throw error;
  }
};

/**
 * Auto-generate conversation title from first message
 */
export const generateConversationTitle = (firstMessage) => {
  // Take first 50 characters and add ellipsis if longer
  const title =
    firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage;
  return title;
};
