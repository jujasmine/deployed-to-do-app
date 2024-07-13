import {useState} from 'react'
import {useCookies} from 'react-cookie'

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogIn, setIsLogin] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)
    
  console.log(email, password, confirmPassword)

  // function to be used in switching the login and signup views in the auth componment
  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  // function to handle the submission of login and signup in the modal
  // e: event object, endpoint: string to represent API endpoint
  const handleSubmit = async(e, endpoint) => {
    // default behaviour of submitting a form is to refresh and the command below prevents it
    e.preventDefault()
    if(!isLogIn && password !== confirmPassword){
      setError('Make sure passwords match!')
      return
    }
    // makes a POST request with the fetch API to the web server 
    
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })

    // parsing the response
    const data = await response.json()
  
    // handling the response
    if (data.detail) { 
      // the detail property commonly indicates an error message so it is set as an error
      setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)
      console.log('Cookies Set:', cookies)
      // window is reloaded to reflect the logged in state of the user
      window.location.reload()
    }
  }
    
  return (
    <div className='auth-container'>
      <div className='auth-container-box'>
        <form>
          <h2>{isLogIn ? 'Please log in' : 'Please sign up'}</h2>
          <input 
            type="email"
            placeholder="email" 
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogIn && <input 
            type="password" 
            placeholder="confirm password"
            onChange = {(e) => setConfirmPassword(e.target.value)}
          />}
          <input type="submit" className="create" onClick={(e) => handleSubmit(e,isLogIn ? "login": "signup")}/>
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options"> 
          <button 
            onClick={() => viewLogin(false)}
            style={{backgroundColor : !isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)'}}
          >Sign Up</button>
          <button 
            onClick={() => viewLogin(true)}
            style={{backgroundColor : isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)'}}
            >Login</button>
        </div>
      </div>
    </div>
  )
}
  
 export default Auth 
  