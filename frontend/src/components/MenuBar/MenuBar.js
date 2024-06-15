import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Container, Typography } from '@mui/material';
import { Article, Save, Download, Info } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';
import { useOthers } from '../../liveblocks.config.js';

import { useAuth } from '../../AuthContext.js';
import useDocumentFunctions from '../../hooks/useDocumentFunctions';
import ShareDoc from './ShareDocument/ShareDoc.js';
import serializeToHtml from '../../utils/serializer.js';
import Logo from '../Logo/Logo.js';
import DocumentTitle from './DocumentTitle/DocumentTitle.js';
import ButtonsList from '../Buttons/ButtonsList.js';
import NewDocumentDialog from '../Dialogs/NewDocumentDialog.js';

const MenuBar = ({
  doc,
  handleSaveDocument,
  setIsDetailsOpen,
  isSaving,
  setIsSaving,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const others = useOthers();
  const { createDocument } = useDocumentFunctions();
  const [isAutosave, setIsAutosave] = useState(false);
  const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false);

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

        const content = `<div>${response.content.map((node) => serializeToHtml(node)).join('')}</div>`;
        html2pdf().from(content).set(opt).save();
      }
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const createNewDocument = async () => {
    try {
      const response = await createDocument();
      if (response) {
        navigate(`/document/${response.id}`);
      }
    } catch (error) {
      toast.error('Failed to create document');
    }
  };

  // Autosave (default 30 seconds)
  useEffect(() => {
    let autosaveInterval;

    if (isAutosave) {
      autosaveInterval = setInterval(() => {
        setIsSaving(true);
        handleSaveDocument(true);
      }, 30000);
    } else {
      clearInterval(autosaveInterval);
    }

    return () => clearInterval(autosaveInterval);
  }, [isAutosave]);

  const toggleAutosave = (e) => {
    setIsAutosave(e.target.checked);
    toast.success(`Autosave is ${e.target.checked ? 'on' : 'off'}`);
  };

  const buttons = [
    {
      title: 'New Document',
      onClick: () => setIsNewDocDialogOpen(true),
      icon: <Article />,
    },
    {
      title: 'Save (Ctrl+S)',
      onClick: () => handleSaveDocument(false),
      icon: <Save />,
    },
    {
      title: 'Download as PDF',
      onClick: () => downalodAsPDF(),
      icon: <Download />,
    },
    {
      title: 'Document details',
      onClick: () => setIsDetailsOpen((prevOpen) => !prevOpen),
      icon: <Info />,
    },
  ];

  return (
    <>
      <Container maxWidth="xl">
        <Toolbar sx={{ alignItems: 'center', py: 1 }}>
          <Logo variant={'h3'} sx={{ marginLeft: 0 }} />
          <DocumentTitle
            title={doc.title}
            updatedAt={doc.updatedAt}
            isSaving={isSaving}
          />
          <ButtonsList
            buttons={buttons}
            isAutosave={isAutosave}
            toggleAutosave={toggleAutosave}
          />
          <Typography
            variant="caption1"
            sx={{
              ml: 'auto',
              fontWeight: 'bold',
              color: '#666',
              fontFamily: 'Roboto',
            }}
          >
            Active users: {others.length + 1}
          </Typography>
          <ShareDoc doc={doc} user={user} />
        </Toolbar>
      </Container>
      <NewDocumentDialog
        isDialogOpen={isNewDocDialogOpen}
        setIsDialogOpen={setIsNewDocDialogOpen}
        createNewDocument={createNewDocument}
      />
    </>
  );
};

export default MenuBar;
