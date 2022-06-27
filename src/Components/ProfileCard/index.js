import './style.css';
import CloseIcon from '../../assets/close.svg'
import { useState } from 'react'
import api from '../../services/api'
import { getItem, setItem } from '../../utils/storage'

function ProfileCard({ perfil, setPerfil }) {

    const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacaoSenha: '' });

    function handleChangeForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (!form.nome || !form.email || !form.senha || !form.confirmacaoSenha) {
                return;
            }

            if (form.senha !== form.confirmacaoSenha) {
                return;
            }



            const token = getItem('token')

            const response = await api.put('/usuario', {
                nome: form.nome,
                email: form.email,
                senha: form.senha
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }

                })

            setItem('usuarioNome', form.nome)



            console.log('Usuario atualizado!')

            setPerfil(false)



        } catch (error) {
            console.log(error.message)

        }
    }


    return (
        <div className='modal'>
            <form className='card-profile' onSubmit={handleSubmit}>
                <h1>Editar perfil</h1>
                <img onClick={() => setPerfil(false)} src={CloseIcon} alt='close' />
                <label for='nome'>Nome</label>
                <input type='text' name='nome' value={form.nome} onChange={(e) => handleChangeForm(e)} />
                <label for='email'>E-mail</label>
                <input type='email' name='email' value={form.email} onChange={(e) => handleChangeForm(e)} />
                <label for='senha'>Senha</label>
                <input type='password' name='senha' value={form.senha} onChange={(e) => handleChangeForm(e)} />
                <label for='confirmacaoSenha'>Confirmação de Senha</label>
                <input type='password' name='confirmacaoSenha' value={form.confirmacaoSenha} onChange={(e) => handleChangeForm(e)} />
                <button>Confirmar</button>
            </form>
        </div>
    )
}

export default ProfileCard;

