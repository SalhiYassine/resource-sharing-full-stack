import React, {useState,useRef,useEffect} from 'react';
import AuthService from '../../Services/AuthService';
import Message from '../NotificationMSG';
import { Link } from "react-router-dom";


const Register = props=>{
    const [user,setUser] = useState({username: "", password : "", role : ""});
    const [message,setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const resetForm = ()=>{
        setUser({username : "", password : "",role : ""});
    }

    const onSubmit = e =>{
        e.preventDefault();
        AuthService.register(user.username, user.email, user.password).then(response=>{
            
            if(response.status == 200){
                resetForm();
                timerID = setTimeout(()=>{
                    props.history.push('/login');
                },500)
            }
        });
    }

    return(
        <div className="container form-container glass-styling ">
            <h2 className="text-primary m-5">Unifluent</h2>
            <form className="container " onSubmit={onSubmit}>
                <h4 className="">Register</h4>
                <label htmlFor="username" className="sr-only">Username: </label>
                <input type="text" 
                       name="username" 
                       value={user.username}
                       onChange={onChange} 
                       className="form-control m-1" s
                       placeholder="Enter Username"/>
                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       name="password"
                       value={user.password} 
                       onChange={onChange} 
                       className="form-control m-1" 
                       placeholder="Enter Password"/>
                <label htmlFor="role" className="sr-only">Email: </label>
                <input type="text" 
                       name="email"
                       value={user.email}  
                       onChange={onChange} 
                       className="form-control m-1" 
                       placeholder="Enter Email "/>
                       <div className="d-flex m-1">
                       <h6 className="m-1" >Already got an account?</h6>
                       <Link className="badge badge-info m-1 register-btn" to="/login">login</Link>
                       </div>

                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Register</button>
            {message ? <Message message={message}/> : null}
            </form>
        </div>
    )
}

export default Register;










// const RegisterPage = props=>{
//     const [user,setUser] = useState({username: "", password : "", role:""});
//     const [message,setMessage] = useState("");
//     const timerID = useRef(null);
    
//     useEffect(()=>{
//         clearTimeout(timerID)
//     },[])

//     const onChange = e =>{
//         console.log(user)
//         setUser({...user,[e.target.name] : e.target.value});
//     }

//     const onSubmit = e =>{
        
//         AuthService.register(user).then(data=>{ 
//           const {message} = data;
//           setMessage(message)
          
//           if(!message.msgError){
//               timerID = setTimeout(()=>{
//                   props.history.push('/login')
//             },160)
//           }
//         });
//     }

//     const resetForm = () =>{
//         setUser({username: "", password : "", role: ""})
//     }


//     return(
//         <div className="container" >
//             <form onSubmit={onSubmit}>
//                 <h3>Please Register</h3>
//                 <label htmlFor="username" className="sr-only">Username: </label>
//                 <input type="text" 
//                        name="username" 
//                        onChange={onChange} 
//                        className="form-control" 
//                        placeholder="Enter Username"/>
//                 <label htmlFor="role" className="sr-only">Username: </label>
//                 <input type="text" 
//                        name="role" 
//                        onChange={onChange} 
//                        className="form-control" 
//                        placeholder="Enter Role"/>
//                 <label htmlFor="password" className="sr-only">Password: </label>
//                 <input type="password" 
//                        name="password" 
//                        onChange={onChange} 
//                        className="form-control" 
//                        placeholder="Enter Password"/>
//                 <button className="btn btn-lg btn-primary btn-block" 
//                         type="submit">Register</button>
//             </form>
//             {message ? <Message message={message}/> : null}
//         </div>
//     )
// }

// export default RegisterPage;