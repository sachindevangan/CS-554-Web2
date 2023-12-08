import './App.css'
import Home from './components/Home'
import Authors from './components/Authors'
import AuthorDetail from './components/AuthorDetail'
import Books from './components/Books'
import BookDetail from './components/BookDetail'
import Search from './components/Search'
import NotFound from './components/404'
import BadRequest from './components/400'
import Footer from './components/Footer'
import {Route, Link, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'

const  App = () =>{


  return (

    
    <div className = 'App'>
       <header className='App-header'>
       <Navbar />
        <h1 className= 'App-Title'> Welcome to the Lab 7 of Web Programming - 2</h1>
        <div className='center-button'>
        </div>

       </header>
       <br/>
       <br/>
       <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/authors' element = {<Authors/>} />
        <Route path = '/authors/:id' element = {<AuthorDetail/>} />
        <Route path =  '/books' element = {<Books/>} />
        <Route path ='/books/:id' element = {<BookDetail/>} />
        <Route path = '/search' element = {<Search/>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/400" element={<BadRequest />} />
        <Route path="*" element = {<NotFound />} />
       </Routes>
       <Footer />
    </div>
  );

}

export default App