import '../Toolbar/Toolbar.css';

const ImageElement = props => {
  return (
    <div {...props.attributes}>
      {props.children}
      <div
        contentEditable={false}
        style={{ position: 'relative' }}
      >
        <img
          src={props.element.data.src}
          alt=""
          className='image'
        />
      </div>
    </div>
  );
};

export default ImageElement;