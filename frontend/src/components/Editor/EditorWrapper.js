import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import SlateEditor from "./SlateEditor";
import useDocumentFunctions from '../Hooks/useDocumentFunctions.js';
import { useAuth } from '../Auth/AuthContext.js';
import Loader from '../Common/Loader/Loader.js';

const EditorWrapper = ({ sharedType, provider }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchDocument, addCollaborator } = useDocumentFunctions();
  
  useEffect(() => {
    const getDoc = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetchDocument(id);
        if (!response) {
          navigate(`/notFound`);
          return null;
        }
        if (response.createdBy.uid === user.uid || 
            response.collaborators.some(collab => collab.uid === user.uid) || 
            response.collaborators.length >= 10) {
              setDoc(response);
        } else {
          const newResponse = await addCollaborator(response);
          setDoc(newResponse);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Failed to load document.');
      } finally {
        setLoading(false);
      }
    };

    getDoc();

    return () => {
      setDoc(null);
    };
  }, [id]);  
  

  if (loading || !doc) {
    return <Loader />;
  }

  return (
    <SlateEditor 
      sharedType={sharedType}
      provider={provider}
      doc={doc}
      setDoc={setDoc}
    />
  );
};

export default EditorWrapper;