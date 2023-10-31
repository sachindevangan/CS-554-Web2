import './App.css'
import logo from './img/logo.png'
import Collection from './components/Collection'
import Art from './components/Art'
import Home from './components/Home'
import NotFound from './components/404'
import BadRequest from './components/400'
import Footer from './components/footer'
import {Route, Link, Routes} from 'react-router-dom'


const App = () =>{

  return (

    
    <div className = 'App'>
       <header className='App-header'>
        <img src={logo} className='App-logo' alt = 'logo' />
        <h1 className= 'App-Title'> Welcome to the Metropolitan Museum of Art</h1>
        <div className='center-button'>
            <Link className='ArtLink' to='/'>
             Home Page
            </Link>
            <div>
            <Link className = 'Art-Collection' to = '/collection/page/1'> 
            Explore Art Collections
            </Link>
            </div>
        </div>

       </header>
       <br/>
       <br/>
       <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/collection/page/:page' element = {<Collection/>} />
        <Route path = '/collection/:id' element = {<Art/>} />
        <Route path='/collection/page/' element = {<NotFound/>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/400" element={<BadRequest />} />
        <Route path="*" element = {<NotFound />} />
       </Routes>
       <Footer />
    </div>
  );
};

export default App
