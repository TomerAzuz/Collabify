const ParagraphElement = props => {    
    const styles = {
        textAlign: props.element.textAlign || '',
        fontSize: `${props.element.fontSize || '14'}pt`,
        fontFamily: props.element.fontFamily || '',
        lineHeight: props.element.lineHeight || 1.0,
        margin: `${props.element.margin || 1}em`,
        padding: 0
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