const H2Element = props => {    
    const styles = {
        textAlign: props.element.textAlign || 'left',
        fontFamily: props.element.fontFamily || 'Arial',
    };

    return (
        <h2 
            {...props.attributes}
            style={styles}
        >
            {props.children}
        </h2>
    );
};

export default H2Element;