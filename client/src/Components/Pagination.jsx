import React, { useCallback, useEffect, useState } from 'react';

const Pagination = (props) => {
  const [buttons,setButtons] = useState([]);
  /*
    Создаем массив кнопок
  */
  useEffect(()=>{
    let res = [];
    for(let i = 1; i <= props.pageNumber; i++)
    {
      res.push({title:i.toString()});
    }
    setButtons(res);
  },[props.pageNumber,setButtons]);
  /*
    Отслеживаем переход по кнопкам
  */
  const changePage = useCallback((e)=>{
    props.changePage(e.target.name);
  },[props]);

  return (
    <div className='pagination'>
      {props.pageNumber > 1?
        buttons.map(button=>{
          return (
            button.title===props.currentPage?
            <button key={button.title} onClick={changePage} name={button.title} className='active'>{button.title}</button>:
            <button key={button.title} onClick={changePage} name={button.title}>{button.title}</button>
          )
        }):
        null
      }
    </div>
  );
};

export default Pagination;