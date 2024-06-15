import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SlateEditor from './SlateEditor';
import useDocumentFunctions from '../../hooks/useDocumentFunctions';
import Loader from '../Loader/Loader.js';
import ErrorPage from '../../pages/ErrorPage/ErrorPage.js';

const EditorWrapper = ({ sharedType, provider }) => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchDocument } = useDocumentFunctions();

  const getDoc = async () => {
    try {
      setLoading(true);
      const response = await fetchDocument(id);
      setDoc(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoc();
  }, [id]);

  if (error) {
    return <ErrorPage code={error.code} />;
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
