import React from 'react';

const Fields = (props) => {
  return (
    <tr>
        <td>{props.field.date}</td>
        <td>{props.field.name}</td>
        <td>{props.field.count}</td>
        <td>{props.field.distance}</td>
    </tr>
  );
};

export default Fields;