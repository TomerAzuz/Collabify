import escapeHtml from 'escape-html';
import { Text } from 'slate';

// const serializeNodeWithStyles = (node, children, styles) => {
//   const inlineStyles = Object.entries(styles)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join('; ');

//   return `<${node.type} style="${inlineStyles}">${children}</${node.type}>`;
// };

const serialize = node => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    const styles = {
      'font-weight': node.bold ? 'bold' : 'normal',
      'font-style': node.italic ? 'italic' : 'normal',
      'text-decoration': `${node.underline ? 'underline ' : ''}${node.strikethrough ? 'line-through' : ''}`,
      'color': node.color || 'inherit',
      'font-size': `${node.fontSize || '16'}pt`,
      'font-family': node.fontFamily || 'inherit',
      'background-color': node.backgroundColor ? 'yellow' : 'transparent',
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

  const children = node.children.map(n => serialize(n)).join('')

  const nodeStyles = {
    quote: {
      'text-align': node.textAlign || '',
      'font-size': `${node.fontSize || 20}px`,
    },
    paragraph: {
      'text-align': node.textAlign || '',
      'font-size': `${node.fontSize || '16'}pt`,
      'font-family': node.fontFamily || '',
      'line-height': node.lineHeight || 1.0,
    },
    image: {
      'display': 'block',
      'max-width': '100%',
      'max-height': '20em',
      'margin': 'auto',
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
      'font-size': `${node.fontSize || 16}px`,
    },
  };

  let styles = '';  
  switch (node.type) {
    case 'quote':
      styles = Object.entries(nodeStyles.quote)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<blockquote style="${styles}">${children}</blockquote>`;
    case 'paragraph':
      styles = Object.entries(nodeStyles.paragraph)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `<p style="${styles}">${children}</p>`;
    case 'code':
      return `<pre><code>${children}</code></pre>`;
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
      return `<tr style="${styles}">${children}</tr>`;
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

export default serialize;