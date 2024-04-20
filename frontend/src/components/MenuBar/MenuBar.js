import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip, Toolbar, Typography, Container, Switch } from "@mui/material";
import { Article, Save, Download, Info } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';

import { useAuth } from '../Auth/AuthContext.js';
import useDocuments from '../CustomHooks/useDocumentFunctions.js';
import ShareDoc from './ShareDoc';
import serialize from '../Common/Utils/serializer';
import Logo from '../Common/Logo/Logo.js';
import Loader from '../Common/Loader/Loader.js';
import MenuBarButton from './MenuBarButton.js';

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
      navigate(`/document/${response.id}`, {
        state: { doc: response }
      });
    } catch (error) {
      console.error('Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async (showNotification) => {
    try {
      setLoading(true);
      const response = await saveDocument(doc, editorRef, showNotification);
      setDoc(response);
    } catch(error) {
      console.error('Failed to save document');
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    {
      id: 0,
      title: 'New Document',
      onClick: () => createNewDocument(),
      icon: <Article />
    }, {
      id: 1,
      title: 'Save (Ctrl+S)',
      onClick: () => handleSaveDocument(true),
      icon: <Save />
    }, {
      id: 2,
      title: 'Download as PDF',
      onClick: () => downalodAsPDF(),
      icon: <Download />
    }, {
      id: 3,
      title: 'Document details',
      onClick: () => setIsDetailsOpen((prevOpen) => !prevOpen),
      icon: <Info />
    }
  ];

  // Autosave (every 30 seconds)
  useEffect(() => {
    let autosaveInterval;
  
    if (isAutosave) {
      autosaveInterval = setInterval(() => {
        handleSaveDocument(false);
      }, 30000);
    } else {
      clearInterval(autosaveInterval);
    }
  
    return () => clearInterval(autosaveInterval);
  }, [isAutosave]);

  const toggleAutosave = (e) => {
    setIsAutosave(e.target.checked);
    toast.success(`Autosave is ${e.target.checked ? 'on' : 'off'}`)
  } 

  const lastSaved = new Date(doc.updatedAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Logo variant={'h3'} sx={{ marginLeft: 0 }}/>
        <div 
          style={{ 
            margin: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '16px' 
          }}>
          <Box>
            <Tooltip title={doc.title || 'Document title'}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                {doc.title || 'Untitled'}
              </Typography>
            </Tooltip>
            <Typography variant="subtitle2" color="textSecondary">
              Last saved {lastSaved}
            </Typography>
          </Box>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            {buttons.map((button) => (
              <MenuBarButton key={button.id} button={button} />
            ))}
            <Tooltip title='Autosave'>
              <Switch
                checked={isAutosave}
                onChange={(e) => toggleAutosave(e)}
                inputProps={{ "aria-label": 'Autosave' }}
              />
            </Tooltip>
          </div>
        <div 
          style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          <ShareDoc doc={doc} user={user} />
        </div>
      </Toolbar>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ marginLeft: 50 }}>
            <Loader />
          </div>
        </div>
      )}
    </Container>
  );
};

export default MenuBar;
