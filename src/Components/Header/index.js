import './style.css'
import Dindin from '../../assets/dindin.svg'
import Profile from '../../assets/profile.svg'
import Logout from '../../assets/logout.svg'
import { useState, useEffect } from 'react'
import { getItem, clear } from '../../utils/storage'
import { useNavigate } from 'react-router-dom';


export default function Header({ perfil, setPerfil }) {
    const [ativar, setAtivar] = useState(false);
    const navigate = useNavigate();
    const nome = getItem('usuarioNome');

    useEffect(() => {

        const token = getItem('token');
        if (token) {
            setAtivar(true)
        }

    }, [])

    async function handleLogout() {
        clear();
        setAtivar(false);
        navigate('/');
    }

    return (
        <header>
            <div className='logo_imagem'>
                <img src={Dindin} alt='dindin' />
            </div>

            {ativar && <nav>
                <img onClick={() => setPerfil(true)} className='perfilImg' src={Profile} alt='profile' />
                <h1>{nome}</h1>
                <img className='logoutImg' src={Logout} alt='logout' onClick={() => handleLogout()} />
            </nav>}
        </header>
    )
}