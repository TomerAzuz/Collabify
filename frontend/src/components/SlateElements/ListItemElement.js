const ListItemElement = (props) => {    
  return (
    <li 
      {...props.attributes}
    >
      {props.children}
    </li>
  );
};

export default ListItemElement;