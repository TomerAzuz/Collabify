import { Code, FormatQuote } from '@mui/icons-material';
import { ButtonGroup } from '@mui/material';
import { LooksOne, LooksTwo, /*Checklist, */FormatListBulleted, FormatListNumbered } from '@mui/icons-material';
import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../editor/CustomEditor';
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
    }, {
      title: 'Bulleted list (Ctrl+Shift+8)',
      onClick: () => CustomEditor.toggleBlock(editor, 'bulleted-list'),
      icon: <FormatListBulleted />
    }, {
      title: 'Numbered list (Ctrl+Shift+7)',
      onClick: () => CustomEditor.toggleBlock(editor, 'numbered-list'),
      icon: <FormatListNumbered />
    },
  ]
  return (
    <ButtonGroup variant="outlined" className='button-group'>
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