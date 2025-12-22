import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const usePersonas = (userId, includePublic = false) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const personasRef = collection(db, "personas");
      let q;

      if (includePublic) {
        // Get user's own personas only (not all public personas)
        q = query(
          personasRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
      } else {
        // Get only user's personas
        q = query(
          personasRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const personasList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPersonas(personasList);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching personas:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("Error setting up personas listener:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [userId, includePublic]);

  return { personas, loading, error };
};

export const usePublicPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicPersonas = async () => {
      try {
        const personasRef = collection(db, "personas");
        const q = query(
          personasRef,
          where("isPublic", "==", true),
          orderBy("upvotes", "desc"),
          limit(50)
        );

        const snapshot = await getDocs(q);
        const personasList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPersonas(personasList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching public personas:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPublicPersonas();
  }, []);

  return { personas, loading, error };
};
