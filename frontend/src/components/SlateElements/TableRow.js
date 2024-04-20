const TableRow = (props) => {
  const styles = {
    border: '1px solid black',
  };

  return (
    <tr {...props.attributes} style={styles}>
      {props.children}
    </tr>
  );
};

export default TableRow;