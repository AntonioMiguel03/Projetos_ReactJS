import styles from './cadLivro.module.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import agFetch from '../axios/config';
import agFetchForm from '../axios/configFormData';
import imagemPadrao from '../img/capa_livro.png';
import voltar from '../img/voltar.png';

const TelaCadLivros = () => {
    document.title = "Cadastrar Livro";

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [dataPub, setDataPub] = useState('');
    const [avaliacao, setAvaliacao] = useState(0);
    const [imagemSelecionada, setImagemSelecionada] = useState(imagemPadrao);
    const navigate = useNavigate();

    const handleImagemSelecionada = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagemSelecionada(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const enviarLivroParaServidor = async (livroData) => {
        try {
            if (livroData.imagemSelecionada instanceof File) {
                const responseImagem = await agFetchForm.post('/api/cadastrarLivro', livroData);
                if (responseImagem.status === 200) {
                    alert('Livro cadastrado com sucesso!');
                    navigate('/');
                } else {
                    console.error('Erro na resposta do servidor:', responseImagem);
                }
            } else {
                const response = await agFetch.post('/api/cadastrarLivro', livroData);
                if (response.status === 200) {
                    alert('Livro cadastrado com sucesso!');
                    navigate('/');
                } else {
                    console.error('Erro na resposta do servidor:', response);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data && error.response.data.error;
                alert(`Erro ao cadastrar livro: ${errorMessage}`);
            } else {
                console.error('Erro ao enviar requisição para o servidor:', error);
            }
        }
    };

    const CadastrarLivro = async (titulo, autor, dataPub, avaliacao, imagemSelecionada) => {
        const livroData = {
            titulo,
            autor,
            dataPub,
            avaliacao,
            imagemSelecionada,
        };

        enviarLivroParaServidor(livroData);
    };

    const EnviarLivros = async (e) => {
        e.preventDefault();

        CadastrarLivro(titulo, autor, dataPub, avaliacao, imagemSelecionada);
    };

    return (
        <div className={styles.fCadEdtLivro}>
            <div id={styles["fundoForm"]}>
                <div className={styles.centeredCab}>
                    <img src={voltar} alt="Voltar" title="Voltar para a prateleira" className={styles.btnVoltar} onClick={() => navigate("/")} />
                    <div className={styles.tltForm}>Cadastrar Livro</div>
                </div>
                <br />
                <form onSubmit={(e) => EnviarLivros(e)}>
                    <div className={styles.conteiner}>
                        <div className={styles.esq}>
                            <label htmlFor="titulo">Título:</label>
                            <input type="text" name="titulo" title="Digite um título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required /> <br />
                            <label htmlFor="autor">Autor:</label>
                            <input type="text" name="autor" title="Digite um autor" value={autor} onChange={(e) => setAutor(e.target.value)} required /> <br />
                            <label htmlFor="data">Data de Publicação:</label>
                            <input type="date" name="data" title="Digite uma data" value={dataPub} onChange={(e) => setDataPub(e.target.value)} required /> <br />
                            <div className={styles.avaContainer}>
                                <div className={styles.avaEsq}>Avaliação:</div>
                                <div className={styles.avaDir}>
                                    <span style={{ cursor: 'pointer', color: avaliacao >= 1 ? 'gold' : '#000' }} onClick={() => setAvaliacao(1)}>{avaliacao >= 1 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: avaliacao >= 2 ? 'gold' : '#000' }} onClick={() => setAvaliacao(2)}>{avaliacao >= 2 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: avaliacao >= 3 ? 'gold' : '#000' }} onClick={() => setAvaliacao(3)}>{avaliacao >= 3 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: avaliacao >= 4 ? 'gold' : '#000' }} onClick={() => setAvaliacao(4)}>{avaliacao >= 4 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: avaliacao >= 5 ? 'gold' : '#000' }} onClick={() => setAvaliacao(5)}>{avaliacao >= 5 ? '★' : '☆'}</span>
                                </div>
                            </div>
                            <br />
                            <input type="file" id={styles["fotoCapa"]} name="capa" accept="image/jpeg, image/jpg, image/png" onChange={handleImagemSelecionada} /><br />
                        </div>
                        <div className={styles.dir}>
                            <img src={imagemSelecionada} alt="Capa do Livro" title="Insira uma Capa" className={styles.capaLivro} />
                        </div>
                    </div>
                    <br />
                    <input type="submit" value="Salvar" />
                </form>
            </div>
        </div>
    );
};

export default TelaCadLivros;