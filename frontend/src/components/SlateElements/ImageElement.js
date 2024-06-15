import { useSelected, useFocused } from 'slate-react';

const ImageElement = (props) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...props.attributes}>
      {props.children}
      <div contentEditable={false} style={{ position: 'relative' }}>
        <img
          src={props.element.data.src}
          alt=""
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20em',
            margin: 'auto',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
      </div>
    </div>
  );
};

export default ImageElement;
