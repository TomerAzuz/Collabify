import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import SlateEditor from "./SlateEditor";
import useDocumentFunctions from '../Hooks/useDocumentFunctions.js';
import { useAuth } from '../Auth/AuthContext.js';
import Loader from '../Common/Loader/Loader.js';
import ErrorPage from "../ErrorPage/ErrorPage.js";

const EditorWrapper = ({ sharedType, provider }) => {
  const { user } = useAuth();
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchDocument, addCollaborator } = useDocumentFunctions();

  const getDoc = async () => {
    try {
      setLoading(true);
      const response = await fetchDocument(id);
      if (!response) {
        setError({ code: '404' });
        return;
      }
      const { createdBy, collaborators } = response;
      const hasAccess = user.uid === createdBy.uid || collaborators.some(collab => collab.uid === user.uid);

      if (hasAccess) {
        setDoc(response);
      } else if (collaborators.length < 10) {
        const newResponse = await addCollaborator(response);
        if (!newResponse) {
          return;
        }
        setDoc(newResponse);
      } else {
        toast.error('Unable to add collaborator. Please try again.')
        return;
      }
    } catch (error) {
      setError(error);
      toast.error('Failed to load document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoc();

    return () => {
      setDoc(null);
    };
  }, [id]);
  

  if (error) {
    return <ErrorPage code={error.code} />
  }

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