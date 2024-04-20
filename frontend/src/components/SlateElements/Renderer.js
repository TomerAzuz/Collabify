import Leaf from './Leaf';
import ParagraphElement from './ParagraphElement';
import ImageElement from './ImageElement';
import BulletedListElement from './BulletedListElement';
import NumberedListElement from './NumberedListElement';
import TableElement from './TableElement';
import TableRow from './TableRow';
import TableCell from './TableCell';
import ListItemElement from './ListItemElement';
import CheckListItem from './CheckListItem';
import MentionElement from './MentionElement';

const Renderer = {
  renderElement(props) {
    switch (props.element.type) {
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
        case 'check-list-item':
            return <CheckListItem {...props} />
        case 'mention':
            return <MentionElement {...props} />
        default:
            return <ParagraphElement {...props} />
    }
  },
  renderLeaf(props) {
    return <Leaf {...props} />
  },   
};

export default Renderer;