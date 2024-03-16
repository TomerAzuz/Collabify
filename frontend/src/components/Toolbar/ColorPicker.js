import { Paper, IconButton, Tooltip } from '@mui/material';

const colors = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF', 
  '#970509', '#FE0F17', '#FE9A2B', '#FFFF43', '#1CFE3E', '#1DFEFE', '#4B86E4', '#0104F9', '#9809F9', '#FE12FA',
  '#E6B8B0', '#F4CCCC', '#FCE5CF', '#FFF2CF', '#D9EAD4', '#D0E0E3', '#C9DAF6', '#CFE2F2', '#D9D2E8', '#EAD1DC',
  '#DC7F6E', '#E9999A', '#F9CBA0', '#FFE59F', '#B6D7AB', '#A3C4C8', '#A4C2F1', '#A0C5E6', '#B4A7D4', '#D5A6BC',
  '#CB432C', '#DF6768', '#F5B272', '#FFD972', '#94C482', '#77A5AE', '#6E9EE7', '#70A8D9', '#8E7CC0', '#C17B9F', 
  '#A51E0C', '#CB0910', '#E59144', '#F1C247', '#6BA856', '#46818D', '#3D78D4', '#3F85C3', '#674EA4', '#A54E78', 
  '#842112', '#980509', '#B3601B', '#BF9024', '#397627', '#154F5B', '#1455C7', '#0E5391', '#351C72', '#731C46', 
  '#5B1004', '#650204', '#783F10', '#7F6015', '#284E19', '#0D343C', '#1D4584', '#093761', '#20124B', '#4C122F', 
];

const ColorPicker = ({ handleColorChange }) => {
  const colorsPerRow = 10;

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px', 
        borderRadius: '8px', 
        boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {colors.map((color, index) => {
        if (index % colorsPerRow === 0) {
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {colors.slice(index, index + colorsPerRow).map((subColor, subIndex) => (
                <Tooltip key={subIndex} title={subColor}>
                  <IconButton
                    key={subIndex}
                    sx={{
                      backgroundColor: subColor,
                      borderRadius: '50%',
                      border: '1px solid grey',
                      width: '30px',
                      height: '30px',
                      margin: 0.3,
                      transition: 'box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        backgroundColor: subColor,
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                      },
                    }}
                    onClick={() => handleColorChange(subColor)}
                  />
                </Tooltip>
              ))}
            </div>
          );
        }
        return null;
      })}
    </Paper>
  );
};

export default ColorPicker;
