import './style.css'
import Header from '../../Components/Header'
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns'
import Filtro from '../../assets/filtro.svg'
import Caneta from '../../assets/caneta.svg'
import Lixeira from '../../assets/lixeira.svg'
import Ordem from '../../assets/ordem.svg'
import { getItem } from '../../utils/storage';
import axios from 'axios'
import ProfileCard from '../../Components/ProfileCard'
import EditCard from '../../Components/EditCard';
import Categories from '../../Components/Categories';




function Home() {

    const [transactions, setTransactions] = useState([]);
    const [saldo, setSaldo] = useState([]);
    const [filter, setFilter] = useState(false);
    const [days, setDays] = useState(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
    const [showNew, setShowNew] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [perfil, setPerfil] = useState(false);
    const [modalDelete, setModalDelete] = useState(false)
    const [idTransaction, setIdTransaction] = useState('');
    const [currentItem, setCurrentItem] = useState(null)

    useEffect(() => {
        loadTransactions()

    }, [])

    async function loadTransactions() {

        try {
            const token = getItem('token')

            const response = await axios.get('http://localhost:8000/transacao', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setTransactions(response.data);

        } catch (error) {
            console.log(error)
        }

        try {

            const token = getItem('token')

            const response = await axios.get('http://localhost:8000/transacao/extrato', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            setSaldo(response.data);

        } catch (error) {
            console.log(error)
        }
    }

    function handleOpenModalDelete(transaction) {
        setCurrentItem(transaction);
        setModalDelete(!modalDelete)

    }


    async function handleDeleteTransaction(id) {

        try {
            const token = getItem('token')
            const deleteTransaction = api.delete(`transacao/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

            const response = await axios.get('http://localhost:8000/transacao', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            setTransactions(response.data);
            setModalDelete(false)

            loadTransactions();



        } catch (error) {
            console.log(error)
        }

    }

    function handleEditTransaction(id) {
        setShowEdit(true)
        setIdTransaction(id)
    }



    return (
        <div className='body-home'>
            <Header
                perfil={perfil}
                setPerfil={setPerfil}
            />

            <div className='container-home'>

                <div className='filter'>
                    <button className='btn-filter' onClick={() => setFilter(!filter)}><img src={Filtro} alt='filtro' /> Filtrar</button>
                </div>
                {filter &&
                    <Categories
                        setTransactions={setTransactions}
                        loadTransactions={loadTransactions}
                    />
                }

                <div className='transactions'>
                    <div className='header-transactions'>
                        <h4>Data <img src={Ordem} alt='seta' /></h4>
                        <h4>Dia da semana</h4>
                        <h4>Descrição</h4>
                        <h4>Categoria</h4>
                        <h4>Valor</h4>
                    </div>
                    <div className='relative'>
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className='list-transactions'>
                                <h4>{format(new Date(transaction.data), "dd/MM/yyyy")}</h4>
                                <h5>{days[getDay(Date.parse(transaction.data))]}</h5>
                                <h5>{transaction.descricao}</h5>
                                <h5>{transaction.categoria_nome}</h5>
                                <h5 className='valor'>{`R$ ${transaction.valor},00`}</h5>
                                <div className='icons'>
                                    <img onClick={() => handleEditTransaction(transaction.id)} src={Caneta} alt='edit' />
                                    <img className='lixeira' onClick={() => handleOpenModalDelete(transaction)} src={Lixeira} alt='delete' />
                                    {modalDelete && transaction.id === currentItem.id &&
                                        <div key={transaction.id} className='excluir-transacao'>
                                            <div className='arrow-up'></div>
                                            <span>Apagar item?</span>
                                            <div className='btn-apagar'>
                                                <button className='blue-btn' onClick={() => handleDeleteTransaction(transaction.id)} >Sim</button>
                                                <button className='red-btn' onClick={() => setModalDelete(false)}>Não</button>
                                            </div>

                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='resume'>
                        <div className='card'>
                            <h1>Resumo</h1>
                            <div className='situation'>
                                <div className='condition'>
                                    <h3>Entrada</h3>
                                    <h3>Saída</h3>
                                </div>
                                <div className='value'>
                                    <h3 className='value_into'>{saldo.entrada ? `R$ ${(saldo.entrada)},00` : 0}</h3>
                                    <h3 className='value_out'>{saldo.saida ? `R$ ${saldo.saida},00` : 0}</h3>
                                </div>
                            </div>
                            <div className='result'>
                                <div className='condition'>
                                    <h3 className='condition_saldo'>Saldo</h3>
                                </div>
                                <div className='value'>
                                    <h3 className='value_saldo'>{`R$${(saldo.entrada - saldo.saida)},00`}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='btn-register'>
                            <button onClick={() => setShowNew(!showNew)}>Adicionar Registro</button>
                        </div>
                    </div>
                </div>
            </div>
            {showNew &&
                <EditCard
                    showNew={showNew}
                    setShowNew={setShowNew}
                    showEdit={showEdit}
                    setShowEdit={setShowEdit}
                    loadTransactions={loadTransactions}
                />
            }
            {showEdit &&
                <EditCard
                    showNew={showNew}
                    setShowNew={setShowNew}
                    showEdit={showEdit}
                    setShowEdit={setShowEdit}
                    loadTransactions={loadTransactions}
                    idTransaction={idTransaction}
                    setIdTransaction={setIdTransaction}
                />
            }
            {perfil &&
                <ProfileCard
                    perfil={perfil}
                    setPerfil={setPerfil}
                />}

        </div>

    )
}

export default Home