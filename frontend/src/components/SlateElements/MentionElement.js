import { useSelected, useFocused } from 'slate-react';

const MentionElement = (props) => {
  const selected = useSelected();
  const focused = useFocused();

  const style = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.8em',
    fontWeight: 'bold',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  };

  return (
    <span {...props.attributes} style={style} contentEditable={false}>
      {props.children}@{props.element.collab}
    </span>
  );
};

export default MentionElement;
