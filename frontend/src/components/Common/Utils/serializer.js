import escapeHtml from 'escape-html';
import { Text } from 'slate';

const serializeToHtml = node => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    
    const styles = {
      'font-weight': node.bold ? 'bold' : 'normal',
      'font-style': node.italic ? 'italic' : 'normal',
      'text-decoration': `${node.underline ? 'underline ' : ''}${node.strikethrough ? 'line-through' : ''}`,
      'color': node.color || 'inherit',
      'font-size': `${node.fontSize || 14}pt`,
      'font-family': node.fontFamily || 'inherit',
      'background-color': node.backgroundColor ? 'yellow' : 'transparent',
      'margin': `${node.margin || 1}pt`,
    };

    let styleString = Object.entries(styles)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

    if (styleString) {
      string = `<span style="${styleString}">${string}</span>`;
    }

    return string;
  }

  const children = node.children.map(n => serializeToHtml(n)).join('');

  const nodeStyles = {
    h1: {
      'text-align': node.textAlign || '',
    },
    h2: {
      'text-align': node.textAlign || '',
    },
    paragraph: {
      'text-align': node.textAlign || '',
      'margin': `${node.margin || 1}pt`,
    },
    image: {
      'display': 'block',
      'max-width': '100%',
      'max-height': '20em',
      'margin': '10px',
    },
    table: {
      'width': '80%',
      'border': '1px solid black',
      'border-collapse': 'collapse',
      'margin-left': 'auto',
      'margin-right': 'auto',
    },
    row: {
      'border': '1px solid black',
    },
    cell: {
      'border': '1px solid black',
      'width': '100px',
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'box-sizing': 'border-box',
      'text-align': node.textAlign || '',
      'padding': '10px',
    },
  };

  
  let styles = '';  

  switch (node.type) {
    case 'h1':
      styles = Object.entries(nodeStyles[node.type])
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<h1 style="${styles}">${children}</h1>`;

    case 'h2':
      styles = Object.entries(nodeStyles[node.type])
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<h2 style="${styles}">${children}</h2>`;

    case 'paragraph':
      styles = Object.entries(nodeStyles[node.type])
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<p style="${styles}">${children}</p>`;

    case 'bulleted-list':
      return `<ul>${children}</ul>`;

    case 'numbered-list':
      return `<ol>${children}</ol>`;

    case 'list-item':
      return `<li>${children}</li>`;

    case 'table':
      styles = Object.entries(nodeStyles.table)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<table style="${styles}">${children}</table>`;

    case 'table-row':
      styles = Object.entries(nodeStyles.row)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<tr>${children}</tr>`;

    case 'table-cell':
      styles = Object.entries(nodeStyles.cell)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<td style="${styles}">${children}</td>`;

    case 'image':
      styles = Object.entries(nodeStyles.image)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<img src="${node.data.src}" alt="" style="${styles}">`;

    default:
      return children;
  }
}

export default serializeToHtml;