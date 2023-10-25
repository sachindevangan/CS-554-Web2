import './App.css'
import logo from './img/logo.png'
import Collection from './components/Collection'
import Art from './components/Art'
import Home from './components/Home'
import {Route, Link, Routes} from 'react-router-dom'


const App = () =>{

  return (

    
    <div className = 'App'>
       <header className='App-header'>
        <img src={logo} className='App-logo' alt = 'logo' />
        <h1 className= 'App-Title'> Welcome to the Metropolitan Museum of Art</h1>
        <Link className='ArtLink' to='/collection/page'>
          Arts
        </Link>
       </header>
       <br/>
       <br/>
       <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/collection/page' element = {<Collection/>} />
        <Route path = '/collection/page/:id' element = {<Art/>} />
       </Routes>
    </div>
  );
};

export default App
