import './App.css';

import FooterBar from './ui/FooterBar'
import TopBar from './ui/TopBar'
import Box from '@material-ui/core/Box'

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import pink from '@material-ui/core/colors/pink';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import KarangosList from './routed/KarangosList2';
import KarangosForm from './routed/KarangosForm';
import ClientesList from './routed/ClientesList2';
import ClientesForm from './routed/ClientesForm';
import HomePage from './routed/HomePage';


const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: yellow[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});


const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingBottom: '42px'
  },
  routed: {
    padding: '25px',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
}));

function Main() {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      <BrowserRouter>
        <TopBar />
        <Box id="routed" className={classes.routed}>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route path="/list">
              <KarangosList />
            </Route>
            <Route path="/new">
              <KarangosForm />
            </Route>
            {/*  :id é um parâmetro (nomes de parâmetros começam com dois pontos) */}
            <Route path="/edit/:id">
              <KarangosForm />
            </Route>
            <Route path="/clientesList">
              <ClientesList />
            </Route>
            <Route path="/clientesNew">
              <ClientesForm />
            </Route>
            <Route path="/clientesEdit/:id">
              <ClientesForm />
            </Route>
          </Switch>
        </Box>
        <FooterBar />
      </BrowserRouter>
    </Box>
  )
}

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </div>

  );
}

export default App;