import { Code, FormatQuote } from '@mui/icons-material';
import { ButtonGroup } from '@mui/material';
import { LooksOne, LooksTwo } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const FormattingControls = ({ editor }) => {
  const formats = [{
      title: 'Heading 1',
      onClick: () => CustomEditor.toggleBlock(editor, 'h1'),
      icon: <LooksOne />
    }, {
      title: 'Heading 2',
      onClick: () => CustomEditor.toggleBlock(editor, 'h2'),
      icon: <LooksTwo />
    }, {
      title: 'Code block (Ctrl+`)',
      onClick: () => CustomEditor.toggleBlock(editor, 'code'),
      icon: <Code />
    }, {
      title: 'Quote block',
      onClick: () => CustomEditor.toggleBlock(editor, 'quote'),
      icon: <FormatQuote />
    },
  ]
  return (
    <ButtonGroup variant="outlined" sx={{ borderRadius: '10px', marginLeft: '8px', }}>
      {formats.map((format) => (
        <CustomIconButton
          key={format.title}
          title={format.title}
          onClick={format.onClick}
          icon={format.icon}
        />
      ))}
    </ButtonGroup>
  )
};

export default FormattingControls;