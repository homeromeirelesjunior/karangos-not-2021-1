import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from 'react-router-dom';
import ConfirmDialog from '../ui/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableRow: {
        '& button': {           // Linhas da tabela em estado "normal"
            visibility: 'hidden'
        },
        '&:hover': {            // Linha da tabela com mouse sobreposto
            backgroundColor: theme.palette.action.hover
        },
        '&:hover button': {     // Botões na linha com mouse sobreposto
            visibility: 'visible'
        }
    },
    toolbar: {
        justifyContent: 'flex-end',
        paddingRight: 0
    }
}));

export default function ClientesList() {
    const classes = useStyles()

    const history = useHistory()

    const [clientes, setClientes] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deletable, setDeletable] = useState() // Cód. do registro a ser excluido
    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'Cliente excluído com sucesso'
    })

    function handleDialogClose(result) {
        setDialogOpen(false)
        if (result) deleteItem()
    }

    function handleDeleteClick(id) {
        setDeletable(id)
        setDialogOpen(true)
    }

    async function deleteItem() {
        try {
            await axios.delete(`https://api.faustocintra.com.br/clientes/${deletable}`)
            getData()
            setSnackState({ ...snackState, open: true })  // Exibe a snackbar de sucesso
        }
        catch (error) {
            // Mostra a snackbar de erro
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO' + error.message
            })
        }
    }

    async function getData() {
        try {
            let response = await axios.get('https://api.faustocintra.com.br/clientes')
            if (response.data.length > 0) setClientes(response.data)
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSnackClose(event, reason) {
        // Evita que a snackbar seja fechada clicando-se fora dela
        if (reason === 'clickaway') return
        setSnackState({ ...snackState, open: false }) // Fecha a snackbar
    }


    return (
        <>

            <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Deseja realmente excluir este Cliente?
            </ConfirmDialog>

            <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>

            <h1>Listagem de Clientes</h1>

            <Toolbar className={classes.toolbar}>
                <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    startIcon={<AddBoxIcon />}
                    onClick={() => history.push("/clientesNew")}
                >
                    Novo Cliente
                </Button>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Cód.</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>RG</TableCell>
                            <TableCell align="center">Logradouro</TableCell>
                            <TableCell align="center">Número</TableCell>
                            <TableCell align="center">Complemento</TableCell>
                            <TableCell align="right">Bairro</TableCell>
                            <TableCell align="center">Município</TableCell>
                            <TableCell align="center">UF</TableCell>
                            <TableCell align="center">Telefone</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">Excluir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            clientes.map(cliente =>
                                <TableRow key={cliente.id} className={classes.tableRow}>
                                    <TableCell align="right">{cliente.id}</TableCell>
                                    <TableCell>{cliente.nome}</TableCell>
                                    <TableCell>{cliente.cpf}</TableCell>
                                    <TableCell>{cliente.rg}</TableCell>
                                    <TableCell>{cliente.logradouro}</TableCell>
                                    <TableCell align="center">{cliente.num_imovel}</TableCell>
                                    <TableCell align="center">{cliente.complemento}</TableCell>
                                    <TableCell align="center">{cliente.bairro}</TableCell>
                                    <TableCell align="right">{cliente.municipio}</TableCell>
                                    <TableCell align="right">{cliente.uf}</TableCell>
                                    <TableCell align="right">{cliente.telefone}</TableCell>
                                    <TableCell align="right">{cliente.email}</TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete" onClick={() => handleDeleteClick(cliente.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}