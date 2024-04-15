import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Typography, Container, Switch } from "@mui/material";
import html2pdf from 'html2pdf.js';
import { Article, Save, Download } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { useAuth } from '../Auth/AuthContext.js';
import useDocumentFunctions from '../CustomHooks/useDocumentFunctions.js';
import ShareDoc from './ShareDoc';
import serialize from '../Common/Utils/serializer';
import Logo from '../Common/Logo/Logo.js';
import MenuBarButton from './MenuBarButton.js';
//import RevisionHistory from '../Revisions/RevisionHistory';

const MenuBar = ({ doc, editorRef }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDocument, saveDocument } = useDocumentFunctions();
  const [isAutosave, setIsAutosave] = useState(false);

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

  const handleCreateDocument = async () => {
    try {
      const response = await createDocument();
      if (response) {
        navigate(`/document/${response.id}`);
      }
    } catch (error) {
      toast.error('Failed to create document');
    }
  };

  const handleSaveDocument = async (displayToast) => {
    try {
      const response = await saveDocument(doc, editorRef);
      if (response && displayToast) {
        toast.success('Document saved successfully.');
      }
    } catch (error) {
      toast.error('Failed to save document.');
    }
  };

  const buttons = [
    {
      id: 0,
      title: 'New Document',
      onClick: () => handleCreateDocument,
      icon: <Article />
    },
    {
      id: 1,
      title: 'Save',
      onClick: () => handleSaveDocument(true),
      icon: <Save />
    },
    {
      id: 2,
      title: 'Download as PDF',
      onClick: () => downalodAsPDF,
      icon: <Download />
    }
  ];

  useEffect(() => {
    let autosaveInterval;
  
    const autosaveHandler = async () => {
      await handleSaveDocument(false);
    };
  
    if (isAutosave) {
      autosaveInterval = setInterval(() => {
        autosaveHandler();
      }, 5000);
    } else {
      clearInterval(autosaveInterval);
    }
  
    return () => clearInterval(autosaveInterval);
  }, [isAutosave]);

  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Logo variant={'h4'} sx={{ marginLeft: 0 }}/>
        <div 
          style={{ 
            margin: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '16px' 
          }}>
          <Typography 
            variant="body1" 
            sx={{ flexGrow: 0 }} 
          >
            {doc?.title}
          </Typography>
          {buttons.map((button) => (
            <MenuBarButton key={button.id} button={button} />
          ))}
          <Switch
            checked={isAutosave}
            onChange={(e) => setIsAutosave(e.target.checked)}
            inputProps={{ "aria-label": 'Autosave' }}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          {/* <RevisionHistory editor={editor} doc={doc} /> */}
          <ShareDoc doc={doc} user={user} />
        </div>
      </Toolbar>
    </Container>
  );
};

export default MenuBar;
