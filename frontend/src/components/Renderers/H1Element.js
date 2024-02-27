const H1Element = props => {    
    const styles = {
        textAlign: props.element.textAlign || 'left',
        fontFamily: props.element.fontFamily || 'Arial',
    };

    return (
        <h1 
            {...props.attributes}
            style={styles}
        >
            {props.children}
        </h1>
    );
};

export default H1Element;