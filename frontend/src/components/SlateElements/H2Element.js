const H2Element = (props) => {
  const { element } = props;

  return (
      <h2
        {...props.attributes}
        style={{ textAlign: element.textAlign || '' }}
      >
        {props.children}
      </h2>
  );
};

export default H2Element;