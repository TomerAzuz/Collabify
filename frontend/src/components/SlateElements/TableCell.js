const TableCell = (props) => {
  const styles = {
    border: '1px solid black',
    minWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    textAlign: props.element.align || '',
  };

  return (
    <td key={props.element.key} style={styles} {...props.attributes}>
      {props.children}
    </td>
  );
};

export default TableCell;
