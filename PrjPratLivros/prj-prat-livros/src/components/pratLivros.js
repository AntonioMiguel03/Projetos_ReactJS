import styles from './pratLivros.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import agFetch from '../axios/config';
import ImagemPadrao from '../img/capa_livro.png';
import Logo from '../img/Logo_PratLivros.png';

const TelaPrateleira = () => {
  document.title = "Prateleira";

  const [searchTerm, setSearchTerm] = useState('');
  const [livrosNaPrateleira, setLivrosNaPrateleira] = useState([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setLivrosFiltrados(livrosNaPrateleira);
    } else {
      const livroProcurado = livrosNaPrateleira.find((livro) =>
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (livroProcurado) {
        setLivrosFiltrados([livroProcurado]);
      } else {
        setLivrosFiltrados([]);
      }
    }
  };

  const addDaysToDate = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const renderEstrelas = (avaliacao) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= avaliacao) {
        estrelas.push(<span key={i} role="img" aria-label="Estrela Preenchida">⭐️</span>);
      } else {
        estrelas.push(<span key={i} role="img" aria-label="Estrela Vazia">☆</span>);
      }
    }
    return estrelas;
  };

  const getImagemUrl = (livro) => {
    if (livro.imagemSelecionada) {
      if (livro.imagemSelecionada.startsWith('../img')) {
        const nomeArquivo = livro.imagemSelecionada.split('/').pop();
        try {
          return require(`../img/${nomeArquivo}`);
        } catch (error) {
          console.error('Erro ao carregar a imagem:', error);
          return ImagemPadrao;
        }
      } else {
        return livro.imagemSelecionada;
      }
    } else {
      return ImagemPadrao;
    }
  };

  const listarLivros = async () => {
    try {
      const response = await agFetch('/api/listarLivros');
      setLivrosNaPrateleira(response.data);
      setLivrosFiltrados(response.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const deletarLivro = async (livroId) => {
    try {
      const confDeletar = window.confirm('Tem certeza que deseja deletar este livro?');

      if (confDeletar) {
        const response = await agFetch.delete(`/api/deletarLivro/${livroId}`);
        if (response.status === 200) {
          console.log('Livro excluído com sucesso:', response.data);
          listarLivros();
        } else {
          console.error('Erro na resposta do servidor ao excluir livro:', response);
        }
      } else {
        // Acao de cancelamento
      }
    } catch (error) {
      console.error('Erro ao excluir o livro:', error);
    }
  };

  useEffect(() => {
    listarLivros();
  }, []);

  return (
    <div className={styles.fPratLivros}>
      <div className={styles.logoPrat}>
        <img src={Logo} alt="Logo Do Projeto" title="Bem-vindo!" />
      </div>
      <div className={styles.pesquisa}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome do livro"
        />
        <button onClick={handleSearch}>Pesquisar</button>
        <button className={styles.botaoAdicionar} onClick={() => navigate("/CadLivro")}>
          +
        </button>
      </div>
      <div className={styles.prateleira}>
        {livrosFiltrados.length > 0 ? (
          <>
            {livrosFiltrados.map((livro) => (
              <div key={livro.id} className={`${styles.livroItem} livroItem`}>
                <div className={styles.imagem}>
                  <img src={getImagemUrl(livro)} alt="Capa do livro" title="Capa do livro" />
                </div>
                <div className={styles.dados}>
                  <p style={{ textAlign: 'justify' }}>Título: {livro.titulo}</p>
                  <p>Autor: {livro.autor}</p>
                  <p>Data de Publicação: {addDaysToDate(livro.dataPub, 1).toLocaleDateString('pt-BR')}</p>
                  <p>Avaliação: {renderEstrelas(livro.avaliacao)}</p>
                </div>
                <div className={styles.botoes}>
                  <button className={styles.botaoEditar} onClick={() => navigate(`/EdtLivro/${livro.id}`)}>
                    <span role="img" aria-label="Editar">✏️</span> Editar
                  </button>
                  <button className={styles.botaoDeletar} onClick={() => deletarLivro(livro.id)}>Deletar</button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 style={{ color: '#fff', WebkitTextStroke: '1px #000' }}>Nenhum livro encontrado.</h1>
        )}
      </div>
      <br />
      <br />
    </div>
  );
};

export default TelaPrateleira;