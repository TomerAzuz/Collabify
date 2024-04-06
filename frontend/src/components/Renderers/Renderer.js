import Leaf from '../Renderers/Leaf';
import ParagraphElement from './ParagraphElement';
import CodeElement from '../Renderers/CodeElement';
import QuoteElement from '../Renderers/QuoteElement';
import ImageElement from '../Renderers/ImageElement';
import BulletedListElement from '../Renderers/BulletedListElement';
import NumberedListElement from '../Renderers/NumberedListElement';
import TableElement from '../Renderers/TableElement';
import TableRow from '../Renderers/TableRow';
import TableCell from '../Renderers/TableCell';
import ListItemElement from '../Renderers/ListItemElement';

const Renderer = {
  renderElement(props) {
    switch (props.element.type) {
        case 'code':
            return <CodeElement {...props}/>
        case 'quote':
            return <QuoteElement {...props} />
        case 'image':
            return <ImageElement {...props} />
        case 'bulleted-list':
            return <BulletedListElement {...props} />
        case 'numbered-list':
            return <NumberedListElement {...props} />
        case 'list-item':
            return <ListItemElement {...props} />
        case 'table':
            return <TableElement {...props} />
        case 'table-row':
            return <TableRow {...props} />
        case 'table-cell':
            return <TableCell {...props} />
        default:
            return <ParagraphElement {...props} />
    }
  },
  renderLeaf(props) {
    return <Leaf {...props} />
  },   
};

export default Renderer;