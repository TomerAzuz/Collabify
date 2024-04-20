const NumberedListElement = (props) => {    
  return (
    <ol {...props.attributes}>
      {props.children}
    </ol>
  );
};

export default NumberedListElement;