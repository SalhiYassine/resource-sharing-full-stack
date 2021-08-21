import React from 'react'

const getStyle = (props) =>{
    let baseClass = ""
    if(props.message.msgError){
        baseClass = "alert-danger"
    }else{
        baseClass = "alert-primary"
    }
    return baseClass 
}

export const NotificationMSG = (props) => {
    return (
        <div className={`alert text-center ${getStyle(props)}`} role="alert">
            {props.message.msgBody}
            
        </div>
    )
}

export default NotificationMSG;