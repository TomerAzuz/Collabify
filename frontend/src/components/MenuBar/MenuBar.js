import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Toolbar, Container, Typography } from "@mui/material";
import { Article, Save, Download, Info } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';
import { useOthers } from "../../liveblocks.config.js";

import { useAuth } from '../Auth/AuthContext.js';
import useDocuments from '../Hooks/useDocumentFunctions.js';
import ShareDoc from './ShareDocument/ShareDoc.js';
import serializeToHtml from '../Common/Utils/serializer.js';
import Logo from '../Common/Logo/Logo.js';
import Loader from '../Common/Loader/Loader.js';
import DocumentTitle from './DocumentTitle/DocumentTitle.js';
import ButtonsList from './Buttons/ButtonsList.js';

const MenuBar = ({ doc, setDoc, handleSaveDocument, setIsDetailsOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDocument } = useDocuments();
  const [isAutosave, setIsAutosave] = useState(false);
  const [loading, setLoading] = useState(false);

  const others = useOthers();

  const downalodAsPDF = async () => {
    try {
      const response = await handleSaveDocument(true);
      if (response) {
        const documentTitle = response.title;
        const opt = {
          margin: 1,
          filename: `${documentTitle}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          html2canvas: { scale: 2, useCORS: true, allowTaint: false },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };
  
        const content = `${response.content.map(node => serializeToHtml(node)).join('')}`;
        html2pdf().from(content).set(opt).save();
      }
      
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Failed to download file');
    }
  };

  const createNewDocument = async () => {
    try {
      setLoading(true);
      const response = await createDocument();
      setDoc(response);
      navigate(`/document/${response.id}`);
    } catch (error) {
      toast.error('Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  // Autosave (default 30 seconds)
  useEffect(() => {
    let autosaveInterval;
  
    if (isAutosave) {
      autosaveInterval = setInterval(() => {
        handleSaveDocument(true);
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
      onClick: () => handleSaveDocument(false),
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
      <Toolbar sx={{ alignItems: 'center', py: 1 }}>
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
        <Typography variant="caption1" sx={{ ml: 'auto', fontWeight: 'bold', color: '#666', fontFamily: 'Roboto' }}>
            Active users: {others.length + 1}
        </Typography>
        <ShareDoc doc={doc} user={user} />
      </Toolbar>
      {loading && <Loader />}
    </Container>
  );
};

export default MenuBar;
