const ParagraphElement = (props) => {    
    const { element } = props;

    const styles = { 
        'textAlign': element.textAlign || '',
        'margin': `${element.margin || 0}pt`,
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