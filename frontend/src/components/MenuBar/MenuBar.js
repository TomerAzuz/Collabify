import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Typography, Container, Switch } from "@mui/material";
import { Article, Save, Download } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';

import { useAuth } from '../Auth/AuthContext.js';
import useDocuments from '../CustomHooks/useDocumentFunctions.js';
import ShareDoc from './ShareDoc';
import serialize from '../Common/Utils/serializer';
import Logo from '../Common/Logo/Logo.js';
import MenuBarButton from './MenuBarButton.js';
//import RevisionHistory from '../Revisions/RevisionHistory';

const MenuBar = ({ doc, editorRef }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDocument, saveDocument } = useDocuments();
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

  const createNewDocument = async () => {
    try {
      const response = await createDocument();
      navigate(`/document/${response.id}`);
    } catch (error) {
      console.error('Failed to create document');
    }
  };

  const buttons = [
    {
      id: 0,
      title: 'New Document',
      onClick: () => createNewDocument(),
      icon: <Article />
    },
    {
      id: 1,
      title: 'Save',
      onClick: () => saveDocument(doc, editorRef, true),
      icon: <Save />
    },
    {
      id: 2,
      title: 'Download as PDF',
      onClick: () => downalodAsPDF(),
      icon: <Download />
    }
  ];

  useEffect(() => {
    let autosaveInterval;
  
    const autosaveHandler = async () => {
      await saveDocument(doc, editorRef, false);
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

  const handleAutosave = (e) => {
    setIsAutosave(e.target.checked);
    toast.success(`Autosave is ${e.target.checked ? 'on' : 'off'}`)
  } 

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
            onChange={(e) => handleAutosave(e)}
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
