const BulletedListElement = (props) => {
  return <ul {...props.attributes}>{props.children}</ul>;
};

export default BulletedListElement;
