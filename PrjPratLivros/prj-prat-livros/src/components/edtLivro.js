import styles from './cadLivro.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import agFetch from '../axios/config';
import imagemPadrao from '../img/capa_livro.png';
import voltar from '../img/voltar.png';

const TelaEdtLivros = () => {
    document.title = "Editar Livro";

    const { id } = useParams();

    const [livro, setLivro] = useState({
        titulo: '',
        autor: '',
        dataPub: '',
        avaliacao: 0,
        imagemSelecionada: imagemPadrao,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLivro = async () => {
            try {
                const response = await agFetch.get(`/api/listarLivros/${id}`);
                if (response.status === 200) {
                    const livroData = response.data;
                    setLivro(livroData);
                } else {
                    console.error('Erro na resposta do servidor:', response);
                }
            } catch (error) {
                console.error('Erro ao obter os dados do livro:', error);
            }
        };

        fetchLivro();
    }, [id]);

    const getImagemUrl = (livro) => {
        if (livro.imagemSelecionada) {
            if (livro.imagemSelecionada.startsWith('../img')) {
                const nomeArquivo = livro.imagemSelecionada.split('/').pop();
                return require(`../img/${nomeArquivo}`);
            } else {
                return livro.imagemSelecionada;
            }
        } else {
            return imagemPadrao;
        }
    };

    const handleImagemSelecionada = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLivro({ ...livro, imagemSelecionada: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const atualizarLivro = async (livroData) => {
        try {
            const response = await agFetch.patch(`/api/atualizarLivro/${id}`, livroData);
            if (response.status === 200) {
                console.log('Livro atualizado com sucesso:', response.data);
                alert("Livro Atualizado com Sucesso!");
                navigate("/");
            } else {
                console.error('Erro na resposta do servidor ao atualizar livro:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar o livro:', error);
        }
    };

    const EditarLivro = async (titulo, autor, dataPub, avaliacao, imagemSelecionada) => {
        const livroData = {
            titulo,
            autor,
            dataPub,
            avaliacao,
            imagemSelecionada,
        };

        atualizarLivro(livroData);
    };

    const EnviarLivros = async (e) => {
        e.preventDefault();

        EditarLivro(livro.titulo, livro.autor, livro.dataPub, livro.avaliacao, livro.imagemSelecionada);
    };

    return (
        <div className={styles.fCadEdtLivro}>
            <div id={styles["fundoForm"]}>
                <div className={styles.centeredCab}>
                    <img src={voltar} alt="Voltar" title="Voltar para a prateleira" className={styles.btnVoltar} onClick={() => navigate("/")} />
                    <div className={styles.tltForm}>Editar Livro</div>
                </div>
                <br />
                <form onSubmit={(e) => EnviarLivros(e)}>
                    <div className={styles.conteiner}>
                        <div className={styles.esq}>
                            <label htmlFor="titulo">Título:</label>
                            <input
                                type="text"
                                name="titulo"
                                title="Digite um título"
                                value={livro.titulo}
                                onChange={(e) => setLivro({ ...livro, titulo: e.target.value })}
                                required
                            /> <br />
                            <label htmlFor="autor">Autor:</label>
                            <input
                                type="text"
                                name="autor"
                                title="Digite um autor"
                                value={livro.autor}
                                onChange={(e) => setLivro({ ...livro, autor: e.target.value })}
                                required
                            /> <br />
                            <label htmlFor="data">Data de Publicação:</label>
                            <input
                                type="date"
                                name="data"
                                title="Digite uma data"
                                value={livro.dataPub}
                                onChange={(e) => setLivro({ ...livro, dataPub: e.target.value })}
                                required
                            /> <br />
                            <div className={styles.avaContainer}>
                                <div className={styles.avaEsq}>Avaliação:</div>
                                <div className={styles.avaDir}>
                                    <span style={{ cursor: 'pointer', color: livro.avaliacao >= 1 ? 'gold' : 'gray' }} onClick={() => setLivro({ ...livro, avaliacao: 1 })}>{livro.avaliacao >= 1 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: livro.avaliacao >= 2 ? 'gold' : 'gray' }} onClick={() => setLivro({ ...livro, avaliacao: 2 })}>{livro.avaliacao >= 2 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: livro.avaliacao >= 3 ? 'gold' : 'gray' }} onClick={() => setLivro({ ...livro, avaliacao: 3 })}>{livro.avaliacao >= 3 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: livro.avaliacao >= 4 ? 'gold' : 'gray' }} onClick={() => setLivro({ ...livro, avaliacao: 4 })}>{livro.avaliacao >= 4 ? '★' : '☆'}</span>
                                    <span style={{ cursor: 'pointer', color: livro.avaliacao >= 5 ? 'gold' : 'gray' }} onClick={() => setLivro({ ...livro, avaliacao: 5 })}>{livro.avaliacao >= 5 ? '★' : '☆'}</span>
                                </div>
                            </div>
                            <br />
                            <input
                                type="file"
                                id={styles["fotoCapa"]}
                                name="capa"
                                accept="image/jpeg, image/jpg, image/png"
                                onChange={handleImagemSelecionada}
                            /><br />
                        </div>
                        <div className={styles.dir}>
                            <img src={getImagemUrl(livro)} alt="Capa do Livro" title="Insira uma Capa" className={styles.capaLivro} />
                        </div>
                    </div>
                    <br />
                    <input type="submit" value="Salvar" />
                </form>
            </div>
        </div>
    );
};

export default TelaEdtLivros;