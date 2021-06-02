import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, FormControlLabel } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
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

/* 
    Classes de caracteres de entrada para a máscara do campo placa
    1) Três primeiras posições: qualquer letra, de A a Z (maiúsculo ou minúsculo) ~> [A-Za-z]
    2) Posições númericas (1º, a 3º e a 4º depois do traço) ~> [0-9]
    3) 2º posição após o traço: pode receber dígitos de A a J (maiúsculas ou minúsculas) ~> [0-9A-Ja-j]
*/

// Representando as classes de caracteres da máscara como um objeto
const formatChars = {    
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
}

// Finalmente, a máscara de entrada do campo placa
const emailCheck = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i

export default function ClientesForm() {
    const classes = useStyles()

    const [cliente, setCliente] = useState({
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        numero: '',
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
        numero: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
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
            // setCurrentId(event.target.id)
            // setKarango({ ...karango, [property]: event.target.value })
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
            numero: '',
            complemento: '',
            bairro: '',
            municipio: '',
            uf: '',
            telefone: '',
            email: ''
        }
        let isValid = true

        // Validação do campo nome
        if(data.nome.trim() === '') {
            errorTemp.nome = 'O nome deve ser preenchido'
            isValid = false
        }

        // Validação do campo CPF
        if(data.cpf.trim() === '') {
            errorTemp.cpf = 'O CPF deve ser preeenchido'
            isValid = false
        }

        // Validação do campo RG
        if(data.rg.trim() === '') {
            errorTemp.rg = 'O RG deve ser preenchido'
            isValid = false
        }

        setError(errorTemp)

        return isValid
    }

    const states = [
        { 'AC': 'Acre' },
        { 'AL': 'Alagoas' },
        { 'AP': 'Amapá' },
        { 'AM': 'Amazonas' },
        { 'BA': 'Bahia' },
        { 'CE': 'Ceará' },
        { 'DF': 'Distrito Federal' },
        { 'ES': 'Espírito Santo' },
        { 'GO': 'Goías' },
        { 'MA': 'Maranhão' },
        { 'MT': 'Mato Grosso' },
        { 'MS': 'Mato Grosso do Sul' },
        { 'MG': 'Minas Gerais' },
        { 'PA': 'Pará' },
        { 'PB': 'Paraíba' },
        { 'PR': 'Paraná' },
        { 'PE': 'Pernambuco' },
        { 'PI': 'Piauí' },
        { 'RJ': 'Rio de Janeiro' },
        { 'RN': 'Rio Grande do Norte' },
        { 'RS': 'Rio Grande do Sul' },
        { 'RO': 'Rondônia' },
        { 'RR': 'Roraíma' },
        { 'SC': 'Santa Catarina' },
        { 'SP': 'São Paulo' },
        { 'SE': 'Sergipe' },
        { 'TO': 'Tocantins' }
    ]

    function years() {
        let result = []
        for (let i = (new Date()).getFullYear(); i >= 1900; i--) result.push(i)
        return result
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
                <TextField
                    id="cpf" 
                    label="CPF" 
                    variant="filled" 
                    value={cliente.cpf} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.cpf !== ''}
                    helperText={error.cpf}
                />

                {/* RG */}
                <TextField
                    id="rg" 
                    label="RG" 
                    variant="filled" 
                    value={cliente.rg} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.rg !== ''}
                    helperText={error.rg}
                />

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
                    id="numero" 
                    label="Número" 
                    variant="filled" 
                    value={cliente.numero} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.numero !== ''}
                    helperText={error.numero}
                />

                {/* Complemento */}
                <TextField
                    id="complemento" 
                    label="Complemento" 
                    variant="filled" 
                    value={cliente.complemento} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.complemento !== ''}
                    helperText={error.complemento}
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
                    onChange={event => handleInputChange(event, 'cor')} 
                    fullWidth 
                    select
                    required
                    error={error.uf !== ''}
                    helperText={error.uf}
                > 
                    <MenuItem value="Acre">Acre</MenuItem>
                    <MenuItem value="Amazonas">Amazonas</MenuItem>
                    <MenuItem value="Bahia">Bahia</MenuItem>
                    <MenuItem value="Ceará">Ceará</MenuItem>
                    <MenuItem value="Distrito Federal">Distrito Federal</MenuItem>
                    <MenuItem value="Espírito Santo">Espírito Santo</MenuItem>
                    <MenuItem value="Goías">Goías</MenuItem>
                    <MenuItem value="Maranhão">Maranhão</MenuItem>
                    <MenuItem value="Mato Grosso">Mato Grosso</MenuItem>
                    <MenuItem value="Mato Grosso do Sul">Mato Grosso do Sul</MenuItem>
                    <MenuItem value="Minas Gerais">Minas Gerais</MenuItem>
                    <MenuItem value="Pará">Pará</MenuItem>
                    <MenuItem value="Paraíba">Paraíba</MenuItem>
                    <MenuItem value="Paraná">Paraná</MenuItem>
                    <MenuItem value="Pernambuco">Pernambuco</MenuItem>
                    <MenuItem value="Piauí">Piauí</MenuItem>
                    <MenuItem value="Rio de Janeiro">Rio de Janeiro</MenuItem>
                    <MenuItem value="Rio Grande do Sul">Rio Grande do Sul</MenuItem>
                    <MenuItem value="Rondônia">Rondônia</MenuItem>
                    <MenuItem value="Roraíma">Roraíma</MenuItem>
                    <MenuItem value="Santa Catarina">Santa Catarina</MenuItem>
                    <MenuItem value="São Paulo">São Paulo</MenuItem>
                    <MenuItem value="Sergipe">Sergipe</MenuItem>
                    <MenuItem value="Tocantis">Tocantins</MenuItem>
                </TextField>

                {/* Telefone */}
                <TextField
                    id="telefone" 
                    label="Telefone" 
                    variant="filled" 
                    value={cliente.telefone} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required
                    error={error.telefone !== ''}
                    helperText={error.telefone}
                />

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

                <div>{JSON.stringify(cliente)}<br /></div>
            </form>
        </>
    )
}