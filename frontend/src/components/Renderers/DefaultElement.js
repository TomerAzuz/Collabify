const DefaultElement = props => {    
    const styles = {
        textAlign: props.element.textAlign || '',
        fontSize: `${props.element.fontSize || '16'}pt`,
        fontFamily: props.element.fontFamily || '',
    };
    
    return (
        <p 
            {...props.attributes}
            style={styles}
        >
            {props.children}
        </p>
    );
};

export default DefaultElement;