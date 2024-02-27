const Leaf = (props) => {

  const styles = {
    fontWeight: props.leaf.bold ? 'bold' : 'normal',
    fontStyle: props.leaf.italic ? 'italic' : 'normal',
    textDecoration: `${props.leaf.underline ? 'underline ' : ''} ${props.leaf.strikethrough ? 'line-through' : ''}`,
    color: props.leaf.color || '',
    // remove these values from the leaf (should be rendered in a block element)
    fontSize: `${props.leaf.fontSize || '16'}pt`,
    fontFamily: props.leaf.fontFamily || '',
  };

  return (
    <span
      {...props.attributes}
      style={ styles }
    >
      {props.children}
    </span>
  );
};

export default Leaf;