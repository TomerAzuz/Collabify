const TableCell = props => {
  const styles = {
    border: '1px solid black',
    width: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    textAlign: props.element.textAlign,
    fontSize: props.element.fontSize,
  };

  return (
    <td 
      key={props.element.key} 
      style={styles} 
      {...props.attributes}
    >
      {props.children}
    </td>
  );
};

export default TableCell;