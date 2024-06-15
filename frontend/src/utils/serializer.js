import escapeHtml from 'escape-html';
import { Text } from 'slate';

const serializeToHtml = (node) => {
  const stylesToString = (styles) => {
    return Object.entries(styles)
      .map(([key, value]) => (value ? `${key}: ${value}` : ''))
      .join('; ');
  };

  const createTag = (tag, style, children) => {
    const styleString = stylesToString(style);
    return `<${tag} style="${styleString}">${children}</${tag}>`;
  };

  if (Text.isText(node)) {
    const string = escapeHtml(node.text);

    const styles = {
      'font-weight': node.bold ? 'bold' : 'normal',
      'font-style': node.italic ? 'italic' : 'normal',
      'text-decoration': `${node.underline ? 'underline ' : ''}${
        node.strikethrough ? 'line-through' : ''
      }`,
      color: node.color || 'inherit',
      'font-size': `${node.fontSize || 14}pt`,
      'font-family': node.fontFamily || 'inherit',
      'background-color': node.backgroundColor ? 'yellow' : 'transparent',
      margin: `${node.margin || 0}pt`,
    };

    const styleString = stylesToString(styles);

    return `<span style="${styleString}">${string}</span>`;
  }

  const children = node.children.map((n) => serializeToHtml(n)).join('');

  const nodeStyles = {
    h1: {
      'text-align': node.align || '',
    },
    h2: {
      'text-align': node.align || '',
    },
    paragraph: {
      'text-align': node.align || '',
      margin: `${node.margin || 0}pt`,
    },
    image: {
      display: 'block',
      'max-width': '100%',
      'max-height': '20em',
      margin: 'auto',
      'page-break-inside': 'avoid',
    },
    table: {
      width: '80%',
      border: '1px solid black',
      'border-collapse': 'collapse',
      margin: 'auto',
    },
    row: {
      border: '1px solid black',
    },
    cell: {
      border: '1px solid black',
      width: '100px',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'box-sizing': 'border-box',
      'text-align': node.align || '',
      padding: '10px',
    },
  };

  switch (node.type) {
    case 'h1':
      return createTag('h1', nodeStyles.h1, children);
    case 'h2':
      return createTag('h2', nodeStyles.h2, children);
    case 'paragraph':
      return createTag('p', nodeStyles.paragraph, children);
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'table':
      return createTag('table', nodeStyles.table, children);
    case 'table-row':
      return createTag('tr', nodeStyles.row, children);
    case 'table-cell':
      return createTag('td', nodeStyles.cell, children);
    case 'image':
      const styleString = stylesToString(nodeStyles.image);
      return `<img src="${node.data.src}" alt="" style="${styleString}"/>`;

    default:
      return children;
  }
};

export default serializeToHtml;
