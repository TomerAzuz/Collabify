import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Container } from "@mui/material";
import { Article, Save, Download, Info } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';

import { useAuth } from '../Auth/AuthContext.js';
import useDocuments from '../Hooks/useDocumentFunctions.js';
import ShareDoc from './ShareDocument/ShareDoc.js';
import serialize from '../Common/Utils/serializer.js';
import Logo from '../Common/Logo/Logo.js';
import Loader from '../Common/Loader/Loader.js';
import DocumentTitle from './DocumentTitle/DocumentTitle.js';
import ButtonsList from './Buttons/ButtonsList.js';

const MenuBar = ({ doc, setDoc, editorRef, setIsDetailsOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDocument, saveDocument } = useDocuments();
  const [isAutosave, setIsAutosave] = useState(false);
  const [loading, setLoading] = useState(false);

  const downalodAsPDF = useMemo(() => () => {
    const filename = doc.title;
    const opt = {
      margin: 0.8,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    const content = doc.content.map(node => serialize(node)).join('');
    html2pdf().from(content).set(opt).save();
  }, [doc]);

  const createNewDocument = async () => {
    try {
      setLoading(true);
      const response = await createDocument();
      setDoc(response);
      navigate(`/document/${response.id}`);
    } catch (error) {
      console.error('Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    try {
      setLoading(true);
      const response = await saveDocument(doc, editorRef, isAutosave);
      setDoc(response);
    } catch(error) {
      console.error('Failed to save document');
    } finally {
      setLoading(false);
    }
  };

  // Autosave (default 30 seconds)
  useEffect(() => {
    let autosaveInterval;
  
    if (isAutosave) {
      autosaveInterval = setInterval(() => {
        handleSaveDocument();
      }, 30000);
    } else {
      clearInterval(autosaveInterval);
    }
  
    return () => clearInterval(autosaveInterval);
  }, [isAutosave]);

  const toggleAutosave = (e) => {
    setIsAutosave(e.target.checked);
    toast.success(`Autosave is ${e.target.checked ? 'on' : 'off'}`)
  };

  const buttons = [
    {
      title: 'New Document',
      onClick: () => createNewDocument(),
      icon: <Article />
    }, {
      title: 'Save (Ctrl+S)',
      onClick: () => handleSaveDocument(),
      icon: <Save />
    }, {
      title: 'Download as PDF',
      onClick: () => downalodAsPDF(),
      icon: <Download />
    }, {
      title: 'Document details',
      onClick: () => setIsDetailsOpen((prevOpen) => !prevOpen),
      icon: <Info />
    }
  ];

  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Logo variant={'h3'} sx={{ marginLeft: 0 }}/>
        <DocumentTitle 
          title={doc.title} 
          updatedAt={doc.updatedAt} 
        />
        <ButtonsList 
          buttons={buttons}
          isAutosave={isAutosave} 
          toggleAutosave={toggleAutosave}
        />
        <ShareDoc doc={doc} user={user} />
      </Toolbar>
      {loading && <Loader />}
    </Container>
  );
};

export default MenuBar;
