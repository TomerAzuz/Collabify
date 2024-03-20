const Leaf = (props) => {

  const styles = {
    fontWeight: props.leaf.bold ? 'bold' : 'normal',
    fontStyle: props.leaf.italic ? 'italic' : 'normal',
    textDecoration: `${props.leaf.underline ? 'underline ' : ''} ${props.leaf.strikethrough ? 'line-through' : ''}`,
    color: props.leaf.color || '',
    fontSize: `${props.leaf.fontSize || '16'}pt`,
    fontFamily: props.leaf.fontFamily || '',
    backgroundColor: props.leaf.backgroundColor ? 'yellow' : '',
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