const H1Element = (props) => {
  const { element } = props;

  return (
    <h1 {...props.attributes} style={{ textAlign: element.align || '' }}>
      {props.children}
    </h1>
  );
};

export default H1Element;
