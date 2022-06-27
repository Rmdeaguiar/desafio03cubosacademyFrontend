import './style.css';
import CloseIcon from '../../assets/close.svg'
import { useState, useEffect } from 'react'
import api from '../../services/api';
import { getItem } from '../../utils/storage';


function EditCard({ showNew, setShowNew, showEdit, setShowEdit, loadTransactions, idTransaction }) {

    const [tipo, setTipo] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategoriesOptions()

    }, [])

    function handleCloseModal() {
        setShowEdit(false)
        setShowNew(false)
    }

    async function handleSubmit(e, id) {
        e.preventDefault();

        const [day, month, year] = data.split('/')

        try {
            if (showNew) {
                const token = getItem('token')



                const response = await api.post('/transacao', {
                    descricao,
                    valor,
                    data: new Date(`${year}-${month}-${day}`),
                    categoria_id: categoria,
                    tipo
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }

                    });

                loadTransactions();
            }

            if (showEdit) {

                const token = getItem('token')


                const response = await api.put(`/transacao/${idTransaction}`, {
                    descricao,
                    valor,
                    data: new Date(`${year}-${month}-${day}`),
                    categoria_id: categoria,
                    tipo
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }

                    });

                loadTransactions();
            }

            setShowNew(false)
            setShowEdit(false)

        } catch (error) {
            console.log(error.message)

        }
    }

    async function loadCategoriesOptions() {

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


    // format(new Date(currentTransaction.data)
    return (
        <div className='modal'>
            <form className='card-edit' onSubmit={handleSubmit}>
                <h1>{showEdit ? 'Editar Registro' : 'Adicionar Registro'}</h1>
                <img onClick={() => handleCloseModal()} src={CloseIcon} alt='close' />

                <div className='btns'>
                    <button type='button' className={`${tipo === 'entrada' ? 'blue' : ''}`} onClick={() => setTipo('entrada')}>Entrada</button>
                    <button type='button' className={`${tipo === 'saida' ? 'red' : ''}`} onClick={() => setTipo('saida')}>Saída</button>
                </div>

                <label>Valor</label>
                <input type='number' name='valor' value={valor} onChange={(e) => setValor(e.target.value)} />
                <label>Categorias</label>
                <select onChange={(e) => setCategoria(e.target.value)}>
                    <option value=''>Selecione</option>
                    {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.id}>{categorie.descricao}</option>
                    ))}
                </select>
                <label>Data</label>
                <input type='text' name='data' value={data} onChange={(e) => setData(e.target.value)} />
                <label>Descrição</label>
                <input type='text' name='descricao' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                <div className='btn_profileCard'>
                    <button type='submit' className='confirm gray'>Confirmar</button>
                </div>
            </form>
        </div>
    )
}

export default EditCard;




