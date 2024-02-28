const NumberedListElement = props => {    
  return (
    <ol {...props.attributes}>
      {props.children.map((item) => (
          <li key={item.key}>{item}</li>
      ))}
    </ol>
  );
};

export default NumberedListElement;