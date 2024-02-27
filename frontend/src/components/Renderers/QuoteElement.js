const QuoteElement = props => {    
    const styles = {
        textAlign: props.element.type === 'quote' ? props.element.textAlign : '',
        fontSize: props.element.fontSize || 20,
    };

    return (
        <blockquote 
            {...props.attributes}
            style={styles}
        >
            <p>{props.children}</p>
        </blockquote>
    );
};

export default QuoteElement;