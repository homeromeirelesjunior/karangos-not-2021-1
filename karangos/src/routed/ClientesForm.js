import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import InputMask from 'react-input-mask'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory, useParams } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'

const useStyles = makeStyles(() => ({
    form: {
        maxWidth: '80%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px'
        }
    },
    toolbar: {
        marginTop: '36px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    checkbox: {
        alignItems: 'center'
    }
}))

// Representando as classes de caracteres da máscara como um objeto
const formatChars = {    
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
}

const cpfMask = '000.000.000-00'
const rgMask = '00.000.000-0'
const telefoneMask = '(00)00000-0000'

export default function ClientesForm() {
    const classes = useStyles()

    const [cliente, setCliente] = useState({
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    })
    
    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'Cliente salvo com sucesso'
    })

    const[btnSendState, setBtnSendState] = useState({
        disabled: false,
        label: 'Enviar'
    })

    const [error, setError] = useState({
        marca: '',
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        bairro: '',
        municipio: '',
        telefone: '',
        email: ''
    })

    const [isModified, setIsModified] = useState(false)
    const [title, setTitle] = useState('Cadastrar novo Cliente')

    const history = useHistory()
    const params = useParams()

    useEffect(() => {
        // Verifica se tem o parâmetro id na rota. Se tiver, temos que buscar
        // os dados do registro no back-end para edição
        if(params.id) {
            setTitle('Editando Cliente')
            getData(params.id)
        }
    }, [])

    async function getData(id) {
        try {
            let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
            setCliente(response.data)
        }
        catch(error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'Não foi possível carregar os dados para edição.'
            })
        }
    }

    const [dialogOpen, setDialogOpen] = useState(false)

    function handleInputChange(event, property) {

        const clienteTemp = {...cliente}
        // Se houver id no event.target, ele será o nome da propriedade
        // senão, usaremos o valor do segundo parâmetro
        if (event.target.id) property = event.target.id
        
        if (property === 'email') {
            // setKarango({ ...karango, [property]: event.target.value.toUpperCase() })
            clienteTemp[property] = event.target.value.toLowerCase()
        } else {
            // Quando o nome de uma propriedade de um objeto aparece entre [],
            // isso se chama "propriedade calculada". O nome da propriedade vai
            // corresponder à avaliação da expressão entre os colchetes
            clienteTemp[property] = event.target.value
        }
        setCliente(clienteTemp)
        setIsModified(true)     // O formulário foi modificado
        validate(clienteTemp)   // Dispara a validação
    }

    function validate(data) {
        const errorTemp = {
            nome: '',
            cpf: '',
            rg: '',
            logradouro: '',
            num_imovel: '',
            bairro: '',
            municipio: '',
            uf: '',
            telefone: '',
            email: ''
        }
        let isValid = true

        // Validação do campo Nome
        if(data.nome.trim() === '') {
            errorTemp.nome = 'O nome deve ser preenchido'
            isValid = false
        }

        // Validação do campo CPF
        if(data.cpf.trim() === '' || data.cpf.includes('_')) {
            errorTemp.cpf = 'CPF deve ser corretamente preenchido'
            isValid = false
        }

        // Validação do campo RG
        if(data.rg.trim() === '' || data.rg.includes('_')) {
            errorTemp.rg = 'RG deve ser preenchido'
            isValid = false
        }

        // Validação do campo Logradouro
        if(data.logradouro.trim() === '') {
            errorTemp.logradouro = 'Logradouro deve ser preenchido'
            isValid = false
        }

         // Validação do campo Número
        if(data.num_imovel.trim() === '') {
            errorTemp.num_imovel = 'Número deve ser preenchido'
            isValid = false
        }

        // Validação do campo Bairro
        if(data.bairro.trim() === '') {
            errorTemp.bairro = 'RG deve ser preenchido'
            isValid = false
        }
        
        // Validação do campo Município
        if(data.municipio.trim() === '') {
            errorTemp.municipio = 'Município deve ser preenchido'
            isValid = false
        }

        // Validação do campo Telefone
        if(data.telefone.trim() === '' || data.telefone.includes('_')) {
            errorTemp.telefone = 'Telefone deve ser corretamente preenchido'
            isValid = false
        }

        // Validação do campo Email
        if(data.email.trim() === '') {
            errorTemp.email = 'Email deve ser preenchido'
            isValid = false
        }

        setError(errorTemp)

        return isValid
    }

    async function saveData() {
        try {
            // Desabilitar o botão Enviar
            setBtnSendState({disabled: true, label: 'Enviando...'})

            // Se o registro já existe (edição)
            if(params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, cliente)
            // Registro não existe, cria um novo (verbo HTTP POST)
            else await axios.post('https://api.faustocintra.com.br/clientes', cliente)

            setSnackState({
                open: true,
                severity: 'success',
                message: 'Cliente salvo com sucesso'
            })
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'Erro: ' + error.message
            })
        }
        // Reabilitar o botão Enviar
        setBtnSendState({
            disabled: false,
            label: 'Enviar'
        })
    }

    function handleSubmit(event) {

        event.preventDefault()
        
        // Só salva os dados se eles forem válidos
        if(validate(cliente)) saveData()

    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSnackClose(event, reason) {
        // Evita que a snackbar seja fechada clicando-se fora dela
        if(reason === 'clickaway') return
        setSnackState({...snackState, open: false}) // Fecha a snackbar

        // Retorna à página de listagem
        history.push('/clientesList')
    }

    function handleDialogClose(result) {
        setDialogOpen(false)
    
        // Se o usuário concordou em voltar 
        if(result) history.push('/clientesList')
    }

    function handleGoBack() {

        // Se o formulário estiver modificado, mostramos o diálogo de confirmação
        if(isModified) setDialogOpen(true)
        // Senão, voltamos diretamente à página de listagem
        else history.push('/clientesList')
    }

    return (
        <>

            <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Há dados não salvos. Deseja realmente voltar?
            </ConfirmDialog>

            <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>
            <h1>{title}</h1>
            <form className={classes.form} onSubmit={handleSubmit}>

                {/* Nome */}
                <TextField
                    id="nome" 
                    label="Nome" 
                    variant="filled" 
                    value={cliente.nome} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.nome !== ''}
                    helperText={error.nome}
                />

                {/* CPF */}
                <InputMask
                    formatChars={formatChars}
                    mask={cpfMask}
                    value={cliente.cpf}
                    id="cpf"
                    onChange={event => handleInputChange(event, 'cpf')}
                >
                    {() => <TextField 
                                label="CPF" 
                                variant="filled" 
                                fullWidth 
                                required
                                error={error.cpf !== ''}
                                helperText={error.cpf}
                            />}
                </InputMask>

                {/* RG */}
                <InputMask
                    formatChars={formatChars}
                    mask={rgMask}
                    value={cliente.rg}
                    id="rg"
                    onChange={event => handleInputChange(event, 'rg')}
                >
                    {() => <TextField 
                                label="RG" 
                                variant="filled" 
                                fullWidth 
                                required
                                error={error.rg !== ''}
                                helperText={error.rg}
                            />}
                </InputMask>

                {/* Logradouro */}
                <TextField
                    id="logradouro" 
                    label="Logradouro" 
                    variant="filled" 
                    value={cliente.logradouro} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.logradouro !== ''}
                    helperText={error.logradouro}
                />

                {/* Número */}
                <TextField
                    id="num_imovel" 
                    label="Número" 
                    variant="filled" 
                    value={cliente.num_imovel} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.num_imovel !== ''}
                    helperText={error.num_imovel}
                />

                {/* Complemento */}
                <TextField
                    id="complemento" 
                    label="Complemento" 
                    variant="filled" 
                    value={cliente.complemento} 
                    onChange={handleInputChange} 
                    fullWidth 
                />

                {/* Bairro */}
                <TextField
                    id="bairro" 
                    label="Bairro" 
                    variant="filled" 
                    value={cliente.bairro} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.bairro !== ''}
                    helperText={error.bairro}
                />

                {/* Município */}
                <TextField
                    id="municipio" 
                    label="Município" 
                    variant="filled" 
                    value={cliente.municipio} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.municipio !== ''}
                    helperText={error.municipio}
                />

                {/* UF */}
                <TextField 
                    id="uf" 
                    label="UF" 
                    variant="filled" 
                    value={cliente.uf} 
                    onChange={event => handleInputChange(event, 'uf')} 
                    fullWidth 
                    select
                    required
                    error={error.uf !== ''}
                    helperText={error.uf}
                > 
                    <MenuItem value="AC">Acre</MenuItem>
                    <MenuItem value="AL">Alagoas</MenuItem>
                    <MenuItem value="AP">Amapá</MenuItem>
                    <MenuItem value="AM">Amazonas</MenuItem>
                    <MenuItem value="BA">Bahia</MenuItem>
                    <MenuItem value="CE">Ceará</MenuItem>
                    <MenuItem value="DF">Distrito Federal</MenuItem>
                    <MenuItem value="ES">Espírito Santo</MenuItem>
                    <MenuItem value="GO">Goías</MenuItem>
                    <MenuItem value="MA">Maranhão</MenuItem>
                    <MenuItem value="MT">Mato Grosso</MenuItem>
                    <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                    <MenuItem value="MG">Minas Gerais</MenuItem>
                    <MenuItem value="PA">Pará</MenuItem>
                    <MenuItem value="PB">Paraíba</MenuItem>
                    <MenuItem value="PR">Paraná</MenuItem>
                    <MenuItem value="PE">Pernambuco</MenuItem>
                    <MenuItem value="PI">Piauí</MenuItem>
                    <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                    <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                    <MenuItem value="RO">Rondônia</MenuItem>
                    <MenuItem value="RR">Roraíma</MenuItem>
                    <MenuItem value="SC">Santa Catarina</MenuItem>
                    <MenuItem value="SP">São Paulo</MenuItem>
                    <MenuItem value="SE">Sergipe</MenuItem>
                    <MenuItem value="TO">Tocantins</MenuItem>
                </TextField>

                {/* Telefone */}
                <InputMask
                    formatChars={formatChars}
                    mask={telefoneMask}
                    value={cliente.telefone}
                    id="telefone"
                    onChange={event => handleInputChange(event, 'telefone')}
                >
                    {() => <TextField 
                                label="Telefone" 
                                variant="filled" 
                                fullWidth 
                                required
                                error={error.telefone !== ''}
                                helperText={error.telefone}
                            />}
                </InputMask>
 
                {/* Email */}
                <TextField
                    id="email" 
                    label="Email" 
                    variant="filled" 
                    value={cliente.email} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.email !== ''}
                    helperText={error.email}
                />
                
                <Toolbar className={classes.toolbar}>
                    <Button 
                        variant="contained"
                        onClick={handleGoBack}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="contained" 
                        color="secondary" 
                        type="submit"
                        disabled={btnSendState.disable}
                    >
                        {btnSendState.label}
                    </Button>
                </Toolbar>
            </form>
        </>
    )
}