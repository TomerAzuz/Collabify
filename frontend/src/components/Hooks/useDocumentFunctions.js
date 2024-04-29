import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

import { postDocument, getDocuments, getDocumentById, updateDocument } from '../Services/documentService.js';
import { useAuth } from '../Auth/AuthContext.js';
import { postFile } from '../Services/s3Service.js';
import templates from '../Templates/templates.json';

const cloudFrontDomain = process.env.REACT_APP_AWS_CLOUDFRONT_DOMAIN;

const useDocumentFunctions = () => {
  const { user } = useAuth();

  const captureDocumentPreview = async (editorRef, docId) => {
    const editorElement = editorRef.current;
    if (!editorElement) {
      console.warn('Document container not found. Returning null.');
      return null;
    }

    const canvas = await html2canvas(editorElement, {
      useCORS: true,
      allowTaint: false
    });

    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg'); 
    });
    
    if (!blob) {
      console.error('Failed to create blob from canvas');
      return null;
    }

    const file = new File([blob], `${docId}.jpg`, { type: 'image/jpeg' });

    try {
      const response = await postFile(file);
      if (response.status === 201) {
        return `https://${cloudFrontDomain}.cloudfront.net/${docId}.jpg`
      }
    } catch (error) {
      console.error('Error uploading preview image: ', error);
      throw error;
    }
  };

  const saveDocument = async (doc, editorRef, isAutosave) => {
    try {
      let previewUrl = '';
      if (!isAutosave) {
        previewUrl = await captureDocumentPreview(editorRef, doc.id);
      }
  
      const document = {
        content: doc.content,
        previewUrl: previewUrl || '',
      };
  
      const response = await updateDocument(doc.id, document);
  
      if (response && !isAutosave) {
        toast.success('Document saved');
      }
  
      return response;
    } catch (error) {
      if (!isAutosave) {
        toast.error('Error saving document');
      }
      throw error;
    }
  };
  
  const addCollaborator = async (document) => {
    try {
      const response = await updateDocument(document.id, {
        collaborators: [...document.collaborators, 
        { 
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName || user.email
        }],
      });
      
      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Failed to update collaborators: ', error.message);
      throw error;
    }
  };

  const fetchDocument = useCallback(async (documentId) => {
    try {
      const response = await getDocumentById(documentId);
      return response;
    } catch (error) {
      toast.error('Failed to fetch document');
      throw error;
    }
  }, [user.uid]);

  const createDocument = async (content, title) => {
    try {
      const document = {
        title: title || 'untitled document',
        content: content || templates.blank.content,
        previewUrl: '',
        createdBy: {
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName
        },
        permission: 'Viewer',
      };
      return await postDocument(document);
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  };

  const fetchDocuments = async () => {
    try {
      const fetchedDocuments = await getDocuments();
      return fetchedDocuments;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  };

  return {
    createDocument,
    saveDocument,
    fetchDocument,
    fetchDocuments,
    addCollaborator
  };
};

export default useDocumentFunctions;