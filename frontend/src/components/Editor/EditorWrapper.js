import { useState, useEffect } from "react";
import { useLocation, useParams } from 'react-router-dom';

import SlateEditor from "./SlateEditor";
import useDocumentFunctions from '../CustomHooks/useDocumentFunctions.js';
import { useAuth } from '../Auth/AuthContext.js';
import Loader from '../Common/Loader/Loader.js';

const EditorWrapper = ({ sharedType, provider }) => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchDocument, addCollaborator } = useDocumentFunctions();
  
  useEffect(() => {
    const getDoc = async () => {
      try {
        setLoading(true);
        let response = await fetchDocument(id);
        if (!doc && 
            response &&
            response.createdBy.uid !== user.uid && 
            !response.collaborators.some(collab => collab.uid === user.uid) &&
            response.collaborators.length < 10) {
              response = await addCollaborator(response);
        }
        setDoc(response);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };
    
    location.state ? setDoc(location.state.doc) : getDoc();
  }, []);

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