const Notification = ({message, isSuccess}) => {
    const messageColor = isSuccess ? "green" : "red"
    if (message === null) {
        return null
    }
    return (
    <div className="error" style={{color: messageColor}}>
        {message}
    </div>

  )
}

export default Notification

