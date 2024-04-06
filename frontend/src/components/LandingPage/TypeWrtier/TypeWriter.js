import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

import './TypeWriter.css';

const Typewriter = ({ text, speed }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (currentIndex < text.length) {
      timer = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [text, speed, currentIndex]);

  return (
    <div className="typing-animation">
      <Typography variant="h4" gutterBottom>
        My Document
      </Typography>
      <Typography variant="paragraph" style={{ fontFamily: 'Roboto' }}>
        {currentText}<span className="cursor">|</span>
      </Typography>
    </div>
  );
};

export default Typewriter;
