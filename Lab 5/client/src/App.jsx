import './App.css'
import Collection from './components/Collection'
import Comic from './components/Comic'
import Home from './components/Home'
import NotFound from './components/404'
import BadRequest from './components/400'
import Footer from './components/Footer'
import {Route, Link, Routes} from 'react-router-dom'


const  App = () =>{


  return (

    
    <div className = 'App'>
       <header className='App-header'>
        <h1 className= 'App-Title'> Welcome to the Marvel Collection</h1>
        <div className='center-button'>
            <Link className='ArtLink' to='/'>
             Home Page
            </Link>
            <div>
            <Link className = 'Marvel-Collection' to = '/marvel-comics/page/1'> 
            Explore Marvel Collections
            </Link>
            </div>
        </div>

       </header>
       <br/>
       <br/>
       <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/marvel-comics/page/:pageNum' element = {<Collection/>} />
        <Route path = '/marvel-comics/:id' element = {<Comic/>} />
        <Route path='/marvel-comics/page/' element = {<NotFound/>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/400" element={<BadRequest />} />
        <Route path="*" element = {<NotFound />} />
       </Routes>
       <Footer />
    </div>
  );

}

export default App