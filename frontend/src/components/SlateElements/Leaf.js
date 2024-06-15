const Leaf = (props) => {
  const { leaf } = props;

  const styles = {
    fontWeight: leaf.bold ? 'bold' : 'normal',
    fontStyle: leaf.italic ? 'italic' : 'normal',
    textDecoration: `${leaf.underline ? 'underline ' : ''} ${leaf.strikethrough ? 'line-through' : ''}`,
    color: props.leaf.color || '',
    fontSize: `${leaf.fontSize || 14}pt`,
    fontFamily: leaf.fontFamily || '',
    backgroundColor: leaf.backgroundColor ? 'yellow' : '',
  };

  return (
    <span {...props.attributes} style={styles}>
      {props.children}
    </span>
  );
};

export default Leaf;
