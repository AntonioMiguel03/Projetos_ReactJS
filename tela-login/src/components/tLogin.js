import './tLogin.css';

const telaLogin = () => {
   return (
    <div className = "fundo">
        <form id = "formLogin">    
            <h1 title = "Bem-Vindo!">Login</h1>
            <div className = "entrada">
                <input type="email" placeholder="Email" title = "Digite seu email" required/><br></br>
                <input type="password" placeholder="Senha" title = "Digite sua senha" required/>
            </div>
            <div className = "botoes">
                <input type = "submit" id = "btnLogin" name = "btnLogin" onClick={() => alert('Entra na sua conta se os dados estiverem corretos!')} value = "Login" />
                
                {/*<button id = "btnCadastrar" onClick={() => window.location='/'}>Cadastrar</button>*/}
                <button id = "btnCadastrar" onClick={() => alert('Vai para a tela de cadastro!')}>Cadastrar</button>
                <input type = "reset" id = "btnApagar" value = "Apagar"/>
            </div>  
        </form>
    </div>
   )
}

export default telaLogin