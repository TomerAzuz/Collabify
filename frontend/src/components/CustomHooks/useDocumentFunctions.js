import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

import { postDocument, getDocuments, getDocumentById, updateDocument } from '../Services/documentService.js';
import { useAuth } from '../Auth/AuthContext.js';
import { postFile } from '../Services/s3Service.js';
import templates from '../Templates/templates.json';

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
      allowTaint: true
    });

    const test = canvas.toDataURL('image/jpeg');
    console.log(test)
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
      return response;
    } catch (error) {
      console.error('Error uploading preview image: ', error);
      throw error;
    }
  };

  const saveDocument = async (doc, editorRef, displayNotification) => {
    try {
      const previewUrl = await captureDocumentPreview(editorRef, doc.id);         
      const document = {
        content: doc.content,
        previewUrl: previewUrl,
      };
      const response = await updateDocument(doc.id, document);
      if (response && displayNotification) {
        toast.success('Document saved');
      }
      return response;
    } catch (error) {
      toast.error('Error saving document:', error.message);
      throw error;
    }
  };

  const addCollaborator = async (document) => {
    try {
      await updateDocument(document.id, {
        collaborators: [...document.collaborators, user.uid],
      });
    } catch (error) {
      console.error('Failed to update collaborators: ', error.message);
      throw error;
    }
  };

  const fetchDocument = useCallback(async (documentId) => {
    try {
      const response = await getDocumentById(documentId);
      if (response.createdBy !== user.uid && !response.collaborators.includes(user.uid)) {
        await addCollaborator(response);
      }
      return response;
    } catch (error) {
      console.error('Failed to fetch document with id ', documentId, ": ", error.message);
      throw error;
    }
  }, [user.uid]);

  const createDocument = async (content) => {
    try {
      const document = {
        title: 'untitled document',
        content: content || templates.blank.content,
        previewUrl: '',
        permission: 'Viewer',
      };
      const response = await postDocument(document);
      return response;
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
    fetchDocuments
  };
};

export default useDocumentFunctions;