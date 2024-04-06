const ParagraphElement = props => {    
    const styles = {
        textAlign: props.element.textAlign || '',
        fontSize: `${props.element.fontSize || '14'}pt`,
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

export default ParagraphElement;