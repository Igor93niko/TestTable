import React from 'react';

const Filter = (props) => {

  return (
    <div className='filter'>
      <select className='filterSelect' name="filColl" value={props.filtVariant.filColl} onChange={props.changeFilter}>
        <option value='name'>Название</option>
        <option value='count'>Количество</option>
        <option value='distance'>Расстояние</option>
      </select>
      <select className='filterSelect' name="filCond" value={props.filtVariant.filCond} onChange={props.changeFilter}>
        <option value='equals'>Равно</option>
        <option value='contains'>Содержит</option>
        <option value='more'>Больше</option>
        <option value='less'>Меньше</option>
      </select>
      <input name="filValue" placeholder='Введите значение:' value={props.filtVariant.filValue} onChange={props.changeFilter}/>
    </div>
  );
};

export default Filter;