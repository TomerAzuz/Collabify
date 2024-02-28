
const TableElement = props => {
  const styles = {
    width: '80%',
    border: '1px solid black',
    borderCollapse: 'collapse',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <table style={styles}>
      <tbody {...props.attributes}>
        {props.children}
      </tbody>
    </table>
  );
};

export default TableElement;