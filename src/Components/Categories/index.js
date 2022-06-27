import './style.css'
import Soma from '../../assets/soma.svg'
import { getItem } from '../../utils/storage'
import { useState, useEffect } from 'react'
import api from '../../services/api'


export default function Categories({ setTransactions, loadTransactions }) {

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        loadCategories();

    }, [])

    async function loadCategories() {

        try {
            const token = getItem('token')

            const response = await api.get('/categoria', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setCategories(response.data)

        } catch (error) {
            console.log(error)

        }
    }

    async function handleFilterCategories(e) {

        try {

            if (selectedCategories.length) {
                let requisicao = ''

                const token = getItem('token')

                for (let item of selectedCategories) {
                    if (item[selectedCategories.lenght - 1]) {
                        requisicao += `filtro[]=${item}`
                        break
                    }
                    requisicao += `filtro[]=${item}&`
                }


                const response = await api.get(`/transacao?${requisicao}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });

                setTransactions(response.data)

            }


        } catch (error) {
            console.log(error.message)
        }
    }

    async function handleClearFilter() {

        setSelectedCategories([]);
        loadCategories();
        loadTransactions();

    }

    async function handleSelectedCategories(e) {

        setSelectedCategories([...selectedCategories, e.target.value]);

        e.target.classList.toggle('unchecked')
        e.target.classList.toggle('checked');


    }


    return (
        <div className='categories'>
            <h2>Categoria</h2>
            <div className='categorie'>
                {categories.map((categorie) => (
                    <div key={categorie.id} className='btn-categories'>
                        <button
                            value={categorie.descricao}
                            onClick={(e) => handleSelectedCategories(e)} >{categorie.descricao}
                            <img src={Soma} alt='' /></button>
                    </div>
                ))}
            </div>

            <div className='filter-categories'>
                <button onClick={() => handleFilterCategories()}>Aplicar Filtros</button>
                <button onClick={() => handleClearFilter()}>Limpar Filtros</button>
            </div>

        </div>

    )
}


