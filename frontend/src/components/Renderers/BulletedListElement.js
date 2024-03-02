const BulletedListElement = props => {    

  return (
    <ul {...props.attributes}>
      {props.children.map((item) => (
      <li key={item.key}>{item}</li>
      ))}
      </ul>
  );
};

export default BulletedListElement;