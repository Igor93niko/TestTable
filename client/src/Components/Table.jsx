import React, { useCallback, useEffect, useState } from 'react';
import imageDown from '../Image/sort-down_icon-icons.com_73402.png';
import imageUp from '../Image/sort-up_icon-icons.com_73402.png';
import axios from 'axios';
import Filter from './Filter';
import Pagination from './Pagination';
import Fields from './Fields';


const Table = () => {

  const [pageNumber,setPageNumber] = useState(0);
  const [currentPage,setCurrentPage] = useState('1');
  const [sortVariant,setSortVariant] = useState({name:1,count:1,distance:1});
  const [filtVariant,setFilVariant] = useState({filValue:'',filCond:'equals',filColl:'name'});
  const [base,setBase] = useState([]);
  const [data,setData] = useState([]);
  const [dataView,setDataView] = useState([]);
  const [lastSort,setLastSort] = useState('');
  /*
    Функция для запроса данных из сервера 
  */
  const getDate = useCallback(async()=>{
    try {
      const res = await axios({method:'GET', url:'/get'});
      if (res.status === 200){
        setBase(res.data);
        setData(res.data);
      }  
    } catch (error) {
      console.error(error);
    }
  },[setBase]);
  /*
    Делаем запрос данных
  */
  useEffect(()=>{
    getDate();
  },[getDate]);
  /*
    Отслеживаем изменения для заполения отображаемого массива
  */  
  useEffect(()=>{
    setPageNumber(Math.ceil(data.length/10));
    setDataView(data.slice((currentPage-1)*10,currentPage*10))
  },[data, currentPage]);


  const compare = useCallback ((a,b)=>{
    if (a[lastSort]<b[lastSort])
    {
      return sortVariant[lastSort];
    }
    if (a[lastSort]>b[lastSort])
    {
      return -sortVariant[lastSort];
    }
      return 0;
},[sortVariant,lastSort]);
  /* 
    Отслеживаем изменения фильтра
  */

  useEffect(()=>{
    if (filtVariant.filValue !== '')
    {
      const newData = base.slice(0);
      const filter = newData.filter(field=>{
        switch (filtVariant.filCond){
          case 'equals':
            {
              return field[filtVariant.filColl] == filtVariant.filValue;
            }
          case 'more':
            {
              return field[filtVariant.filColl] > filtVariant.filValue;
            }
          case 'less':
            {
              return field[filtVariant.filColl] < filtVariant.filValue;
            }
          case 'contains':
            {
              const index = (''+field[filtVariant.filColl]).indexOf(filtVariant.filValue);
              if (index === -1)
              {
                return false;
              }
              return true;
            }
          default: return true;
        }
      });
      filter.sort((a,b)=>{
        return compare(a,b);
      });
      setData(filter);
      const newPageNumber = Math.ceil(filter.length/10);
      setPageNumber(newPageNumber);
    }
  },[filtVariant,base,compare,lastSort]);



  /*
    Проверяем не стала ли текущая страница меньше общего количества страниц
  */
  useEffect(()=>{
    if ((currentPage > pageNumber) && (pageNumber!==0)){
      setCurrentPage(pageNumber);
    }
  },[pageNumber,currentPage]);
  /*
    Осуществляем сортировку по выбранной колонке, 
    а также переключаем переключатель для сортировки по 
    возрастанию или убыванию
  */
  const clickSort = useCallback((e) => {
    setLastSort(e.target.name);
    const newData = data.slice(0);
    const val = sortVariant[e.target.name];
    setSortVariant({...sortVariant,[e.target.name]:-val});
    newData.sort(
              (a,b)=>
                  {
                    if (a[e.target.name]<b[e.target.name])
                    {
                      return -sortVariant[e.target.name];
                    }
                    if (a[e.target.name]>b[e.target.name])
                    {
                      return sortVariant[e.target.name];
                    }
                      return 0;
                  });
    setData(newData);
  },[setData,setSortVariant,sortVariant,data]);
  /*
    Осуществляем отслеживание изменений значения фильтра
  */
  const changeFilter = useCallback(e => {
    if (e.target.name === 'filValue' && e.target.value === ''){
      const newDate = base.slice(0);
      newDate.sort((a,b)=>{
        return compare(a,b);
      });
      setData(newDate);
    }
    setFilVariant({...filtVariant,[e.target.name]:e.target.value.trim()});
  },[setFilVariant,filtVariant,base,compare]);
  /*
    Переключатель по номеру страницы
  */
  const changePage = useCallback((value)=>{
    setCurrentPage(value);
  },[setCurrentPage]);

  return (
    <>
    <Filter filtVariant={filtVariant} changeFilter={changeFilter}/>
    <div className='mainTable'>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>
              <span className='tableHead'>
                Название {(sortVariant.name===-1)?
                <img src={imageDown} alt="Icon_sort" className="iconSort" name='name' onClick={clickSort}/>:
                <img src={imageUp} alt="Icon_sort" className="iconSort" name='name' onClick={clickSort}/>}
              </span>
            </th>
            <th>
              <span className='tableHead'>
                Количество 
                {(sortVariant.count===-1)?
                <img src={imageDown} alt="Icon_sort" className="iconSort" name='count' onClick={clickSort}/>:
                <img src={imageUp} alt="Icon_sort" className="iconSort" name='count' onClick={clickSort}/>}
              </span>
            </th>
            <th>
              <span className='tableHead'>
                Расстояние 
                {(sortVariant.distance===-1)?
                <img src={imageDown} alt="Icon_sort" className="iconSort" name='distance' onClick={clickSort}/>:
                <img src={imageUp} alt="Icon_sort" className="iconSort" name='distance' onClick={clickSort}/>}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            dataView.length>0?
            dataView.map((field,index)=>{
              return(
                <Fields key={index} field={field}/> 
              )
            }):
            <tr>
              <td colSpan={4}>
                <h2 style={{textAlign:'center'}}>Данных нет</h2>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
      <Pagination pageNumber={pageNumber} changePage={changePage} currentPage={currentPage}/>
    </>
  );
};

export default Table;